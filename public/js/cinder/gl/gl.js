gl = {
	UNIFORM_MODELVIEW: 0,
	UNIFORM_MODELVIEWPROJECTION: 1,
	UNIFORM_PROJECTION: 2,
	UNIFORM_NORMAL_MATRIX: 3,

	enableVertexAttribArray: function (index) {
		cinder.getContext().enableVertexAttribArray(index);
	},
	vertexAttribPointer: function (index, size, type, normalized, stride, offset) {
		cinder.getContext().vertexAttribPointer(index, size, type, normalized, stride, offset);
	},
	vertexAttribDivisor: function (index, divisor) {
		cinder.getContext().vertexAttribDivisor(index, divisor);
	},
	enableDepthRead: function (enable) {
		if( arguments.length === 0 ) {
			gl.enable( cinder.getGl().DEPTH_TEST, true );
		}
		else {
			gl.enable( cinder.getGl().DEPTH_TEST, enable );
		}
		
	},
	enableDepthWrite: function (enable) {
		if( arguments.length === 0 ) {
			cinder.getContext().depthMask(true);
		}
		else {
			cinder.getContext().depthMask(enable);
		}
		
	},
	enableAlphaBlending: function (preMultBOOL) {
		var ctx = cinder.getContext();
		ctx.enable( cinder.getGl().BLEND );
		if( ! preMultBOOL  ) {
			ctx.blendFunc( cinder.getGl().SRC_ALPHA, cinder.getGl().ONE_MINUS_SRC_ALPHA );
		}
		else {
			ctx.blendFunc( cinder.getGl().ONE, cinder.getGl().ONE_MINUS_SRC_ALPHA );
		}
	},
	disableAlphaBlending: function () {
		gl.disable( cinder.getGl().BLEND );
	},
	enableAdditiveBlending: function () {
		var ctx = cinder.getContext();
		ctx.enable( cinder.getGl().BLEND );
		ctx.blendFunc( cinder.getGl().SRC_ALPHA, cinder.getGl().ONE );
	},
	clear: function (mask) {
	    cinder.getGl().clear( mask );
	},  
	clearColor: function(d0, d1, d2, d3) {
		var ctx = cinder.getContext();
		switch( arguments.length ) {
			case 1: ctx.clearColor(d0); break;
			case 3: ctx.clearColor( new ColorA( d0, d1, d2, 1.0 ) ); break;
			case 4: ctx.clearColor( new ColorA( d0, d1, d2, d3 ) ); break;
		}
	},
	clearDepth: function(depth) {
	    cinder.getGl().clearDepth( depth );
	},  
	clearStencil: function(s) {
	    cinder.getGl().clearStencil( s );
	},  
	colorMask: function(redBool, greenBool, blueBool, alphaBool) {
	    cinder.getGl().colorMask( redBool, greenBool, blueBool, alphaBool );
	},
	depthMask: function (flag) {
		cinder.getContext().depthMask(true);
	},
	stencilMask: function (mask) {
		cinder.getGl().stencilMask(mask);
	},  
	stencilFunc: function( func, ref, mask ) {
	    cinder.getGl().stencilFunc(func, ref, mask);
	}, 
	stencilOp: function (fail, zfail, zpass) {
	    cinder.getGl().stencilOp(fail, zfail, zpass);
	},
	clear: function (bufferbit) {
		cinder.getGl().clear(bufferbit);
	},
	enable: function (state, value) {
		cinder.getContext().enable(state, value);
	},
	disable: function (state) {
		cinder.getContext().disable(state);
	},
	setMatrices: function (cam) {
		var ctx = cinder.getContext();
		var mVStack = ctx.getModelViewStack();
		var pStack = ctx.getProjectionStack();
		mVStack[mVStack.length - 1] = cam.getModelViewMatrix();
		pStack[pStack.length - 1] = cam.getProjectionMatrix();
	},
	setModelView: function (rhsType) {
		if( rhsType instanceof Camera ) {
			cinder.getContext().getModelViewStack().push(rhsType.getModelViewMatrix());
		}
		else if( rhsType instanceof Matrix44f ) {
			cinder.getContext().getModelViewStack().push(rhsType);
		}
		else {
			throw "ERROR: gl.setModelView - Not a type I understand."
		}
	},
	setProjection: function (cam) {
		if( rhsType instanceof Camera ) {
			cinder.getContext().getProjectionStack().push(rhsType.getProjectionMatrix());
		}
		else if( rhsType instanceof Matrix44f ) {
			cinder.getContext().getProjectionStack().push(rhsType);
		}
	},
	pushModelView: function () {
		var mVStack = cinder.getContext().getModelViewStack();
		mVStack.push( mVStack[mVStack.length - 1] );
	},
	popModelView: function () {
		cinder.getContext().getModelViewStack().pop();
	},
	pushProjection: function () {
		var pStack = cinder.getContext().getProjectionStack();
		pStack.push( pStack[pStack.length - 1] );
	},
	popProjection: function () {
		cinder.getContext().getProjectionStack().pop();
	},
	pushMatrices: function () {
		var ctx = cinder.getContext();
		var mVStack = ctx.getModelViewStack();
		var pStack = ctx.getProjectionStack();
		mVStack.push( mVStack[mVStack.length - 1] );
		pStack.push( pStack[pStack.length - 1] );
	},
	popMatrices: function () {
		cinder.getContext().getModelViewStack().pop();
		cinder.getContext().getProjectionStack().pop();
	},
	multModelView: function (mVMatrix44) { 
		var mVStack = cinder.getContext().getModelViewStack();
		mVStack[mVStack.length - 1].multEq(mVMatrix44);
	},
	multProjection: function (pMatrix44) {
		var pStack = cinder.getContext().getProjectionStack();
		pStack[pStack.length - 1].multEq(pMatrix44);
	},
	getModelView: function () {
		var mVStack = cinder.getContext().getModelViewStack();
		return mVStack[mVStack.length - 1];
	},
	getProjection: function () {
		var pStack = cinder.getContext().getProjectionStack();
		return pStack[pStack.length - 1];
	},
	getModelViewProjection: function () {
		var ctx = cinder.getContext();
		var mVStack = ctx.getModelViewStack();
		var pStack = ctx.getProjectionStack();
		return pStack[pStack.length - 1].mult(mVStack[mVStack.length - 1]);
	},
	calcNormalMatrix: function () {
		var mv = gl.getModelView().subMatrix33( 0, 0 );
		mv.invert();
		mv.transpose();
		return mv;
	},
	setMatricesWindowPersp: function (screenWidth, screenHeight, fovDegrees, nearPlane, farPlane, originUpperLeft) {
		if( arguments.length === 1 ) {
			screenHeight = screenWidth.y();
			screenWidth = screenWidth.x();
			fovDegrees = 60.0;
			nearPlane = 1.0;
			farPlane = 1000.0;
			originUpperLeft = true;
		}
		else if( arguments.length >= 2 ) {
			fovDegrees = fovDegrees || 60.0;
			nearPlane = nearPlane || 1.0;
			farPlane = farPlane || 1000.0;
			originUpperLeft = originUpperLeft || true;
		}
		
		var cam = new CameraPersp( screenWidth, screenHeight, fovDegrees, nearPlane, farPlane );
		gl.setMatrices(cam);
		if( originUpperLeft ) {
			var mVStack = cinder.getContext().getModelViewStack();
			var pStack = cinder.getContext().getModelViewStack();
			mVStack[mVStack.length - 1].scale( new Vec3f( 1.0, -1.0, 1.0 ) ); // invert Y axis so increasing Y goes down.
			pStack[pStack.length - 1].translate( new Vec3f( 0.0, -screenHeight, 0.0 ) ); // shift origin up to upper-left corner.
		}
	},
	setMatricesWindow: function (screenWidth, screenHeight, originUpperLeft) {
		if( arguments.length === 1 ) {
			screenHeight = screenWidth.y();
			screenWidth = screenWidth.x();
			originUpperLeft = true;
		}
		else if( arguments.length >= 2 ) {
			originUpperLeft = originUpperLeft || true;
		}
		
		var mVStack = cinder.getContext().getModelViewStack();
		var pStack = cinder.getContext().getProjectionStack();
		mVStack[mVStack.length - 1].setToIdentity();
		if( originUpperLeft ) { 
			pStack[pStack.length - 1].setRows(		
				new Vec4f( 2.0 / screenWidth, 0.0, 0.0, -1.0 ),
				new Vec4f( 0.0, 2.0 / -screenHeight, 0.0, 1.0 ),
				new Vec4f( 0.0, 0.0, -1.0, 0.0 ),
				new Vec4f( 0.0, 0.0, 0.0, 1.0 ) 
			);
		}
		else { 
			pStack[pStack.length - 1].setRows(	
				new Vec4f( 2.0 / screenWidth, 0.0, 0.0, -1.0 ),
				new Vec4f( 0.0, 2.0 / screenHeight, 0.0, -1.0 ),
				new Vec4f( 0.0, 0.0, -1.0, 0.0 ),
				new Vec4f( 0.0, 0.0, 0.0, 1.0 ) 
			);
		}	
	},
	rotate: function (angleDegrees, xAxis, yAxis, zAxis) {
		var axis = new Vec3f();
		// if only one argument, which is a quatf
		if( arguments.length === 1 ) {
			var angle = 0;
			angleDegrees.getAxisAngle( axis, angle );
			if( Math.abs( angle ) > MATH.EPSILON_VALUE ) {
				angleDegrees = MATH.toDegrees( angle );
			}
		} // if you fill all four in
		else if( arguments.length === 4 ) {
			axis.x(xAxis);
			axis.y(yAxis);
			axis.z(zAxis);
		}
		var mVStack = cinder.getContext().getModelViewStack();
		mVStack[mVStack.length - 1].rotate( axis, 
			MATH.toRadians( angleDegrees ) 
		);
	},
	scale: function (rhsVec3) {
		var mVStack = cinder.getContext().getModelViewStack();
		mVStack[mVStack.length - 1].scale(rhsVec3);
	},
	translate: function (rhsVec3) {
		var mVStack = cinder.getContext().getModelViewStack();
		mVStack[mVStack.length - 1].translate(rhsVec3);
	},
	drawCube: function (pos, size) {
		// TODO: Implement this
		var cube = cinder.getContext().getDrawCube();

	},
	// TODO: implement instanced drawing
	drawArrays: function (primitive, first, count) {
		cinder.getGl().drawArrays(primitive, first, count);
	},	
	drawElements: function (primitive, count, type, offset) {
		cinder.getGl().drawElements(primitive, count, type, offset);
	},
	drawArraysInstanced: function ( mode, first, count, primcount ) {
		cinder.getContext().drawArraysInstanced( mode, first, count, primcount );
	},
	drawElementsInstanced: function ( mode, count, type, indices, primcount ) {
		cinder.getContext().drawElementsInstanced( mode, count, type, indices, primcount );
	},
	drawTexture: function (texture, billboardRectf) {
		var rect = billboardRectf || new Rectf(0, 0, 1, 1);
		var ctx = cinder.getContext();
		var shader = ctx.getStockShader( new ShaderDef().texture( texture ).color() );
		shader.bind();
		texture.bind();
	
		shader.uniform( "uTex0", 0 );
	
		var data = new Float32Array(8+8+16); // both verts, texCoords and colors
		// GLfloat *verts = data, *texCoords = data + 8, *colors = data + 16;
		
		data[0*2+0] = rect.getX2(); data[4*2+0] = texture.getRight();
		data[0*2+1] = rect.getY1(); data[4*2+1] = texture.getTop();
		data[1*2+0] = rect.getX1(); data[5*2+0] = texture.getLeft();
		data[1*2+1] = rect.getY1(); data[5*2+1] = texture.getTop();
		data[2*2+0] = rect.getX2(); data[6*2+0] = texture.getRight();
		data[2*2+1] = rect.getY2(); data[6*2+1] = texture.getBottom();
		data[3*2+0] = rect.getX1(); data[7*2+0] = texture.getLeft();
		data[3*2+1] = rect.getY2(); data[7*2+1] = texture.getBottom();

		for(var i=0;i<4;++i) {
			data[(i*4+0)+16] = ctx.getCurrentColor().r();
			data[(i*4+1)+16] = ctx.getCurrentColor().g();
			data[(i*4+2)+16] = ctx.getCurrentColor().b();
			data[(i*4+3)+16] = ctx.getCurrentColor().a();
		}
		
		var cGl = cinder.getGl();
		var defaultVbo = ctx.getDefaultArrayVbo( 32*data.BYTES_PER_ELEMENT );
		defaultVbo.bind();
		
		ctx.pushVao();
		ctx.getDefaultVao().freshBindPre();

			defaultVbo.bufferSubData( 0, data );
			var posLoc = shader.getAttribSemanticLocation( GEOM.Attrib.POSITION );
			if( posLoc >= 0 ) {
				gl.enableVertexAttribArray( posLoc );
				gl.vertexAttribPointer( posLoc, 2, cGl.FLOAT, false, 0, 0 );
			}
			var texLoc = shader.getAttribSemanticLocation( GEOM.Attrib.TEX_COORD_0 );
			if( texLoc >= 0 ) {
				gl.enableVertexAttribArray( texLoc );
				gl.vertexAttribPointer( texLoc, 2, cGl.FLOAT, false, 0, 8 * data.BYTES_PER_ELEMENT );
			}
			var colorLoc = shader.getAttribSemanticLocation( GEOM.Attrib.COLOR );
			if( colorLoc >= 0 ) {
				gl.enableVertexAttribArray( colorLoc );
				gl.vertexAttribPointer( colorLoc, 4, cGl.FLOAT, false, 0, 16 * data.BYTES_PER_ELEMENT );
			}
		ctx.getDefaultVao().freshBindPost();
		
		ctx.setDefaultShaderVars();
		ctx.drawArrays( cGl.TRIANGLE_STRIP, 0, 4 );
		ctx.popVao();
	},
	getExtension: function (name) {
		cinder.getContext().getExtension(name);
	},
	getSupportedExtensions: function () {
		return cinder.getContext().cacheSupportedExtensions();
	},
	bindStockShader: function (shaderDef) {
		var ctx = cinder.getContext();
		var shader = ctx.getStockShader(shaderDef);
		ctx.bindGlslProg( shader );
	},
	getStockShader: function (shaderDef) {

	},
	getViewport: function () {
		var view = cinder.getContext().getViewport();
		return view;
	},
	
	viewport: function ( d0, d1, d2, d3 ) {
		var ctx = cinder.getContext();
		switch( arguments.length ) {
			case 1: ctx.viewport(d0); break;
			case 2: ctx.viewport( new OrigDim( d0, d1 ) ); break;
			case 4: ctx.viewport( new OrigDim( d0, d1, d2, d3 ) ); break;
		}
	},
	pushViewport: function ( position, size ) {
		cinder.getContext().pushViewport( new OrigDim( position, size ) );
	},
	popViewport: function () {
		cinder.getContext().popViewport();
	},
	getScissor: function () {
		var scissor = cinder.getContext().getScissor();
		return scissor;
	},
	scissor: function ( d0, d1, d2, d3 ) {
		var ctx = cinder.getContext();
		switch( arguments.length ) {
			case 1: ctx.scissor(d0); break;
			case 2: ctx.scissor( new OrigDim( d0, d1 ) ); break;
			case 4: ctx.scissor( new OrigDim( d0, d1, d2, d3 ) ); break;
		}
	},
}