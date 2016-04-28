CINDER.Context = function (canvasId, attributes) {
	
	var mAttributes 		= attributes;
	var mCanvas 			= document.getElementById(canvasId);
	var mGl 				= mCanvas.getContext("experimental-webgl", mAttributes);
	var mCachedExtensions 	= {};
	var mCachedVbo			= null;
	var mCachedVao			= null;
	var mCachedGlsl			= null;
	var mCachedFbo			= null;
	var mCachedTexture 		= null;
	var mColor				= new ColorA.white();
	var mStockShaders		= {};
	var mCachedState		= {};
	var mProjectionStack 	= [];
	var mModelViewStack		= [];
	var mBlendSrcRgbStack   = [];
	var mBlendDstRgbStack   = [];
    var mBlendSrcAlphaStack = [];
    var mBlendDstAlphaStack = [];
    var mVaoStack 			= [];
    var mScissorStack 		= [];
    var mViewportStack		= [];
    var mBufferBindingStack = {};
    var mGlslProgStack		= [];
    var mTextureBindingStack= {};
    var mFramebufferStack 	= [];
    var mActiveTextureStack = [];
    var mBoolStateStack		= {};
    var mColor 				= ColorA.white();
    var mDefaultArrayVbo    = new Array(4);


	this.getGl = function () { return mGl; };
	this.getCanvas = function () { return mCanvas; };
	this.getAttributes = function () { return mAttributes; };
	this.getExtensions = function () { return mCachedExtensions; };
	this.getVao = function () { return mCachedVao; };
	this.getVbo = function () { return mCachedVbo; };
	this.getGlsl = function () { return mCachedGlsl; };
	this.getFbo = function () { return mCachedFbo; };
	this.getTexture = function () { return mCachedTexture; };
	this.getState = function () { return mCachedState; };
	this.getProjectionStack = function () { return mProjectionStack; };
	this.getModelViewStack = function () { return mModelViewStack; };
	this.getCurrentColor = function () { return mColor; };
	this.setCurrentColor = function (color) { mColor = color; };

	this.init = function () {
		
		// setup default VAO
		mDefaultVao = Vao.create();
		mVaoStack.push( mDefaultVao );
		// Implement this function
		mDefaultVao.setContext( this );
		mDefaultVao.bindImpl();
		
		mBufferBindingStack[cinder.getGl().ARRAY_BUFFER] = [];
		mBufferBindingStack[cinder.getGl().ARRAY_BUFFER].push( 0 );
		mBufferBindingStack[cinder.getGl().ELEMENT_ARRAY_BUFFER] = [];
		mBufferBindingStack[cinder.getGl().ELEMENT_ARRAY_BUFFER].push( 0 );
			
		mFramebufferStack.push( 0 );
		mDefaultArrayVboIdx = 0;
	
		// initial state for depth mask is enabled
		mBoolStateStack[cinder.getGl().DEPTH_WRITEMASK] = [];
		mBoolStateStack[cinder.getGl().DEPTH_WRITEMASK].push( cinder.getGl().TRUE );
		mActiveTextureStack.push( 0 );
	
		// mImmediateMode = gl::VertBatch::create();
		
		var params = cinder.getGl().getParameter( cinder.getGl().VIEWPORT );
		mViewportStack.push( new OrigDim( new Vec2i( params[ 0 ], params[ 1 ] ), new Vec2i( params[ 2 ], params[ 3 ] ) ) );
	    
		params = cinder.getGl().getParameter( cinder.getGl().SCISSOR_BOX );
		mScissorStack.push( new OrigDim( new Vec2i( params[ 0 ], params[ 1 ] ), new Vec2i( params[ 2 ], params[ 3 ] ) ) );
	
		var queriedInt;
		queriedInt = cinder.getGl().getParameter( cinder.getGl().BLEND_SRC_RGB );
		mBlendSrcRgbStack.push( queriedInt );
		queriedInt = cinder.getGl().getParameter( cinder.getGl().BLEND_DST_RGB );
		mBlendDstRgbStack.push( queriedInt );
		queriedInt = cinder.getGl().getParameter( cinder.getGl().BLEND_SRC_ALPHA );
		mBlendSrcAlphaStack.push( queriedInt );
		queriedInt = cinder.getGl().getParameter( cinder.getGl().BLEND_DST_ALPHA );
		mBlendDstAlphaStack.push( queriedInt );
	    
	    mModelViewStack.push( new Matrix44f() );
		mProjectionStack.push( new Matrix44f() );
		mGlslProgStack.push( null );
		
		this.setupExtensions();
	};
	///////////////////////////////////////////////////////////////////////////////////////////
	// draw*
	this.drawArrays = function ( mode, first, count ) {
		cinder.getGl().drawArrays( mode, first, count );
	};
	this.drawElements = function ( mode, count, type, indices ) {
		cinder.getGl().drawElements( mode, count, type, indices );
	};
	this.drawArraysInstanced = function ( mode, first, count, primcount ) {
		// TODO: Figure this implementation correctly
		var extension = this.getExtension("ANGLE_instanced_arrays")
		if( extension ) {
			extension.drawArraysInstancedANGLE( mode, first, count, primcount );
		}
		else {
			throw "ERROR: Context drawElementsInstanced - You don't have the extension for this";
		}
	};
	this.drawElementsInstanced = function ( mode, count, type, indices, primcount ) {
		// TODO: Figure this implementation correctly
		var extension = this.getExtension("ANGLE_instanced_arrays")
		if( extension ) {
			extension.drawElementsInstancedANGLE( mode, count, type, indices, primcount );
		}
		else {
			throw "ERROR: Context drawElementsInstanced - You don't have the extension for this";
		}
	};
	this.clearColor = function (color) {
		cinder.getGl().clearColor(color.r(), color.g(), color.b(), color.a());
	};
	this.setupExtensions = function () {
		var array = mGl.getSupportedExtensions();
		for (var i = 0; i < array.length; i++) {
			mCachedExtensions[array[i]] = mGl.getExtension(array[i]); 
		};
	};
	this.getExtension = function (name) {
		if( ! mCachedExtensions[name] ) {
			var extension = mGl.getExtension(name);
			if( ! extension ) {
				return null
			}
			else {
				return mCachedExtensions[name] = extension;
			}
		}
		else {
			return mCachedExtensions[name];
		}
	};
	this.pushMatrices = function () {
		mProjectionStack.push(new Matrix44f(mProjectionStack[mProjectionStack.length-1]));
		mModelViewStack.push(new Matrix44f(mModelViewStack[mModelViewStack.length-1]));
	};
	this.popMatrices = function () {
		mProjectionStack.pop();
		mModelViewStack.pop();
	};
	//////////////////////////////////////////////////////////////////
	// VAO
	/* // Original implementation
	this.bindVao = function (vao) {
		if( vao === null ) {
			mCachedVao = null;
		}
		else if( vao !== mCachedVao ) {
			if( mCachedVao instanceof Vao ) {
				mCachedVao.unbind();
			}
			mCachedVao = vao;
			mCachedVao._bindImpl();
		}
	}; */
	this.bindVao = function ( vao ) {
		var prevVao = this.getVao();
		if( this.setStackState( mVaoStack, vao ) ) {
			if( prevVao )
				prevVao.unbindImpl(this);
			if( vao )
				vao.bindImpl(this);	
		}
	};
	this.pushVao = function (vao) {
		var prevVao = this.getVao();
		if( this.pushStackState( mVaoStack, vao ) ) {
			if( prevVao )
				prevVao.unbindImpl(this);
			if( vao )
				vao.bindImpl(this);
		}
	};
	this.pushVao = function () {
		mVaoStack.push( this.getVao() );
	};
 	this.popVao = function () {
		var prevVao = this.getVao();
	
		if( mVaoStack.length !== 0 ) {
			mVaoStack.pop();
			if( mVaoStack !== 0 ) {
				if( prevVao != mVaoStack[mVaoStack.length-1] ) {
					if( prevVao )
						prevVao.unbindImpl(this);
					if( mVaoStack[mVaoStack.length-1] )
						mVaoStack[mVaoStack.length-1].bindImpl();
				}
			}
			else {
				if( prevVao )
					prevVao.unbindImpl(this);
			}
		}
	};
	this.getVao = function () {
		if( mVaoStack.length !== 0 ) {
			return mVaoStack[mVaoStack.length-1];
		}
		else {
			return null;
		}
	};
	//////////////////////////////////////////////////////////////////
	// Viewport
	// TODO: Implement OrigDim
	this.viewport = function ( viewportOrigDim ) {
		if( this.setStackState( mViewportStack, viewportOrigDim ) ) {
			cinder.getGl().viewport( 
				viewportOrigDim.components[0], viewportOrigDim.components[1], 
				viewportOrigDim.components[2], viewportOrigDim.components[3] 
			);
		}
	};
	this.pushViewport = function ( viewportOrigDim ) {
		if( this.pushStackState( mViewportStack, viewportOrigDim ) ) { 
			cinder.getGl().viewport( 
				viewportOrigDim.origin.x(), viewportOrigDim.origin.y(), 
				viewportOrigDim.dimension.x(), viewportOrigDim.dimension.y() 
			);
		}
	};
	this.pushViewport = function () {
		mViewportStack.push( this.getViewport() );
	};
	this.popViewport = function () {
		if( mViewportStack.length === 0 || this.popStackState( mViewportStack ) ) {
			var viewport = this.getViewport();
			cinder.getGl().viewport( viewport.origin.x(), viewport.origin.y(), viewport.dimension.x(), viewport.dimension.y() );
		}
	};
	this.getViewport = function () {
		if( mViewportStack.length === 0 ) {
			var cGl = cinder.getGl();
			var params = cGl.getParameter( cGl.VIEWPORT );
			// push twice in anticipation of later pop
			// TODO: Implement OrigDim for viewport and scissor
			var viewport = new OrigDim( new Vec2i( params[0], params[1] ), new Vec2i( params[2], params[3] ) );
			// TODO: This could probably be better implemented
			mViewportStack.push( new OrigDim( viewport ) );
			mViewportStack.push( new OrigDim( viewport ) );
		}
	
		return mViewportStack[mViewportStack.length-1];
	};
	//////////////////////////////////////////////////////////////////
	// Scissor Test  
	this.setScissor = function ( scissorOrigDim ) {
		if( this.setStackState( mScissorStack, scissorOrigDim ) ) { 
			cinder.getGl().scissor( 
				scissorOrigDim.origin.x(), scissorOrigDim.origin.y(), 
				scissorOrigDim.dimension.x(), scissorOrigDim.dimension.y() 
			);
		}
	};
	this.pushScissor = function ( scissorOrigDim ) {
		if( this.pushStackState( mScissorStack, scissorOrigDim ) ) { 
			cinder.getGl().scissor( 
				scissorOrigDim.origin.x, scissorOrigDim.origin.y, 
				scissorOrigDim.dimension.x, scissorOrigDim.dimension.y 
			);
		}
	};
	this.pushScissor = function () {
		mScissorStack.push( this.getScissor() );
	};
	this.popScissor = function () {
		if( mScissorStack.length === 0 || this.popStackState( mScissorStack ) ) {
			var scissor = this.getScissor();
			cinder.getGl().scissor( scissor.origin.x, scissor.origin.y, scissor.dimension.x, scissor.dimension.y );
		}
	};
	this.getScissor = function () {
		if( mScissorStack.length === 0 ) {
			var cGl = cinder.getGl();
			var params = cGl.getParameter( cGl.SCISSOR_BOX ); 
			// push twice in anticipation of later pop
			var scissor = new OrigDim( new Vec2i( params[ 0 ], params[ 1 ] ), new Vec2i( params[ 2 ], params[ 3 ] ) );
			mScissorStack.push( new OrigDim( scissor ) );
			mScissorStack.push( new OrigDim( scissor ) );
		}
	
		return mScissorStack[mScissorStack.length-1];
	};
	//////////////////////////////////////////////////////////////////
	// Buffer
	/* Original implementation
	this.bindVbo = function (vbo) {
		if( vbo !== mCachedVbo ) {
			mCachedVbo = vbo;
			mCachedVbo._bindImpl();
		}
	},*/
	this.bindBuffer = function ( target, id ) {
		var cGl = cinder.getGl();
		var prevValue = this.getBufferBinding( target );
		if( prevValue != id ) {
			var curBufferStack = mBufferBindingStack[target];
			curBufferStack[curBufferStack.length-1] = id;
			if( target == cGl.ARRAY_BUFFER || target == cGl.ELEMENT_ARRAY_BUFFER ) {
				var vao = this.getVao();
				if( vao ) {
					vao.reflectBindBufferImpl( target, id );
				}
				else {
					cGl.bindBuffer( target, id );
				}
			}
			else {
				cGl.bindBuffer( target, id );
			}
		}
	};
	this.pushBufferBinding = function ( target, id ) {
		this.pushBufferBindingImpl( target );
		this.bindBuffer( target, id );
	};
	this.pushBufferBindingImpl = function ( target ) {
		var curValue = this.getBufferBinding( target );
		mBufferBindingStack[target].push( curValue );
	};
	this.popBufferBinding = function ( target ) {
		var cGl = cinder.getGl();
		var prevValue = this.getBufferBinding( target );
		var cachedStack = mBufferBindingStack[ target ];
		cachedStack.pop();
		if( cachedStack.length !== 0 && cachedIt[cachedIt.length-1] !== prevValue ) {
			if( target === cGl.ARRAY_BUFFER || target == cGl.ELEMENT_ARRAY_BUFFER ) {
				var vao = this.getVao();
				if( vao ) {
					vao.reflectBindBufferImpl( target, cachedStack[cachedStack.length-1] );
				}
				else {
					cGl.bindBuffer( target, cachedStack[cachedStack.length-1] );
				}
			}
			else {
				cGl.bindBuffer( target, cachedIt[cachedStack.length-1] );
			}
		}
	};
	this.getBufferBinding = function ( target ) {
		var cachedStack = mBufferBindingStack[ target ];
		if( ( ! cachedStack) || ( cachedStack.length === 0 ) || ( cachedStack[cachedStack.length-1] == -1 ) ) {
			
			var queriedInt = 0;
			// IMPORTANT
			var targetBinding = BufferObj.getBindingConstantForTarget( target );
			if( targetBinding > 0 ) {
				queriedInt = cinder.getGl().getParameter( targetBinding );
			}
			else {
				return 0; // warning?
			}
			var cachedStack = mBufferBindingStack[target];
			if( cachedStack.length === 0 ) { // bad - empty stack; push twice to allow for the pop later and not lead to an empty stack
				mBufferBindingStack[target] = [];
				mBufferBindingStack[target].push( queriedInt );
				mBufferBindingStack[target].push( queriedInt );			
			}
			else
				cachedStack[cachedStack.length-1] = queriedInt;
			return queriedInt;
		}
		else {
			return cachedStack[cachedStack.length-1];
		}
	};
	this.reflectBufferBinding = function ( target, id ) {
		// first time we've met this target; start an empty stack
		if( mBufferBindingStack[target] ) {
			mBufferBindingStack[target] = [];
			mBufferBindingStack[target].push( id );
		}
		else if( mBufferBindingStack[target].length !== 0 ) {
			var cachedStack = mBufferBindingStack[target]; 
			cachedStack[cachedStack.length-1] = id;
		}
	};
	////////// TODO: I need to figure out if this will work because vbo id's are objects
	//// IDEA TO TRY NULL INSTEAD OF ZERO AND -1
	this.bufferDeleted = function ( target, id ) {
		// if 'id' was bound to 'target', mark 'target's binding as 0
		var existingStack = mBufferBindingStack[target];
		if( existingStack ) {
			if( existingStack[existingStack.length-1] === id )
				existingStack[existingStack.length-1] = null;
		}
		else {
			mBufferBindingStack[target] = [];
			mBufferBindingStack[target].push( 0 );
		}
	};
	this.invalidateBufferBindingCache = function ( target ) {
		var existingStack = mBufferBindingStack[target];
		if( ! existingStack ) {
			mBufferBindingStack[target] = [];
			mBufferBindingStack[target].push( -1 );
		}
		else if( existingStack.length !== 0 ) {
			existingStack[existingStack.length-1] = -1;
		}
	};
	//////////////////////////////////////////////////////////////////
	// Shader
	/* Original Implementation
	this.bindGlsl = function (glsl) {
		if( glsl !== mCachedGlsl ) {
			if( mCachedGlsl instanceof GlslProg ) {
				mCachedGlsl.unbindImpl();
			}
			mCachedGlsl = glsl;
			mCachedGlsl.bindImpl();
		}
	}, */
	this.pushGlslProg = function ( prog ) {
		var prevGlsl = this.getGlslProg();
	
		mGlslProgStack.push( prog );
		if( prog !== prevGlsl ) {
			if( prog ) {
				prog.bindImpl();
			}
			else {
				cinder.getGl().useProgram( null );
			}
		}
	};
	this.pushGlslProg = function () {
		mGlslProgStack.push( this.getGlslProg() );
	};
	this.popGlslProg = function () {
		var prevGlsl = this.getGlslProg();
	
		if( mGlslProgStack.length !== 0 ) {
			mGlslProgStack.pop();
			if( mGlslProgStack.length !== 0 ) {
				if( prevGlsl != mGlslProgStack[mGlslProgStack.length-1] ) {
					if( mGlslProgStack[mGlslProgStack.length-1] ) {
						mGlslProgStack[mGlslProgStack.length-1].bindImpl();
					}
					else {
						cinder.getGl().useProgram( null );
					}
				}
			}
		}
	};
	this.bindGlslProg = function ( prog ) {
		if( mGlslProgStack.length === 0 || mGlslProgStack[mGlslProgStack.length-1] !== prog ) {
			if( mGlslProgStack.length !== 0 ) {
				mGlslProgStack[mGlslProgStack.length-1] = prog;
			}
			if( prog ) {
				prog.bindImpl();
			}
			else {
				cinder.getGl().useProgram( null );
			}
		}
	};
	this.getGlslProg = function () {
		if( mGlslProgStack.length === 0 ) {
			mGlslProgStack.push( null );
		}
		
		return mGlslProgStack[mGlslProgStack.length-1];
	};
	//////////////////////////////////////////////////////////////////
	// TextureBinding
	/* Original Implementation
	this.bindTexture = function (texture) {
		if( texture !== mCachedTexture ) {
			
		}
	}, */
	this.bindTexture = function ( target, textureId ) {
		var prevValue = this.getTextureBinding( target );
		if( prevValue != textureId ) {
			var curStack = mTextureBindingStack[target];
			curStack[curStack.length-1] = textureId;
			cinder.getGl().bindTexture( target, textureId );
		}
	};
	this.pushTextureBinding = function( target, textureId ) {
		this.pushTextureBindingImpl( target );
		this.bindTexture( target, textureId );
	};
	this.pushTextureBindingImpl = function ( target ) {
		var curValue = this.getTextureBinding( target );
		mTextureBindingStack[target].push( curValue );
	};
	this.popTextureBinding = function ( target ) {
		var cached = mTextureBindingStack[target];
		if( ( cached ) && ( cached.length !== 0 ) ) {
			var prevValue = cached[cached.length-1];
			cached.pop();
			if( cached.length !== 0 ) {
				if( cached[cached.length-1] !== prevValue )
					cinder.getGl().bindTexture( target, cached[cached.length-1] );
			}
		}
	};
	// TODO: Implement this function and test it
	this.getTextureBinding = function ( target ) {
		var cachedTex = mTextureBindingStack[target];
		if( ( !cachedTex ) || ( cachedTex.length !== 0 ) || ( cachedTex[cachedTex.length-1] === -1 ) ) {
			var queriedInt = null;
			// TODO: Implement this function in Texture
			var targetBinding = TextureBase.getBindingConstantForTarget( target );
			
			if( targetBinding !== undefined ) {
				queriedInt = cinder.getGl().getParameter( targetBinding );
			}
			else {
				// TODO: Decide whether to throw.
				return 0; // warning?
			}
			var curStack = mTextureBindingStack[target];
			
			if( curStack === undefined ) { // bad - empty stack; push twice to allow for the pop later and not lead to an empty stack
				mTextureBindingStack[target] = [];
				mTextureBindingStack[target].push( queriedInt );
				mTextureBindingStack[target].push( queriedInt );		
			}
			else {
				curStack[curStack.length-1] = queriedInt;
			}
			return queriedInt;
		}
		else {
			return cachedTex[cachedTex.length-1];
		}
	};
	this.textureDeleted = function ( target, textureId ) {
		var cachedTex = mTextureBindingStack[ target ];
		if( cachedTex  && ( cachedTex.length !== 0 ) && ( cachedTex[cachedTex.length-1] !== textureId ) ) {
			// GL will have set the binding to 0 for target, so let's do the same
			// TODO: need to go through any deletion and make sure they're null and not zero
			cachedTex[cachedTex.length-1] = null;
		}
	};
	//////////////////////////////////////////////////////////////////
	// ActiveTexture
	this.setActiveTexture = function ( textureUnit ) {
		if( this.setStackState( mActiveTextureStack, textureUnit ) ) {
			var cGl = cinder.getGl();
			cGl.activeTexture( cGl.TEXTURE0 + textureUnit );
		}
	};
	this.pushActiveTexture = function ( textureUnit ) {
		if( this.pushStackState( mActiveTextureStack, textureUnit ) ) {
			var cGl = cinder.getGl();
			cGl.activeTexture( cGl.TEXTURE0 + textureUnit );
		}
	};
	this.pushActiveTexture = function () {
		this.pushStackState( mActiveTextureStack, this.getActiveTexture() );
	};
	//! Sets the active texture unit; expects values relative to \c 0, \em not GL_TEXTURE0
	this.popActiveTexture = function () {
		if( mActiveTextureStack.length === 0 || this.popStackState( mActiveTextureStack ) ) {
			var cGl = cinder.getGl();
			cGl.activeTexture( cGl.TEXTURE0 + this.getActiveTexture() );
		}
	};
	this.getActiveTexture = function () {
		if( mActiveTextureStack.length === 0 ) {
			var queriedInt;
			var cGl = cinder.getGl();
			queriedInt = cGl.getParameter( cGl.ACTIVE_TEXTURE );
			// push twice to account for inevitable pop to follow
			mActiveTextureStack.push( queriedInt - cGl.TEXTURE0 );
			mActiveTextureStack.push( queriedInt - cGl.TEXTURE0 );
		}
	
		return mActiveTextureStack[mActiveTextureStack.length-1];
	};
	//////////////////////////////////////////////////////////////////
	// Framebuffers
	// TODO: check on multisampled 
	// this.bindFramebuffer = function ( target, framebuffer ) {
		// #if ! defined( SUPPORTS_FBO_MULTISAMPLING )
		
		// #else
		// 	if( target == GL_FRAMEBUFFER ) {
		// 		bool readRequiresBind = setStackState<GLint>( mReadFramebufferStack, framebuffer );
		// 		bool drawRequiresBind = setStackState<GLint>( mDrawFramebufferStack, framebuffer );
		// 		if( readRequiresBind || drawRequiresBind )
		// 			glBindFramebuffer( GL_FRAMEBUFFER, framebuffer );
		// 	}
		// 	else if( target == GL_READ_FRAMEBUFFER ) {
		// 		if( setStackState<GLint>( mReadFramebufferStack, framebuffer ) )
		// 			glBindFramebuffer( target, framebuffer );
		// 	}
		// 	else if( target == GL_DRAW_FRAMEBUFFER ) {
		// 		if( setStackState<GLint>( mDrawFramebufferStack, framebuffer ) )
		// 			glBindFramebuffer( target, framebuffer );		
		// 	}
		// 	else {
		// 		//throw gl::Exception( "Illegal target for Context::bindFramebuffer" );	
		// 	}
		// #endif
	// };
	///////// TODO: Figure out if multisampling works
	// void Context::pushFramebuffer( GLenum target, GLuint framebuffer )
	// {
	// #if ! defined( SUPPORTS_FBO_MULTISAMPLING )
		
	// #else
	// 	if( target == GL_FRAMEBUFFER || target == GL_READ_FRAMEBUFFER ) {
	// 		if( pushStackState<GLint>( mReadFramebufferStack, framebuffer ) )
	// 			glBindFramebuffer( GL_READ_FRAMEBUFFER, framebuffer );
	// 	}
	// 	if( target == GL_FRAMEBUFFER || target == GL_DRAW_FRAMEBUFFER ) {
	// 		if( pushStackState<GLint>( mDrawFramebufferStack, framebuffer ) )
	// 			glBindFramebuffer( GL_DRAW_FRAMEBUFFER, framebuffer );	
	// 	}
	// #endif
	// }
	/* Original Implementation
	this.bindFramebuffer = function (fbo) {
		if( fbo !== mCachedFbo  )
	} */
	this.bindFramebuffer = function( fbo, target ) {
		var cGl = cinder.getGl();
		if( target === cGl.FRAMEBUFFER ) {
			if( this.setStackState( mFramebufferStack, fbo ) ){
				cGl.bindFramebuffer( target, fbo );
			}
		}
		else {
			throw "Illegal target for Context::bindFramebuffer";	
		}
		
	};
	this.unbindFramebuffer = function () { this.bindFramebuffer( null, cinder.getGl().FRAMEBUFFER ); };
	this.pushFramebuffer = function ( fbo, target ) {
		var cGl = cinder.getGl();
		if( fbo.type !== undefined ) {
			if( this.pushStackState( mFramebufferStack, fbo.getId() ) ) {
				cGl.bindFramebuffer( target, fbo.getId() );
			}
			// TODO: Implement this function
			fbo.markAsDirty();
		}
		else {
			if( this.pushStackState( mFramebufferStack, fbo ) ) {
				cGl.BindFramebuffer( target, fbo );
			}
		}
	};
	this.pushFramebuffer = function ( target ) {
		this.pushStackState( mFramebufferStack, this.getFramebuffer( target ) );
		// TODO: Figure out about multisampling
		// #if ! defined( SUPPORTS_FBO_MULTISAMPLING )
			
		// #else
			// if( target == GL_FRAMEBUFFER || target == GL_READ_FRAMEBUFFER ) {
				// pushStackState<GLint>( mReadFramebufferStack, getFramebuffer( GL_READ_FRAMEBUFFER ) );
			// }
			// if( target == GL_FRAMEBUFFER || target == GL_DRAW_FRAMEBUFFER ) {
				// pushStackState<GLint>( mDrawFramebufferStack, getFramebuffer( GL_DRAW_FRAMEBUFFER ) );
			// }
		// #endif
	};
	this.popFramebuffer = function ( target ) {
		if( this.popStackState( mFramebufferStack ) ) {
			if( mFramebufferStack.length !== 0 ) {
				cinder.getGl().bindFramebuffer( target, mFramebufferStack[mFramebufferStack.length-1] );
			}
		}
		// #if ! defined( SUPPORTS_FBO_MULTISAMPLING )
			
		// #else
			// if( target == GL_FRAMEBUFFER || target == GL_READ_FRAMEBUFFER ) {
				// if( popStackState<GLint>( mReadFramebufferStack ) )
					// if( ! mReadFramebufferStack.empty() )
						// glBindFramebuffer( target, mReadFramebufferStack.back() );
			// }
			// if( target == GL_FRAMEBUFFER || target == GL_DRAW_FRAMEBUFFER ) {
				// if( popStackState<GLint>( mDrawFramebufferStack ) )
					// if( ! mDrawFramebufferStack.empty() )
						// glBindFramebuffer( target, mDrawFramebufferStack.back() );
			// }
		// #endif
	};
	this.getFramebuffer = function ( target ) {
		if( mFramebufferStack.empty() ) {
			var queriedInt = cinder.getGl().getParameter( cinder.getGl().FRAMEBUFFER_BINDING );
			mFramebufferStack.push( queriedInt );
			mFramebufferStack.push( queriedInt );		
		}
	
		return mFramebufferStack[mFramebufferStack.length-1];
	};
	//////////////////////////////////////////////////////////////////
	// States
	this.setBoolState = function ( cap, value, setterFunc ) {
		var needsToBeSet = true;
		var cached = mBoolStateStack[ cap ];
		if( ( cached ) && ( cached.length !== 0 ) && ( cached[cached.length-1] === value ) )
			needsToBeSet = false;
		if( ! cached ) {
			mBoolStateStack[cap] = [];
			mBoolStateStack[cap].push( value );
		}
		else {
			var stack = mBoolStateStack[cap];
			stack[stack.length-1] = value;
		}
		switch(arguments.length) {
			case 2: {
				if( needsToBeSet ) {
					var cGl = cinder.getGl();
					if( value ) {
						cGl.enable( cap );
					}
					else {
						cGl.disable( cap );
					}
				}
			}
			break;
			case 3: {
				if( needsToBeSet ) {
					setterFunc( value );
				}
			}
			break;
			default:
				throw "ERROR: Context - setBoolState Incorrect amount of arguments";
			break;
		}
	};
	this.pushBoolState = function ( cap, value ) {
		var cGl = cinder.getGl();
		var needsToBeSet = true;
		var cached = mBoolStateStack[ cap ];
		if( ( cached ) && ( cached.length !== 0 ) && ( cached[cached.length-1] === value ) ) {
			needsToBeSet = false;
		}
		else if( cached == mBoolStateStack.end() ) {
			mBoolStateStack[cap] = [];
			mBoolStateStack[cap].push( isEnabled( cap ) );
		}
		mBoolStateStack[cap].push( value );
		if( needsToBeSet ) {
			if( value ) {
				cGl.enable( cap );
			}
			else {
				cGl.disable( cap );
			}
		}	
	};
	this.pushBoolState = function ( cap ) {
		var existingVal = this.getBoolState( cap );
		mBoolStateStack[cap].push( existingVal );
	};
	this.popBoolState = function ( cap ) {
		var cached = mBoolStateStack[ cap ];
		if( ( cached ) && ( cached.length !== 0 ) ) {
			var prevValue = cached[cached.length-1];
			cached.pop();
			if( cached.length !== 0 ) {
				if( cached[cached.length-1] !== prevValue ) {
					var cGl = cinder.getGl();
					if( cached[cached.length-1] ) {
						glEnable( cap );
					}
					else {
						glDisable( cap );
					}
				}
			}
		}
	};
	this.enable = function ( cap, value ) {
		this.setBoolState( cap, value );
	};
	this.getBoolState = function ( cap ) {
		var cached = mBoolStateStack[ cap ];
		if( ( ! cached ) || cached.length === 0 ) {
			var result = cinder.getGl().isEnabled( cap );
			if( ! cached )
				mBoolStateStack[cap] = [];
			// push twice to accommodate later pop
			mBoolStateStack[cap].push( result );
			mBoolStateStack[cap].push( result );
			return result;
		}
		else {
			return cached[cached.length-1];
		}
	};
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// BlendFunc
	this.blendFunc = function (sfactor, dfactor) { this.blendFuncSeparate( sfactor, dfactor, sfactor, dfactor ); };
	this.blendFuncSeparate = function (srcRGB, dstRGB, srcAlpha, dstAlpha) {
		var needsChange = this.setStackState( mBlendSrcRgbStack, srcRGB );
		needsChange = this.setStackState( mBlendDstRgbStack, dstRGB ) || needsChange;
		needsChange = this.setStackState( mBlendSrcAlphaStack, srcAlpha ) || needsChange;
		needsChange = this.setStackState( mBlendDstAlphaStack, dstAlpha ) || needsChange;
		if( needsChange ) {
			cinder.getGl().blendFuncSeparate( srcRGB, dstRGB, srcAlpha, dstAlpha );
		}
	};
	this.pushBlendFuncSeparate = function (srcRGB, dstRGB, srcAlpha, dstAlpha){
		var needsChange = this.pushStackState( mBlendSrcRgbStack, srcRGB );
		needsChange = this.pushStackState( mBlendDstRgbStack, dstRGB ) || needsChange;
		needsChange = this.pushStackState( mBlendSrcAlphaStack, srcAlpha ) || needsChange;
		needsChange = this.pushStackState( mBlendDstAlphaStack, dstAlpha ) || needsChange;
		if( needsChange ) {
			cinder.getGl().blendFuncSeparate( srcRGB, dstRGB, srcAlpha, dstAlpha );
		}
	};
	this.pushBlendFuncSeparate = function () {
		var curBlendFuncs = this.getBlendFuncSeparate();

		mBlendSrcRgbStack.push( curBlendFuncs.resultSrcRGB );
		mBlendDstRgbStack.push( curBlendFuncs.resultDstRGB );
		mBlendSrcAlphaStack.push( curBlendFuncs.resultSrcAlpha );
		mBlendDstAlphaStack.push( curBlendFuncs.resultDstAlpha );
	};
	this.popBlendFuncSeparate = function () {
		var needsChange = this.popStackState( mBlendSrcRgbStack );
		needsChange = this.popStackState( mBlendDstRgbStack ) || needsChange;
		needsChange = this.popStackState( mBlendSrcAlphaStack ) || needsChange;
		needsChange = this.popStackState( mBlendDstAlphaStack ) || needsChange;
		if( needsChange && ( mBlendSrcRgbStack.length !== 0 ) && ( mBlendSrcAlphaStack.length !== 0 ) && ( mBlendDstRgbStack.length !== 0 ) && ( mBlendDstAlphaStack.length !== 0 ) ) {
			cinder.getGl().blendFuncSeparate( 
				mBlendSrcRgbStack[mBlendSrcRgbStack.length-1], 
				mBlendDstRgbStack[mBlendDstRgbStack.length-1], 
				mBlendSrcAlphaStack[mBlendSrcAlphaStack.length-1], 
				mBlendDstAlphaStack[mBlendDstAlphaStack.length-1] 
			);
		}
	};
	this.getBlendFuncSeparate = function ( resultSrcRGB, resultDstRGB, resultSrcAlpha, resultDstAlpha ) {
		// push twice on empty to accommodate inevitable push later
		var cGl = cinder.getGl();
		var queriedInt;
		if( mBlendSrcRgbStack.length === 0 ) {
			queriedInt = cGl.getParameter( cGl.BLEND_SRC_RGB);
			mBlendSrcRgbStack.push( queriedInt ); mBlendSrcRgbStack.push( queriedInt );
		}
		if( mBlendDstRgbStack.length === 0 ) {
			queriedInt = cGl.getParameter( cGl.BLEND_DST_RGB );
			mBlendDstRgbStack.push( queriedInt ); mBlendDstRgbStack.push( queriedInt );
		}
		if( mBlendSrcAlphaStack.length === 0 ) {
			queriedInt = cGl.getParameter( cGl.BLEND_SRC_ALPHA );
			mBlendSrcAlphaStack.push( queriedInt ); mBlendSrcAlphaStack.push( queriedInt );
		}
		if( mBlendDstAlphaStack.length === 0 ) {
			queriedInt = cGl.getParameter( cGl.BLEND_DST_ALPHA );
			mBlendDstAlphaStack.push( queriedInt ); mBlendDstAlphaStack.push( queriedInt );
		}
		return {
			resultSrcRGB: mBlendSrcRgbStack[mBlendSrcRgbStack.length-1],
			resultDstRGB: mBlendDstRgbStack[mBlendDstRgbStack.length-1],
			resultSrcAlpha: mBlendSrcAlphaStack[mBlendSrcAlphaStack.length-1],
			resultDstAlpha: mBlendDstAlphaStack[mBlendDstAlphaStack.length-1],
		};
	};

	// TODO: add rasterization of cull face, linewidth, frontface, and polygon offset maybe to gl

	//////////////////////////////////////////////////////////////////////////////////////////
	// Emulation of the Templated stack management routines
	this.pushStackState = function (stack, value) {
		var needsToBeSet = true;
		if( ( stack.length !== 0 ) && ( stack[stack.length-1] === value ) ) {
			needsToBeSet = false;
		}
		stack.push( value );
		return needsToBeSet;
	};
	this.popStackState = function (stack) {
		if( stack.length !== 0 ) {
			var prevValue = stack.pop();
			if( stack.length !== 0 ) {
				return stack[stack.length-1] !== prevValue;
			}
			else {
				return true;
			}
		}	
		else {
			return true;
		}
	};
	this.setStackState = function (stack, value) {
		var needsToBeSet = true;
		if( ( stack.length !== 0 ) && ( stack[stack.length-1] === value ) ) {
			needsToBeSet = false;
		}
		else if( stack.length === 0 ) {
			stack.push( value );
		}
		else {
			stack[stack.length-1] = value;
		}
		return needsToBeSet;
	};
	this.getStackState = function (stack) {
		if( stack.length === 0 ) {
			return false;
		}
		else {
			return stack[stack.length-1];
		}
	};
	///////////////////////////////////////////////////////////////////////////////////////////
	// DepthMask
	/* Original Implementation
	this.depthMask = function (state) {
		cinder.getGl().depthMask(state);
	},*/
	this.depthMask = function ( enable ) { 
		var cGl = cinder.getGl();
		this.setBoolState( cGl.DEPTH_WRITEMASK, enable, cGl.depthMask.bind( cGl ) ); 
	};
	/////////////////////////////////////////////////////////////////////////////////////
	// TODO: Implement the sanityCheck function
	// This routine confirms that the ci::gl::Context's understanding of the world matches OpenGL's
	// void Context::sanityCheck()
	// {
	// 	// assert cached (VAO) GL_VERTEX_ARRAY_BINDING is correct
	// 	GLint trueVaoBinding;

	// 	glGetIntegerv( GL_VERTEX_ARRAY_BINDING_OES, &trueVaoBinding );

	// 	VaoRef boundVao = getVao();
	// 	if( boundVao ) {
	// 		assert( trueVaoBinding == boundVao->mId );
	// 		assert( getBufferBinding( GL_ARRAY_BUFFER ) == boundVao->getLayout().mCachedArrayBufferBinding );
	// 		assert( getBufferBinding( GL_ELEMENT_ARRAY_BUFFER ) == boundVao->getLayout().mElementArrayBufferBinding );		
	// 	}
	// 	else
	// 		assert( trueVaoBinding == 0 );
	
	// 	// assert cached GL_ARRAY_BUFFER is correct
	// 	GLint cachedArrayBufferBinding = getBufferBinding( GL_ARRAY_BUFFER );
	// 	GLint trueArrayBufferBinding;
	// 	glGetIntegerv( GL_ARRAY_BUFFER_BINDING, &trueArrayBufferBinding );
	// 	assert( ( cachedArrayBufferBinding == -1 ) || ( trueArrayBufferBinding == cachedArrayBufferBinding ) );
	
	// 	// assert cached GL_ELEMENT_ARRAY_BUFFER is correct
	// 	GLint cachedElementArrayBufferBinding = getBufferBinding( GL_ELEMENT_ARRAY_BUFFER );
	// 	GLint trueElementArrayBufferBinding;
	// 	glGetIntegerv( GL_ELEMENT_ARRAY_BUFFER_BINDING, &trueElementArrayBufferBinding );
	// 	assert( ( cachedElementArrayBufferBinding == -1 ) || ( trueElementArrayBufferBinding == cachedElementArrayBufferBinding ) );
	
	// 	// assert the various texture bindings are correct
	// /*	for( auto& cachedTextureBinding : mTextureBindingStack ) {
	// 		GLenum target = cachedTextureBinding.first;
	// 		glGetIntegerv( Texture::getBindingConstantForTarget( target ), &queriedInt );
	// 		GLenum cachedTextureId = cachedTextureBinding.second.back();
	// 		assert( queriedInt == cachedTextureId );
	// 	}*/
	// }

	///////////////////////////////////////////////////////////////////////////////////////////////////
	// Vertex Attributes
	this.enableVertexAttribArray = function (index) {
		var vao = this.getVao();
		if( vao ) {
			vao.enableVertexAttribArrayImpl( index );
		}
	};
	this.disableVertexAttribArray = function (index) {
		var vao = this.getVao();
		if( vao ) {
			vao.disableVertexAttribArrayImpl( index );
		}
	};
	this.vertexAttribPointer = function ( index, size, type, normalized, stride, pointer ) {
		var vao = this.getVao();
		if( vao )
			vao.vertexAttribPointerImpl( index, size, type, normalized, stride, pointer );
	}
	this.vertexAttribDivisor = function (index, divisor) {
		var vao = this.getVao();
		if( vao )
			vao.vertexAttribDivisorImpl( index, divisor );
	};
	this.vertexAttrib1f = function (index, v0) { cinder.getGl().vertexAttrib1f(index, v0); };
	this.vertexAttrib2f = function (index, v0, v1) { cinder.getGl().vertexAttrib2f(index, v0, v1); };
	this.vertexAttrib3f = function (index, v0, v1, v2) { cinder.getGl().vertexAttrib3f(index, v0, v1, v2); };
	this.vertexAttrib4f = function (index, v0, v1, v2, v3) { cinder.getGl().vertexAttrib4f(index, v0, v1, v2, v3); };
	///////////////////////////////////////////////////////////////////////////////////////////
	// Shaders
	this.getStockShader = function (shaderDef) {
		if( mStockShaders[shaderDef] === undefined ) {
			return mStockShaders[shaderDef] = ShaderDef.buildShader(shaderDef);
		}
		else {
			return mStockShaders[shaderDef];
		}
	};
	//TODO: Implement these functions low priority
	this.setDefaultShaderVars = function () {
		var ctx = cinder.getContext();
		var glslProg = ctx.getGlslProg();
		if( glslProg ) {
			var uniforms = glslProg.getUniformSemantics();
			for( var unifIt in uniforms ) {
				switch( uniforms[unifIt] ) {
					case gl.UNIFORM_MODELVIEW:
						glslProg.uniform( unifIt, gl.getModelView() ); break;
					case gl.UNIFORM_MODELVIEWPROJECTION:
						glslProg.uniform( unifIt, gl.getModelViewProjection() ); break;
					case gl.UNIFORM_PROJECTION:
						glslProg.uniform( unifIt, gl.getProjection() ); break;
					case gl.UNIFORM_NORMAL_MATRIX:
						glslProg.uniform( unifIt, gl.calcNormalMatrix() ); break;
				}
			}
	
			var attribs = glslProg.getAttribSemantics();
			for( var attribIt in attribs ) {
				switch( attribs[attribIt] ) {
					case GEOM.Attrib.COLOR: {
						var loc = glslProg.getAttribLocation( attribIt );
						var c = ctx.getCurrentColor();
						cinder.getGl().vertexAttrib4f( loc, c.r(), c.g(), c.b(), c.a() );
					}
					break;
					default:
					break;
				}
			}
		}
	};

	this.getDefaultVao = function () {
		if( ! mDefaultVao ) {
			mDefaultVao = Vao.create();
		}
	
		return mDefaultVao;
	}
	
	this.getDefaultArrayVbo = function ( requiredSize ) {
		mDefaultArrayVboIdx = ( mDefaultArrayVboIdx + 1 ) % 4;
		var cGl = cinder.getGl();

		if( ! mDefaultArrayVbo[mDefaultArrayVboIdx] ) {
			mDefaultArrayVbo[mDefaultArrayVboIdx] = Vbo.create( 
				new Vbo.Format(  cGl.ARRAY_BUFFER, 
								Math.max( 1, requiredSize ), 
								null, 
								cGl.STREAM_DRAW 
								)
				);
		}
		else if( requiredSize > mDefaultArrayVbo[mDefaultArrayVboIdx].getSize() ) {
			mDefaultArrayVbo[mDefaultArrayVboIdx].ensureMinimumSize( Math.max( 1, requiredSize ) );
		}
		return mDefaultArrayVbo[mDefaultArrayVboIdx];
	}
	
	this.getDefaultElementVbo = function ( requiredSize ) {	
		var cGl = cinder.getGl();
		if( ! mDefaultElementVbo ) {
			mDefaultElementVbo = Vbo.create( 
				new Vbo.Format( cGl.ELEMENT_ARRAY_BUFFER, 
								requiredSize, 
								null, 
								cGl.STREAM_DRAW 
							)
				);
		}
		if( requiredSize > this.mDefaultElementVbo.getSize() ) {
			mDefaultElementVbo = Vbo.create( 
				new Vbo.Format( cGl.ELEMENT_ARRAY_BUFFER, 
								requiredSize, 
								null, 
								cGl.STREAM_DRAW 
						)
					);
		}
		
		return mDefaultElementVbo;
	}

	return this;
}

