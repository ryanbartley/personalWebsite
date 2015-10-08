function Fbo (format) {
	
	this.mId 				= null;
	this.mTarget			= cinder.getGl().FRAMEBUFFER;
	this.mSize				= format.size;
	this.mColorAttachment 	= null;
	this.mDepthAttachment 	= null;
	this.mStencilAttachment = null;
	this.type 				= CINDER.TYPES.FBO;

	// Bind current Framebuffer to set the attachments
	console.log("checking", this);

	this.init(format);

	return this;
};

Fbo.prototype.getId = function () { return this.mId; };
Fbo.prototype.getTarget = function () { return this.mTarget; };
Fbo.prototype.getSize = function () { return this.mSize; };
Fbo.prototype.getColorAttachment = function () { return this.mColorAttachment; };
Fbo.prototype.setColorAttachment = function (attach) { this.mColorAttachment = attach };
Fbo.prototype.getDepthAttachment = function () { return this.mDepthAttachment; };
Fbo.prototype.setDepthAttachment = function (attach) { this.mDepthAttachment = attach };
Fbo.prototype.getStencilAttachment = function () { return this.mStencilAttachment; };
Fbo.prototype.setStencilAttachment = function (attach) { this.mStencilAttachment; }; 
Fbo.prototype.markAsDirty = function () {
	// for( const auto &textureAttachment : mAttachmentsTexture ) {
	// 	if( textureAttachment.second->hasMipmapping() )
	// 		mNeedsMipmapUpdate = true;
	// }
}
Fbo.prototype.constructor = Fbo;
Fbo.prototype.bind = function () { cinder.getContext().bindFramebuffer(this.mId, this.mTarget); };
Fbo.prototype.unbind = function () { cinder.getContext().unbindFramebuffer(); };
Fbo.prototype.delete = function () { cinder.getGl().deleteFramebuffer( this.getId() ); };
Fbo.prototype.bindTexture = function (textureUnit) { 
	if( this.mColorAttachment instanceof Texture ) {
		this.mColorAttachment.bind(textureUnit); 
	}
	else {
		throw "ERROR: FBO.bindTexture - Trying to bind a renderbuffer as texture or mColorAttachment is undefined";
	}
};
Fbo.prototype.bindDepthTexture = function (textureUnit) { 
	if( this.mDepthAttachment instanceof Texture && depthTex !== undefined ) {
		depthTex.bind(textureUnit); 
	}
	else {
		throw "ERROR: FBO.bindDepthTexture - Trying to bind a depthbuffer as texture or mDepthAttachment is undefined";
	}
};
Fbo.prototype.getWidth = function() { return this.getSize().getX(); };
Fbo.prototype.getHeight = function() { return this.getSize().getY(); };
Fbo.prototype.init = function (format) {
	var cGl = cinder.getGl();
	var ctx = cinder.getContext();

	this.mId = cGl.createFramebuffer();
	this.bind();

	this.initializeColorAttachment(format);
	console.log("---------------------------------------")
	this.initializeDepthAttachment(format);
	console.log("---------------------------------------")
	this.initializeStencilAttachment(format);
	console.log("---------------------------------------")

	Fbo.checkStatus();
	this.unbind();
};
Fbo.prototype.initializeColorAttachment = function (format) {
	// Add the correct renderbuffers to the correct attachments
	if( format.colorTexture ) {
		// Create the texture after checking that it's there

		var colorTexFormat = Fbo.checkColorTextureFormat(format.colorTextureFormat, format.size);
		console.log("this should be colorTexFormat", colorTexFormat);
		this.setColorAttachment( new Texture( colorTexFormat ) );

		var colorTex = this.getColorAttachment();

		// Now Bind it the framebuffer
		cinder.getGl().framebufferTexture2D(
			cinder.getGl().FRAMEBUFFER, cinder.getGl().COLOR_ATTACHMENT0,
			colorTex.getTarget(), colorTex.getId(), 0 
		);
		console.log("I set framebufferTexture2D");
	}
	else if( format.colorBuffer ) {
		this._setColorAttachment( new Renderbuffer(  ) );

		var colorBuf = this._getColorAttachment();
		
		cinder.getGl().framebufferRenderbuffer( 
			cinder.getGl().FRAMEBUFFER, cinder.getGl().COLOR_ATTACHMENT0, 
			cinder.getGl().RENDERBUFFER, colorBuf.getId() 
		);
	}
};
Fbo.prototype.initializeDepthAttachment = function (format) {
	if( format.depthTexture ) {
		// Create the texture after checking that it's there
		// TODO: Figure out how to mark that we need the DEPTH TEXTURE
		console.log("I made it here")
		var depthTexFormat = this.checkDepthTextureFormat(format.depthTexFormat, format.stencilBuffer);
		
		this._setDepthAttachment( new Texture( depthTexFormat ) );
		// Now Bind it the framebuffer
		var depthTex = this._getDepthAttachment();

		if( depthTex.getInternalFormat() === cinder.getGl().DEPTH_COMPONENT ) {
			cinder.getGl().framebufferTexture2D( 
				cinder.getGl().FRAMEBUFFER, cinder.getGl().DEPTH_ATTACHMENT, 
				depthTex.getTarget(), depthTex.getId(), 0 
			);
			console.log("in DEPTH_COMPONENT");
		}
		else if( depthTex.getInternalFormat() === cinder.getGl().DEPTH_STENCIL ) {
			cinder.getGl().framebufferTexture2D( 
				cinder.getGl().FRAMEBUFFER, cinder.getGl().DEPTH_STENCIL_ATTACHMENT, 
				depthTex.getTarget(), depthTex.getId(), 0 
			);
			console.log("DEPTH_STENCIL");
		}
	}
	else if ( format.depthBuffer ) {
		// TODO: THIIIIISISSSSSSSSSSSSS
		// Implement the same check for this as well
		mDepthAttachment = new Renderbuffer( format );
		console.log("CREATED RENDERBUFFER");
	}
};
Fbo.prototype.initializeStencilAttachment = function (format) {
	if( ! mDepthAttachment && format.stencilBuffer ) {
		// create stencil render buffer
	}
};
// STATIC FUNCTIONS FOR FBO

Fbo.checkColorTextureFormat = function (format, size) {
	if( ! (format instanceof Texture.Format) ) {
		format = Texture.Format.createDefaultColorTextureFormat(size.getX(), size.getY());
	}
	return format;
};
Fbo.checkColorRenderbufferFormat = function (format) {

};
Fbo.checkDepthTextureFormat = function (format, stencil) {
	if( ! stencil ) {
		if( ! (format instanceof Texture.Format) ) {
			format = this.createDefaultDepthTextureFormat();
		}
	}
	else {
		if( ! (format instanceof Texture.Format) ) {
			format = this.createDefaultDepthStencilTextureFormat();
		}
	}
	return format;
};
Fbo.checkDepthRenderbufferFormat = function (format, stencil) {
};
Fbo.checkStatus = function() {
	var status = cinder.getGl().checkFramebufferStatus(cinder.getGl().FRAMEBUFFER);
	console.log("status", status);
	switch(status) {
		case cinder.getGl().FRAMEBUFFER_COMPLETE: console.log("I made it through successfully");
		break;
		case cinder.getGl().FRAMEBUFFER_UNSUPPORTED:
			throw "Framebuffer format unsupported";
		break;
		case cinder.getGl().FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
			throw "Framebuffer attachment incomplete";
		break;
		case cinder.getGl().FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
			throw "Framebuffer incomplete dimensions";
		break;
		case cinder.getGl().FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
			throw "Framebuffer incomplete missing attachment"
		break;
		default: 
			throw "Something's wrong";
	}
};

function Renderbuffer (format) {

	this.mId 			= cinder.getGl().createRenderbuffer();
	this.mTarget 		= cinder.getGl().RENDERBUFFER;
	this.mInternalFormat= format.internalFormat;
	this.mSize 			= format.size;

	this.init();

	return this;
};

Renderbuffer.prototype.bind = function () { cinder.getGl().bindRenderbuffer( this.mTarget, this.mId ); };
Renderbuffer.prototype.init = function () { 
	this.bind();
	cinder.getGl().renderbufferStorage( this.mTarget, this.mInternalFormat, this.getWidth(), this.getHeight() );
}
Renderbuffer.prototype.getId = function () { return this.mId; };
Renderbuffer.prototype.getTarget = function () { return this.mTarget; };
Renderbuffer.prototype.getInternalFormat = function () { return this.mInternalFormat; };
Renderbuffer.prototype.getWidth = function () { return this.mSize.getX(); };
Renderbuffer.prototype.getHeight = function () { return this.mSize.getY(); };
Renderbuffer.prototype.getSize = function () { return this.mSize; };

// Static functions on Fbo

Fbo.Format = function(width, height, internalFormat) {
	this.size = new Vec2i( width || 0, height || 0 );
	this.internalFormat = internalFormat || cinder.getGl().RGBA4;
	
	this.colorBuffer = false;
	this.colorTexture = true;
	this.depthBuffer = true;
	this.depthTexture = false;
	this.stencilBuffer = false;

	this.colorTexFormat = null;
	this.depthTexFormat = null;

	return this;
};

Fbo.Format.prototype.constructor = Fbo.Format;
Fbo.Format.prototype.colorTexture = function (textureFormat) {
	this.mColorTextureFormat = textureFormat || Texture.Format.getDefaultColorTexture();
	this.mColorTexture = true;
	return this;
};
Fbo.Format.prototype.colorBuffer = function (internalFormat) {
	this.mColorBufferInternalFormat = internalFormat || Fbo.Format.getDefaultColorInternalFormat();
	this.mColorBuffer = true;
	return this;
};
Fbo.Format.prototype.disableColor = function () {
	this.mColorBuffer = this.mColorTexture = false;
	return this;
};

Fbo.Format.prototype.depthTexture = function (textureFormat) {
	this.mDepthTextureFormat = textureFormat || Texture.Format.getDefaultDepthTexture();
	this.mDepthTexture = true;
	return this;
};
Fbo.Format.prototype.depthBuffer = function (internalFormat) {
	this.mDepthBufferInternalFormat = internalFormat || Fbo.Format.getDefaultDepthInternalFormat();
	this.mDepthBuffer = true;
	return this;
};
Fbo.Format.prototype.disableDepth = function () {
	this.mDepthBuffer = this.mDepthTexture = false;
	return this;
};

Fbo.Format.prototype.stencil = function (stencilBuffer) {
	this.mStencilBuffer = stencilBuffer || true;
}

Fbo.Format.prototype.setColorTexFormat = function (colorTexFormat) {
	this.colorTexture = true;
	this.colorBuffer = false;
	this.colorTexFormat = colorTexFormat;
};
Fbo.Format.prototype.setDepthTexFormat = function(depthTexFormat) {
	this.depthTexture = true;
	this.depthBuffer = false;
	this.depthTexFormat = depthTexFormat;
};
Fbo.Format.prototype.enableStencil = function(stencil) {
	if( stencil === undefined || stencil === true ) {
		this.stencil = true;
	}
};
Fbo.Format.prototype.setSize = function (size) { this.size.copy(size); };
Fbo.Format.prototype.setWidth = function (width) { this.size.setX(width); };
Fbo.Format.prototype.setHeight = function (height) { this.size.setY(height); };

