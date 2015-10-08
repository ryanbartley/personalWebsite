Texture.Format = function ( width, height, internalFormat, format, type, data ) {
	var cGl = cinder.getGl();
	this.mTarget = cGl.TEXTURE_2D;
	this.mInternalFormat = internalFormat || cGl.RGBA;
	this.mSize = new Vec2i( width || cinder.getContext().width, 
		height || cinder.getContext().height );
	this.mMipmapping = false;
	this.mPixelFormat = format || cGl.RGBA;
	this.mPixelType = type || cGl.UNSIGNED_BYTE;
	this.mWrapS = cGl.REPEAT; 
	this.mWrapT = cGl.REPEAT;
	this.mMinFilter = cGl.LINEAR;
	this.mMagFilter = cGl.LINEAR;
	this.mMaxAnisotropy = 0;
	this.data = data || null;

	return this;
};

Texture.Format.prototype.constructor = Texture.Format;
Texture.Format.prototype.setData = function(data) { this.data = data; },
Texture.Format.prototype.setPixelType = function(type) { this.texType = type; },
Texture.Format.prototype.setPixelFormat = function(format) { this.texFormat = format; },
Texture.Format.prototype.setInternalFormat = function(internalFormat) { this.texInternalFormat = internalFormat; },
Texture.Format.prototype.enableMipmapping = function(mipmap) {
	if( mipmap === undefined || mipmap === true ) {
		this.mMipmapping = true;
	}
	else {
		this.mMipmapping = false;
	}
};
Texture.Format.prototype.setWrap = function(wrapS, wrapT) {
	if( wrapS !== undefined ) {
		this.wrapS = wrapS;
	}
	if( wrapT !== undefined ) {
		this.wrapT = wrapT; 
	}
};
	// Here we should make the static Texture Formats for Depth Texture and Depth_Stencil Texture;
Texture.Format.getDefaultColorTextureFormat = function (width, height, alpha) {
	if( alpha || alpha === undefined ) {
		return new Texture.Format( width, height, 
			cinder.getGl().RGBA, cinder.getGl().RGBA, 
			cinder.getGl().UNSIGNED_BYTE, null
		);
	}
	else {
		return new Texture.Format( width, height, 
			cinder.getGl().RGB, cinder.getGl().RGB, 
			cinder.getGl().UNSIGNED_BYTE, null
		);
	}
};
Texture.Format.getDefaultDepthTextureFormat = function (width, height) {
	return new Texture.Format( width, height, 
		cinder.getGl().DEPTH_COMPONENT, cinder.getGl().DEPTH_COMPONENT,
		cinder.getGl().UNSIGNED_SHORT, null 
	);
};
Texture.Format.createDefaultDepthStencilTextureFormat = function (width, height) {
	return new Texture.Format( width, height, 
		cinder.getGl().DEPTH_STENCIL, cinder.getGl().DEPTH_STENCIL, 
		cinder.getGl().UNSIGNED_INT_24_8_WEBGL, null
	);
};
Texture.Format.getDepthStencilFormats = function ( depthInternalFormat, gl ) {
	var ext = CINDER.GetExtensionEarly("WEBGL_depth_texture");
	if( ext ) { 
		switch( depthInternalFormat ) {
			case gl.DEPTH_STENCIL_OES:
				return { resultInternalFormat: gl.DEPTH_STENCIL, resultPixelDataType: ext.UNSIGNED_INT_24_8_OES };
			break;
			case GL_DEPTH_COMPONENT:
				return { resultInternalFormat: gl.DEPTH_COMPONENT, resultPixelDataType: gl.UNSIGNED_SHORT };
			break;
		}
	}
};

function Texture (format) {

	TextureBase.call(this);
	
	var cGl  			= cinder.getGl();
	this.ctx 			= cinder.getContext();

	this.mTextureId 	= cGl.createTexture();
	this.mTarget 		= format.mTarget;

	this.mWidth			= format.mSize.getX();
	this.mCleanWidth	= this.mWidth;
	this.mHeight 		= format.mSize.getY();
	this.mCleanHeight 	= this.mHeight;
	this.mFlipped 		= false;

	this.mDepthTexExt 	= null;
	this.mMaxAnisoExt 	= null;

	this.mSize			= format.mSize;
	this.mMipmapping	= format.mMipmapping;
	this.mPixelFormat 	= format.mPixelFormat;
	this.mPixelType		= format.mPixelType;
	this.mWrapS			= format.mWrapS;
	this.mWrapT			= format.mWrapT;
	this.mMinFilter		= format.mMinFilter;
	this.mMagFilter 	= format.mMagFilter;
	
	this.setupTextureExtensions(format);

	this.bind();

	this.initParams( format, cGl.RGBA );

	this.initData( format.data, 0, format.mPixelDataFormat, format.mPixelType, format );

	this.unbind();

	return this;
}

Texture.prototype = Object.create( TextureBase.prototype );
Texture.prototype.constructor = Texture;
Texture.prototype.initData = function ( data, unpackRowLength, dataFormat, type, format ) {
	var cGl = cinder.getGl();
	if( this.mTarget === cGl.TEXTURE_2D ) {
		this.mMaxU = this.mMaxV = 1.0;
	}
	else {
		this.mMaxU = this.mWidth;
		this.mMaxV = this.mHeight;
	}

	cGl.pixelStorei( cGl.UNPACK_ALIGNMENT, 1 );
	cGl.texImage2D( this.mTarget, 0, this.mInternalFormat, this.mWidth, this.mHeight, 0, this.mPixelFormat, this.mPixelType, data );

	if( format.mMipmapping ) {
		cGl.generateMipmap(this.mTarget);
	}
};
Texture.prototype.update = function (data, level) {

};
Texture.prototype.getLeft = function() { return 0.0; };
Texture.prototype.getRight = function () { return this.mMaxU; };
Texture.prototype.getTop = function () { return ( this.mFlipped ) ? this.getMaxV() : 0.0; };
Texture.prototype.getBottom = function () { return ( this.mFlipped ) ? 0.0 : this.getMaxV(); };
Texture.prototype.getWidth = function () { return this.mWidth; };
Texture.prototype.getHeight = function () { return this.mHeight; };
Texture.prototype.getCleanWidth = function () { return this.mCleanWidth; };
Texture.prototype.getCleanHeight = function () { return this.mCleanHeight; };
Texture.prototype.getMaxU = function () { return this.mMaxU; };

Texture.prototype.getMaxV = function () { return this.mMaxV; };

function TextureBase () {
	this.type = CINDER.TYPES.TEX;
};

TextureBase.prototype.constructor = TextureBase;
TextureBase.prototype.delete = function () { 
	if ( ( mTextureId ) && ( ! mDoNotDispose ) ) {
		var ctx = cinder.getContext();
		if( ctx ) {
			ctx.textureDeleted( mTarget, mTextureId );
			glDeleteTextures( mTextureId );
		}
	} };
TextureBase.prototype.initParams = function (format, defaultInternalFormat) {
	var cGl = cinder.getGl();

	if( this.mWrapS !== cGl.REPEAT ) {
		console.log("inside mWrapS");
		cGl.texParameteri( this.mTarget, cGl.TEXTURE_WRAP_S, format.mWrapS );
	}
	if( this.mWrapT !== cGl.REPEAT ) {
		console.log("inside mWrapT");
		cGl.texParameteri( this.mTarget, cGl.TEXTURE_WRAP_T, format.mWrapS );
	}
	// TODO: implement the mMinFilterSpecified
	if( this.mMipmapping && format.mMinFilterSpecified ) {
		format.mMinFilter = cGl.LINEAR_MIPMAP_LINEAR;
	}
	if( this.mMinFilter != cGl.NEAREST_MIPMAP_LINEAR ) {
		cGl.texParameteri( this.mTarget, cGl.TEXTURE_MIN_FILTER, format.mMinFilter );
	}
	if( this.mMagFilter !== cGl.LINEAR ) {
		cGl.texParameteri( this.mTarget, cGl.TEXTURE_MAG_FILTER, format.mMagFilter );
	}
	
	// TODO: Implement the anisotropy extension
	if( this.mMaxAnisotropy > 1.0 && this.mMaxAnisoExt ) {
		// cGl.texParameteri
		cinder.getGl().texParameterf( this.mTarget, this.mMaxAnisoExt.TEXTURE_MAX_ANISOTROPY_EXT, anisotropy );
	}

	if( this.mInternalFormat === -1 ) {
		this.mInternalFormat = defaultInternalFormat;
	}
	else {
		this.mInternalFormat = format.mInternalFormat;
	}

	if( this.mPixelDataFormat === -1 ) {
		this.mPixelDataFormat = this.mInternalFormat;
	}

	this.mMipmapping = format.mMipmapping;
};
TextureBase.prototype.getInternalFormat = function () { return this.mInternalFormat; };
TextureBase.prototype.getId = function () { return this.mTextureId; };
TextureBase.prototype.getTarget = function () { return this.mTarget; };
TextureBase.prototype.bind = function (textureUnit) { 
	this.ctx.setActiveTexture( textureUnit || 0 ); 
	this.ctx.bindTexture(this.mTarget, this.mTextureId); 
}; //TODO: FIGURE THIS OUT},
TextureBase.prototype.unbind = function (textureUnit) { 
	this.ctx.setActiveTexture( textureUnit || 0 );
	this.ctx.bindTexture(this.mTarget, null); 
};
TextureBase.getBindingConstantForTarget = function (target) {
	var cGl = cinder.getGl();
	switch( target ) {
		case cGl.TEXTURE_2D:
			return cGl.TEXTURE_BINDING_2D;
		break;
		case cGl.TEXTURE_CUBE_MAP:
			return cGl.TEXTURE_BINDING_CUBE_MAP;
		break;
		default: 
			return 0;
	}
};
// TODO: Check these values before sending them Also, checkout if I should unbind these things
TextureBase.prototype.setWrapS = function(wrapS) { 
	this.bind();
	cinder.getGl().texParameteri( this.mTarget, cinder.getGl().TEXTURE_WRAP_S, wrapS );
	// this.unbind();
}
TextureBase.prototype.setWrapT = function(wrapT) {
	this.bind();
	cinder.getGl().texParameteri( this.mTarget, cinder.getGl().TEXTURE_WRAP_T, wrapT );
	// this.unbind();
};
TextureBase.prototype.setMagFilter = function(magFilter) {
	this.bind();
	cinder.getGl().texParameteri( this.mTarget, cinder.getGl().TEXTURE_MAG_FILTER, magFilter );
	// this.unbind();
};
TextureBase.prototype.setMinFilter = function(minFilter) {
	this.bind();
	cinder.getGl().texParameteri( this.mTarget, cinder.getGl().TEXTURE_MIN_FILTER, minFilter );
	// this.unbind();
};
// TODO: make this work.
TextureBase.prototype.setMaxAnisotropy = function(anisotropy) {
	if( this.mMaxAnisoExt ) {
		this.bind()
		cinder.getGl().texParameterf( this.mTarget, this.mMaxAnisoExt.TEXTURE_MAX_ANISOTROPY_EXT, anisotropy );
	}
};
TextureBase.prototype.hasMipmapping = function () { return this.mMipmapping; };

// Static Functions

TextureBase.SurfaceChannelOrderToDataFormatAndType = function ( surChanoOrd, dataFormat, type ) {
	// TODO: FIX THIS
	// switch( surChanoOrd.getCode() ) {
	// 	case SurfaceChannelOrder.RGB: {
	// 		*dataFormat = GL_RGB;
	// 		*type = GL_UNSIGNED_BYTE;
	// 	}
	// 	break;
	// 	case SurfaceChannelOrder.RGBA:
	// 	case SurfaceChannelOrder.RGBX:
	// 		*dataFormat = GL_RGBA;
	// 		*type = GL_UNSIGNED_BYTE;
	// 	break;
	// 	case SurfaceChannelOrder.BGRA:
	// 	case SurfaceChannelOrder.BGRX:
	// 		*dataFormat = GL_BGRA_EXT;
	// 		*type = GL_UNSIGNED_BYTE;
	// 	break;
	// 	default:
	// 		throw TextureDataExc( "Invalid channel order" ); // this is an unsupported channel order for a texture
	// 	break;
	// }
};
TextureBase.dataFormatHasAlpha = function (dataFormat) {
	var cGl = cinder.getGl();
	switch( dataFormat ) {
		case cGl.RGBA:
		case cGl.ALPHA:
		case cGl.LUMINANCE_ALPHA:
			return true;
		break;
		default:
			return false;
	}
};
TextureBase.dataFormatHasColor = function (dataFormat) {
	var cGl = cinder.getGl();
	switch( dataFormat ) {
		case cGl.ALPHA:
		case cGl.LUMINANCE:
		case cGl.LUMINANCE_ALPHA:
			return false;
	}
	
	return true;
};
TextureBase.calcMipLevelSize = function (level, width, height) {
	width = Math.max( 1, Math.floor( width >> mipLevel ) );
	height = Math.max( 1, Math.floor( height >> mipLevel ) );
	
	return new Vec2i( width, height );
};
TextureBase.getMaxMaxAnisotropy = function () {
	if( this.mMaxAnisoExt ) {
		this.bind()
		var maxMaxAnisotropy = cinder.getGl().getParameter( ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT );
		return maxMaxAnisotropy;
	}
	else {
		throw "ERROR: Texture.getMaxMaxAnisotropy - Extension not available";
	}
	
	
};
// Returns ResultInternalFormat and resultPixelDataType as an object
TextureBase.getInternalFormats = function (internalFormat) {
	var cGl = cinder.getGl();
	switch( depthInternalFormat ) {
		case cGl.RGBA:
			return {resultInternalFormat: cGl.RGBA, resultPixelDataType: cGl.UNSIGNED_BYTE };
		break;
		// case cGl.DEPTH_STENCIL:
		// 	return {resultInternalFormat: cGl.RGBA, resultPixelDataType: cGl.UNSIGNED_BYTE };
		// 	*resultInternalFormat = DEPTH_STENCIL; *resultPixelDataType = GL_UNSIGNED_INT_24_8_OES;
		// break;
		// case GL_DEPTH_COMPONENT:
		// 	*resultInternalFormat = GL_DEPTH_STENCIL_OES; *resultPixelDataType = GL_UNSIGNED_INT_24_8_OES;
		// 	break;
	}
};

TextureBase.prototype.getMaxAnisoExtension = function () { return this.mMaxAnisoExt; };
TextureBase.prototype.setMaxAnisoExtension = function (anisoExt) { this.mMaxAnisoExt = anisoExt; };
TextureBase.prototype.getDepthTexExtension = function () { return this.mDepthTexExt; };
TextureBase.prototype.setDepthTexExtension = function(ext) { this.mDepthTexExt = ext; };

TextureBase.prototype.getSize = function () { return this.mSize; };
TextureBase.prototype.getWidth = function () { return this.mSize.getX(); };
TextureBase.prototype.getHeight = function () { return this.mSize.getY(); };
TextureBase.prototype.getPixelFormat = function () { return this.mPixelFormat; };
TextureBase.prototype.getPixelType = function () { return this.mPixelType; };
TextureBase.prototype.getWrapS = function () { return this.mWrapS; };
TextureBase.prototype.getWrapT = function () { return this.mWrapT; };


TextureBase.prototype.setupTextureExtensions = function (format) { 
	if( format.depthTexture ) {
		var depthTexture = CINDER.GetExtensionEarly( "WEBGL_depth_texture" );
		if( !depthTexture ) { 
			throw "The depth texture extension is not available"; 
		}
		else { 
			this.setDepthTexExtension(depthTexture); 
		}
	}
	else if( format.mAnisotropy > 1.0 ) { // Anisotropic
		var anisotropic = CINDER.GetExtensionEarly( "EXT_texture_filter_anisotropic" );
		if( !anisotropic ) {
			throw "ERROR: TextureBase.setupTextureExtensions - The texture anisotropic extension is not available"; 
		}
		else {
			this.setMaxAnisoExtension(anisotropic);
		}
	} 
};


Texture.getPowerOfTwo = function (value, pow) {
	var pow = pow || 1;
	while(pow < value) {
		pow *= 2;
	}
	return pow;
};


