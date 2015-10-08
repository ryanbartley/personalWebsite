// TODO: Break this into subclasses VaoSoftware and VaoHardware 
// that makes the decision when the user calls Vao.create()

///////////////////////////////////////////////////////////////////////////
// VAO Class Implementing VaoHardware or VaoSoftware if extension isn't available
///////////////////////////////////////////////////////////////////////////

function Vao () {

	this.mFreshBindPrevious = // TODO: FIGURE THIS OUT
	this.mLayout 			= new Vao.Layout();
	this.mCtx				= cinder.getContext();

	this.init();

	return this;
};

Vao.prototype = Object.create( CINDER.GetExtensionEarly("OES_vertex_array_object") ? VaoHardwareImpl.prototype : VaoSoftwareImpl.prototype );
Vao.prototype.constructor = Vao;
Vao.prototype.getId = function () { return this.mId; };
Vao.prototype.getLayout = function () { return this.mLayout; };
Vao.prototype.bind = function () { this.mCtx.bindVao(this); };
Vao.prototype.unbind = function () { this.mCtx.bindVao(null); };
Vao.prototype.init = function () { 
	var vaoExtension = cinder.getContext().getExtension("OES_vertex_array_object");

	if( vaoExtension ) {
		VaoHardwareImpl.call(this, vaoExtension);
	}
	else {
		VaoSoftwareImpl.call(this, null);
	}
};
Vao.prototype.setContext = function (context) { this.mCtx = context; };
Vao.prototype.freshBindPre = function () {
	this.mFreshBindPrevious = this.mLayout;
	this.bind();
	// a fresh VAO would 
	this.mCtx.bindBuffer( cinder.getGl().ELEMENT_ARRAY_BUFFER, null );
};
// TODO: Try this out. it looks dirty.
Vao.prototype.freshBindPost = function () {
	// disable any attributes which were enabled in the previous layout
	for( var attrib in this.mFreshBindPrevious.mVertexAttribs ) {
		// existing is an int index
		var existing = this.mLayout.mVertexAttribs[attrib];
		if( this.mFreshBindPrevious.mVertexAttribs[attrib].mEnabled && ( ( existing === undefined ) || 
			( ! this.mLayout.mVertexAttribs[attrib].mEnabled) ) ) {
			console.log("I'm deleting", attrib);
			disableVertexAttribArrayImpl( attrib );
		}
	}

	// TODO: if the user never bound an ELEMENT_ARRAY_BUFFER, they assumed it was 0, so we should make that so by caching whether they changed it
};
Vao.create = function () { return new Vao(); };

///////////////////////////////////////////////////////////////////////////
// Vao Hardware Source Base Class
///////////////////////////////////////////////////////////////////////////

function VaoHardwareImpl (extension) {
	this.extension = extension;
	this.mId = this.extension.createVertexArrayOES();
	this.divisorExtension = cinder.getContext().getExtension("ANGLE_instanced_arrays");
};

VaoHardwareImpl.prototype.constructor = VaoHardwareImpl;
VaoHardwareImpl.prototype.deleteImpl = function () { this.extension.deleteVertexArrayOES(this.mId);	};
VaoHardwareImpl.prototype.bindImpl = function (context) {
	var cGl = cinder.getGl();

	this.extension.bindVertexArrayOES( this.mId );
	if( context ) {
		context.reflectBufferBinding( cGl.ELEMENT_ARRAY_BUFFER, this.mLayout.mElementArrayBufferBinding );
		this.mLayout.mCachedArrayBufferBinding = context.getBufferBinding( cGl.ARRAY_BUFFER );
	}
};
VaoHardwareImpl.prototype.unbindImpl = function (context) { 
	this.extension.bindVertexArrayOES( null ); 

	context.invalidateBufferBindingCache( cinder.getGl().ELEMENT_ARRAY_BUFFER );
};
VaoHardwareImpl.prototype.enableVertexAttribArrayImpl = function (index) {
	if( ! this.mLayout.isVertexAttribArrayEnabled( index ) ) {
		this.mLayout.enableVertexAttribArray( index );
		cinder.getGl().enableVertexAttribArray( index );
	}
};
VaoHardwareImpl.prototype.disableVertexAttribArrayImpl = function (index) {
	this.mLayout.disableVertexAttribArray( index );

	cinder.getGl().disableVertexAttribArray( index );
};
VaoHardwareImpl.prototype.vertexAttribPointerImpl = function ( index, size, type, normalized, stride, pointer ) {
	if( ! this.mLayout.isVertexAttribEqual( index, size, type, normalized, stride, Vao.VertexAttrib.FLOAT, pointer, this.mLayout.mCachedArrayBufferBinding ) ) {
		this.mLayout.vertexAttribPointer( index, size, type, normalized, stride, pointer );
		cinder.getGl().vertexAttribPointer( index, size, type, normalized, stride, pointer );
	}
};
VaoHardwareImpl.prototype.vertexAttribDivisorImpl = function ( index, divisor ) {
	if( this.divisorExtension ) {// not always available
		this.mLayout.vertexAttribDivisor( index, divisor );
		this.divisorExtension.vertexAttribDivisorANGLE( index, divisor );
	}
	else {
		throw "ERROR: VaoHardwareImpl.vertexAttribDivisorImpl - Extension not available";
	}
};
VaoHardwareImpl.prototype.reflectBindBufferImpl = function ( target, buffer ) {
	this.mLayout.bindBuffer( target, buffer );
	cinder.getGl().bindBuffer( target, buffer );
};

///////////////////////////////////////////////////////////////////////////
// VAO Software Source Base Class
///////////////////////////////////////////////////////////////////////////

function VaoSoftwareImpl (extension) {
	this.extension = extension;
	this.mId = null;
	this.divisorExtension = cinder.getContext().getExtension("ANGLE_instanced_arrays");
};

VaoSoftwareImpl.prototype.constructor = VaoSoftwareImpl;
VaoHardwareImpl.prototype.deleteImpl = function () { };
VaoSoftwareImpl.prototype.bindImpl = function (context) {
	if( ! context )
			return;

	var cGl = cinder.getGl();
	var oldBuffer = context.getBufferBinding( cinder.getGl().ARRAY_BUFFER );
	var attribs = this.mLayout.mVertexAttribs;

	for( var index in attribs ) {
		if( attribs[ index ].mEnabled ) {
			cGl.enableVertexAttribArray( index );
			cGl.bindBuffer( cGl.ARRAY_BUFFER, attribs[ index ].mArrayBuffer );
			cGl.vertexAttribPointer( index, attribs[ index ].mSize, 
				attribs[ index ].mType, attribs[ index ].mNormalized, 
				attribs[ index ].mStride, attribs[ index ].mPointer 
			);
		}
	}

	context.bindBuffer( cGl.ELEMENT_ARRAY_BUFFER, this.mLayout.mElementArrayBuffer );
	context.bindBuffer( cGl.ARRAY_BUFFER, oldBuffer );
};
VaoSoftwareImpl.prototype.unbindImpl = function (context) {
	var attribs = this.mLayout.mVertexAttribs;
	for( var index in attribs ) {
		if( attribs[index].mEnabled ) {
			cinder.getGl().disableVertexAttribArray( index );
		}
	}
	context.invalidateBufferBindingCache( cinder.getGl().ELEMENT_ARRAY_BUFFER );
}
VaoSoftwareImpl.prototype.enableVertexAttribArrayImpl = function ( index ) {
	if( ! this.mLayout.isVertexAttribArrayEnabled( index ) ) {
		this.mLayout.enableVertexAttribArray( index );
		cinder.getGl().enableVertexAttribArray( index );
	}
};
VaoSoftwareImpl.prototype.disableVertexAttribArrayImpl = function ( index ) {
	mLayout.disableVertexAttribArray( index );

	cinder.getGl().disableVertexAttribArray( index );
};
VaoSoftwareImpl.prototype.vertexAttribPointerImpl = function ( index, size, type, normalized, stride, pointer ) {
	this.mLayout.vertexAttribPointer( index, size, type, normalized, stride, pointer );

	cinder.getGl().vertexAttribPointer( index, size, type, normalized, stride, pointer );
};
VaoSoftwareImpl.prototype.vertexAttribDivisorImpl = function ( index, divisor ) {
	if( this.divisorExtension ) {// not always available
		this.mLayout.vertexAttribDivisor( index, divisor );
		this.divisorExtension.vertexAttribDivisor( index, divisor );
	}
	else {
		throw "ERROR: VaoSoftwareImpl.vertexAttribDivisorImpl - Extension not available";
	}
};
VaoSoftwareImpl.prototype.reflectBindBufferImpl = function ( target, buffer ) {
	this.mLayout.bindBuffer( target, buffer );
	cinder.getGl().bindBuffer( target, buffer );
};

///////////////////////////////////////////////////////////////////////////
// VAO VertexAttrib Object
///////////////////////////////////////////////////////////////////////////

Vao.VertexAttrib = function ( size, type, normalized, stride, pointerType, pointer, arrayBuffer, divisor ) {
	this.mEnabled = false;
	this.mSize = size || 0;
	this.mType = type || cinder.getGl().FLOAT;
	this.mNormalized = normalized || false;
	this.mStride = normalized || 0;
	this.mPointerType = pointerType || Vao.VertexAttrib.PointerType.FLOAT;
	this.mPointer = pointer || 0;
	this.mArrayBuffer = arrayBuffer || 0;
	this.mDivisor = divisor || 0;

	this.setDivisor = function ( divisor ) {
		this.mDivisor = divisor;
	};

	return this;
};
Vao.VertexAttrib.PointerType = {
	FLOAT: 0,
	INTEGER: 1
};

///////////////////////////////////////////////////////////////////////////
// VAO Layout Object
///////////////////////////////////////////////////////////////////////////

Vao.Layout = function (argument) {
	this.cGl = cinder.getGl();
	this.mVertexAttribs = {};
	return this;
};
Vao.Layout.prototype.constructor = Vao.Layout;
//! The equivalent of glBindBuffer( \a target, \a binding )
Vao.Layout.prototype.bindBuffer = function ( target, buffer ) {
	var cGl = cinder.getGl();
	if( target == cGl.ARRAY_BUFFER )
		this.mCachedArrayBufferBinding = buffer;
	else if( target == cGl.ELEMENT_ARRAY_BUFFER )
		this.mElementArrayBuffer = buffer;
};
//! Returns whether the vertex attribute array at \a index is enabled or not
Vao.Layout.prototype.isVertexAttribArrayEnabled = function ( index ) {
	var existing = this.mVertexAttribs[ index ];
	if( existing ) {
		return existing.mEnabled;
	}
	else {
		return false;
	}
};
//! The equivalent of glEnableVertexAttribArray( \a index )
Vao.Layout.prototype.enableVertexAttribArray = function ( index ) {
	var existing = this.mVertexAttribs[ index ];
	if( existing ) {
		existing.mEnabled = true;
	}
	else {
		this.mVertexAttribs[index] = new Vao.VertexAttrib();
		this.mVertexAttribs[index].mEnabled = true;
	}
};
//! The equivalent of glDisableVertexAttribArray( \a index )
Vao.Layout.prototype.disableVertexAttribArray = function ( index ) {
	var existing = this.mVertexAttribs[ index ];
	if( existing ) {
		existing.mEnabled = false;
	}
	else {
		this.mVertexAttribs[index] = new VertexAttrib();
		this.mVertexAttribs[index].mEnabled = false;
	}
};
//! Sets the vertex attribute data
Vao.Layout.prototype.vertexAttribPointer = function ( index, size, type, normalized, stride, pointer ) {
	var existing = this.mVertexAttribs[ index ];
	var enabled = ( existing ) && ( existing.mEnabled );
	this.mVertexAttribs[index] = new Vao.VertexAttrib( size, type, normalized, stride, Vao.VertexAttrib.PointerType.FLOAT, pointer, this.mCachedArrayBuffer );
	this.mVertexAttribs[index].mEnabled = enabled;
};
//! Returns whether the existing attribPointer information at \a index is equal to the supplied params
Vao.Layout.prototype.isVertexAttribEqual = function ( index, size, type, normalized, stride, pointerType, pointer, arrayBufferBinding ) {
	var existing = this.mVertexAttribs[ index ];
	if( existing ) {
		return existing.mSize == size
			&& existing.mType == type
			&& existing.mNormalized == normalized
			&& existing.mStride == stride
			&& existing.mPointerType == pointerType
			&& existing.mPointer == pointer
			&& existing.mArrayBuffer == arrayBufferBinding;
	}
	else
		return false;
};
//! Sets the instancing divisor
Vao.Layout.prototype.vertexAttribDivisor = function ( index, divisor ) {
	var existing = this.mVertexAttribs[ index ];
	if( ! existing )
		this.mVertexAttribs[index] = new Vao.VertexAttrib();

	this.mVertexAttribs[index].mDivisor = divisor;
};
//! Sets to the equivalent of a newly bound VAO (which means it does not overwrite the mCachedArrayBufferBinding value)
Vao.Layout.prototype.clear = function () {
	this.mElementArrayBuffer = null;
	this.mVertexAttribs = {};
};
















