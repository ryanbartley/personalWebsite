Vbo  = function(format) {
	BufferObj.call(this, format.target, format.size, format.data, format.usage);
	return this;
};

Vbo.prototype = Object.create( BufferObj.prototype );
Vbo.prototype.constructor = Vbo;
Vbo.create = function (format) { return new Vbo(format); };
Vbo.Format = function ( target, size, data, usage ) {
	this.target = target || cinder.getGl().ARRAY_BUFFER;
	this.size 	= size || 0;
	this.data 	= data || null;
	this.usage 	= usage || cinder.getGl().STATIC_DRAW;

	return this;
};

Vbo.Format.prototype.constructor = Vbo.Format
Vbo.Format.prototype.setTarget = function (target) { this.target = target; };
Vbo.Format.prototype.setSize = function (size) { this.size = size; };
Vbo.Format.prototype.setData = function (data) { this.data = data; };
Vbo.Format.prototype.setUsage = function (usage) { this.usage = usage; };

function BufferObj (target, allocationSize, data, usage) {
	var cGl = cinder.getGl();

	this.mId = cGl.createBuffer();
	this.mSize = allocationSize || 0;
	this.mTarget = target || cGl.ARRAY_BUFFER;
	this.mUsage = usage || cGl.STATIC_DRAW;

	if( this.mSize !== 0 || data !== null ) {
		this.bufferData(this.mSize, data);
	}

	return this;
};

BufferObj.prototype.constructor = BufferObj;
BufferObj.prototype.bind = function () { cinder.getContext().bindBuffer(this.mTarget, this.mId); };
BufferObj.prototype.unbind = function () { cinder.getContext().bindBuffer(this.mTarget, null); };
BufferObj.prototype.delete = function () { 
	var ctx = cinder.getContext();
	if( ctx ) {
		ctx.bufferDeleted( this.mTarget, this.mId );
	}
	cinder.getGl().deleteBuffer(this.mId); 
};
BufferObj.prototype.bufferData = function (size, data) {
	this.bind();
	if( data === null && this.mSize !== 0 ) {
		cinder.getGl().bufferData( this.mTarget, this.mSize, this.mUsage );
	}
	else if( data !== null ){
		cinder.getGl().bufferData( this.mTarget, data, this.mUsage );
	}
};
BufferObj.prototype.bufferSubData = function (offset, data) {
	this.bind();
	cinder.getGl().bufferSubData( this.mTarget, offset, data );
};
BufferObj.prototype.ensureMinimumSize = function (minimumSize) {
	if( this.mSize < minimumSize ) {
		this.mSize = minimumSize;
		this.bind();
		cinder.getGl().bufferData(this.mTarget, this.mSize, this.mUsage);
	}
}
BufferObj.prototype.getId = function () { return this.mId; };
BufferObj.prototype.getSize = function () { return this.mSize; };
BufferObj.prototype.getTarget = function () { return this.mTarget; };
BufferObj.prototype.setTarget = function( target ) { this.mTarget = target; };
BufferObj.prototype.getUsage = function () { return this.mUsage; };
BufferObj.prototype.setUsage = function ( usage ) { this.mUsage = usage; };
BufferObj.getBindingConstantForTarget = function ( target ) {
	var cGl = cinder.getGl();
	switch( target ) {
		case cGl.ARRAY_BUFFER:
			return cGl.ARRAY_BUFFER_BINDING;
		case cGl.ELEMENT_ARRAY_BUFFER:
			return cGl.ELEMENT_ARRAY_BUFFER_BINDING;
		default:
			return null;
	}
}