function CameraPersp (pixelWidth, pixelHeight, fov, nearPlane, farPlane) {
	Camera.call( this );
	this.mLensShift = new Vec2f();

	if( arguments.length === 0 ) {
		this.setFrom0();
	}
	else if( arguments.length === 3 ) {
		this.setFrom3(pixelWidth, pixelHeight, fov);
	}
	else if( arguments.length === 5 ) {
		this.setFrom5(pixelWidth, pixelHeight, fov, nearPlane, farPlane);
	}

	return this;
};

CameraPersp.prototype = Object.create( Camera.prototype );

CameraPersp.prototype.setFrom3 = function ( pixelWidth, pixelHeight, fovDegrees ) {
	var eyeX 		= pixelWidth / 2.0;
	var eyeY 		= pixelHeight / 2.0;
	var halfFov 	= 3.14159 * fovDegrees / 360.0;
	var theTan 		= Math.tan( halfFov );
	var dist 		= eyeY / theTan;
	var nearDist 	= dist / 10.0;	// near / far clip plane
	var farDist 	= dist * 10.0;
	var aspect 		= pixelWidth / pixelHeight;

	this.setPerspective( fovDegrees, aspect, nearDist, farDist );
	this.lookAt( new Vec3f( eyeX, eyeY, dist ), new Vec3f( eyeX, eyeY, 0.0 ) );
};

CameraPersp.prototype.setFrom5 = function ( pixelWidth, pixelHeight, fovDegrees, nearPlane, farPlane ) {
	var halfFov, theTan, aspect;

	var eyeX 		= pixelWidth / 2.0;
	var eyeY 		= pixelHeight / 2.0;
	halfFov 		= 3.14159 * fovDegrees / 360.0;
	theTan 			= Math.tan( halfFov );
	var dist 		= eyeY / theTan;
	aspect 			= pixelWidth / pixelHeight;

	this.setPerspective( fovDegrees, aspect, nearPlane, farPlane );
	this.lookAt( new Vec3f( eyeX, eyeY, dist ), new Vec3f( eyeX, eyeY, 0.0 ) );
};

CameraPersp.prototype.setFrom0 = function () {
	this.mLensShift = Vec2f.zero();
	this.lookAt( new Vec3f( 28.0, 21.0, 28.0 ), Vec3f.zero(), Vec3f.yAxis() );
	this.setCenterOfInterest( 44.822 );
	this.setPerspective( 35.0, 1.0, 0.1, 1000.0 );
};

CameraPersp.prototype.setPerspective = function ( verticalFovDegrees, aspectRatio, nearPlane, farPlane ) {
	this.mFov				= verticalFovDegrees;
	this.mAspectRatio		= aspectRatio;
	this.mNearClip			= nearPlane;
	this.mFarClip			= farPlane;

	this.mProjectionCached 	= false;
}

CameraPersp.prototype.getLensShift = function () { 
	return this.mLensShift;
},
CameraPersp.prototype.setLensShift = function (rhsType1, rhsType2) {
	if( arguments.length === 1 ) {
		this.mLensShift.setFromVec2(rhsType2);
	}
	else if( arguments.length === 2 ) {
		this.mLensShift.x(rhsType1);
		this.mLensShift.y(rhsType2);
	}

	mProjectionCached = false;
};
CameraPersp.prototype.getLensShiftHorizontal = function () { return this.mLensShift.x(); };
CameraPersp.prototype.setLensShiftHorizontal = function (horizontal) { this.setLensShift( horizontal, this.mLensShift.y() ); };
CameraPersp.prototype.getLensShiftVertical = function () { return this.mLensShift.y(); };
CameraPersp.prototype.setLensShiftVertical = function (vertical) { this.setLensShift( this.mLensShift.x(), vertical ); };
CameraPersp.prototype.getFrameSphere = function ( worldSpaceSphere, maxIterations ) {
	maxIterations = maxIterations || 20;
}
CameraPersp.prototype.calcProjection = function () {
	this.mFrustumTop	=  this.mNearClip * Math.tan( Math.PI / 180.0 * this.mFov * 0.5 );
	this.mFrustumBottom	= -this.mFrustumTop;
	this.mFrustumRight	=  this.mFrustumTop * this.mAspectRatio;
	this.mFrustumLeft	= -this.mFrustumRight;

	// perform lens shift
	if( this.mLensShift.y() != 0.0 ) {
		this.mFrustumTop = MATH.lerp( 0.0, 2.0 * this.mFrustumTop, 0.5 + 0.5 * mLensShift.y() );
		this.mFrustumBottom = MATH.lerp( 2.0 * this.mFrustumBottom, 0.0, 0.5 + 0.5 * this.mLensShift.y() );
	}

	if( this.mLensShift.x() != 0.0 ) {
		this.mFrustumRight = MATH.lerp(2.0 * this.mFrustumRight, 0.0, 0.5 - 0.5 * this.mLensShift.x());
		this.mFrustumLeft = MATH.lerp(0.0, 2.0 * mFrustumLeft, 0.5 - 0.5 * this.mLensShift.x());
	}

	var m = this.mProjectionMatrix.components;
	m[ 0] =  2.0 * this.mNearClip / ( this.mFrustumRight - this.mFrustumLeft );
	m[ 4] =  0.0;
	m[ 8] =  ( this.mFrustumRight + this.mFrustumLeft ) / ( this.mFrustumRight - this.mFrustumLeft );
	m[12] =  0.0;

	m[ 1] =  0.0;
	m[ 5] =  2.0 * this.mNearClip / ( this.mFrustumTop - this.mFrustumBottom );
	m[ 9] =  ( this.mFrustumTop + this.mFrustumBottom ) / ( this.mFrustumTop - this.mFrustumBottom );
	m[13] =  0.0;

	m[ 2] =  0.0;
	m[ 6] =  0.0;
	m[10] = -( this.mFarClip + this.mNearClip ) / ( this.mFarClip - this.mNearClip );
	m[14] = -2.0 * this.mFarClip * this.mNearClip / ( this.mFarClip - this.mNearClip );

	m[ 3] =  0.0;
	m[ 7] =  0.0;
	m[11] = -1.0;
	m[15] =  0.0;

	m = this.mInverseProjectionMatrix.components;
	m[ 0] =  ( this.mFrustumRight - this.mFrustumLeft ) / ( 2.0 * this.mNearClip );
	m[ 4] =  0.0;
	m[ 8] =  0.0;
	m[12] =  ( this.mFrustumRight + this.mFrustumLeft ) / ( 2.0 * this.mNearClip );

	m[ 1] =  0.0;
	m[ 5] =  ( this.mFrustumTop - this.mFrustumBottom ) / ( 2.0 * this.mNearClip );
	m[ 9] =  0.0;
	m[13] =  ( this.mFrustumTop + this.mFrustumBottom ) / ( 2.0 * this.mNearClip );

	m[ 2] =  0.0;
	m[ 6] =  0.0;
	m[10] =  0.0;
	m[14] = -1.0;

	m[ 3] =  0.0;
	m[ 7] =  0.0;
	m[11] = -( this.mFarClip - this.mNearClip ) / ( 2.0 * this.mFarClip*this.mNearClip );
	m[15] =  ( this.mFarClip + this.mNearClip ) / ( 2.0 * this.mFarClip*this.mNearClip );

	this.mProjectionCached = true;
};
