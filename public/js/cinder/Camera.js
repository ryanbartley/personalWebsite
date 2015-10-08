Camera = function () {
	this.mEyePoint = new Vec3f();
	this.mViewDirection = new Vec3f();
	this.mOrientation = new Quatf();
	this.mCenterOfInterest = 0;
	this.mWorldUp = new Vec3f();

	this.mFov = 0;
	this.mAspectRatio = 0;
	this.mNearClip = 0;		
	this.mFarClip = 0;

	this.mU = new Vec3f();	// Right vector
	this.mV = new Vec3f();	// Readjust up-vector
	this.mW = new Vec3f();	// Negative view direction

	this.mProjectionMatrix = new Matrix44f();
	this.mInverseProjectionMatrix = new Matrix44f();
	this.mProjectionCached = false;

	this.mModelViewMatrix = new Matrix44f();
	this.mInverseModelViewMatrix = new Matrix44f();
	this.mModelViewCached = false;
	this.mInverseModelViewCached = false;
	
	this.mFrustumLeft = 0; 
	this.mFrustumRight = 0;
	this.mFrustumTop = 0;
	this.mFrustumBottom = 0;

	return this;
}

Camera.prototype = {
	constructor: Camera,

	getEyePoint: function () { return this.mEyePoint; },
	setEyePoint: function (v3fEyePoint) {
		this.mEyePoint = v3EyePoint;
		this.mModelViewCached = false;
	},

	getCenterOfInterest: function () { return this.mCenterOfInterest; },
	setCenterOfInterest: function (aCenterOfInterest) { this.mCenterOfInterest = aCenterOfInterest; },

	getCenterOfInterestPoint: function () { 
		return this.mEyePoint.add(this.mViewDirection.multScalar(mCenterOfInterest));
	},
	setCenterOfInterestPoint: function (v3fcoip) {
		this.mCenterOfInterest = this.mEyePoint.distance( v3coip );
		this.lookAt( v3fcoip );
	},

	getViewDirection: function () { return this.mViewDirection; },
	setViewDirection: function (v3fViewDirection) {
		this.mViewDirection = v3fViewDirection.normalized();
		this.mOrientation = new Quatf( new Vec3f( 0, 0, -1 ), this.mViewDirection );
		this.mModelViewCached = false;
	},

	getOrientation: function () { return this.mOrientation; },
	setOrientation: function (qfOrientation) {
		this.mOrientation = qfOrientation.normalized();
		this.mViewDirection = this.mOrientation.mult( new Vec3f( 0, 0, -1 ) );
		this.mModelViewCached = false;
	},

	getWorldUp: function () { return this.mWorldUp; },
	setWorldUp: function (v3fWorldUp) {
		this.mWorldUp = v3fWorldUp.normalized();
		this.mOrientation = Matrix44f.alignZAxisWithTarget( this.mViewDirection.inverse(), this.mWorldUp ).normalized();
		this.mModelViewCached = false;
	},

	lookAt: function ( eyePointVec3, targetVec3, worldUpVec3 ) {
		if( arguments.length === 2 ) {
			this.mEyePoint = eyePointVec3;
			this.mViewDirection = targetVec3.sub(this.mEyePoint).normalized();
			var quat = new Quatf( Matrix44f.alignZAxisWithTarget( this.mViewDirection.inverse(), this.mWorldUp ) ); 
			this.mOrientation = quat.normalized();
			this.mModelViewCached = false;
		}
		else if( arguments.length === 3 ) {
			this.mEyePoint = eyePointVec3;
			this.mWorldUp = worldUpVec3.normalized();
			this.mViewDirection = targetVec3.sub(this.mEyePoint).normalized();
			var quat = new Quatf( Matrix44f.alignZAxisWithTarget( this.mViewDirection.inverse(), this.mWorldUp ) );
			this.mOrientation = quat.normalized();
			this.mModelViewCached = false;
		}
	},
	lookAtTarget: function ( targetVec3 ) {
		this.mViewDirection = targetVec3.sub( this.mEyePoint ).normalized();
		var quat = new Quatf( Matrix44f.alignZAxisWithTarget( this.mViewDirection.inverse(), this.mWorldUp ) );
		this.mOrientation = quat.normalized();
		this.mModelViewCached = false;
	},

	getFov: function () { return this.mFov; },
	setFov: function (fov) { this.mFov = fov; this.mProjectionCached = false; },

	getFovHorizontal: function () { 
		return MATH.toDegrees( 2.0 * Math.atan( Math.tan( MATH.toRadians(this.mFov) * 0.5 ) * mAspectRatio ) ); 
	},
	setFovHorizontal: function (fov) { 
		this.mFov = MATH.toDegrees( 2.0 * Math.atan( Math.tan( MATH.toRadians(fov) * 0.5 ) / mAspectRatio ) );  
		this.mProjectionCached = false; 
	},

	getAspectRatio: function () { return this.mAspectRatio; },
	setAspectRatio: function (aspectRatio) { 
		this.mAspectRatio = aspectRatio;
		this.mProjectionCached = false;
	},

	getNearClip: function () { return this.mNearClip; },
	setNearClip: function (nearClip) { 
		this.mNearClip = nearClip; 
		this.mProjectionCached = false;
	},
	getFarClip: function() { return this.mFarClip; },
	setFarClip: function (farClip) {
		this.mFarClip = farClip;
		this.mProjectionCached = false;
	},

	getProjectionMatrix: function () { 
		if( ! this.mProjectionCached ) {
			this.calcProjection();
		}
		return this.mProjectionMatrix;
	},
	getModelViewMatrix: function () {
		if( ! this.mModelViewCached ) {
			this.calcModelView();
		}	
		return this.mModelViewMatrix;
	},
	getInverseModelViewMatrix: function () {
		if( ! this.mInverseModelViewCached ) {
			this.calcInverseModelView();
		}
		return this.mInverseModelViewMatrix;
	},

	getNearClipCoordinates: function ( topLeftVec3, toRightVec3, bottomLeftVec3, bottomRightVec3 ) {
		this.calcMatrices();

		var viewDirection = new Vec3f( this.mViewDirection );
		viewDirection.normalize();

		var tL1 = viewDirection.multScalar(this.mNearClip);
		var tL2 = this.mv.multScalar(this.mFrustumTop);
		var tL3 = this.mU.multScalar(this.mFrustumLeft);

		topLeftVec3.setFromVec3(this.mEyePoint.add(tL1.add(tL2.add(tL3))));

		var tR1 = viewDirection.multScalar(this.mNearClip);
		var tR2 = this.mV.multScalar(this.mFrustumTop);
		var tR3 = this.mU.multScalar(this.mFrustumRight);

		topRightVec3.setFromVec3(this.mEyePoint.add(tR1.add(tR2.add(tR3))));

		var bL1 = viewDirection.multScalar(this.mNearClip);
		var bL2 = this.mV.multScalar(this.mFrustumBottom);
		var bL3 = this.mU.multScalar(this.mFrustumLeft);

		bottomLeftVec3.setFromVec3(this.mEyePoint.add(bL1.add(bL2.add(bL3))));

		var bR1 = viewDirection.multScalar(this.mNearClip);
		var bR2 = this.mV.multScalar(this.mFrustumBottom);
		var bR3 = this.mU.multScalar(this.mFrustumRight);

		bottomRightVec3.setFromVec3(this.mEyePoint.add(bR1.add(bR2.add(bR3))));
	},

	getFarClipCoordinates: function ( topLeftVec3, toRightVec3, bottomLeftVec3, bottomRightVec3 ) {
		this.calcMatrices();

		var viewDirection = new Vec3f( this.mViewDirection );
		viewDirection.normalize();

		var ratio = this.mFarClip / this.mNearClip;

		var tL1 = viewDirection.multScalar(this.mFarClip);
		var tL2 = this.mv.multScalar(this.mFrustumTop * ratio);
		var tL3 = this.mU.multScalar(this.mFrustumLeft * ratio);

		topLeftVec3.setFromVec3(this.mEyePoint.add(tL1.add(tL2.add(tL3))));

		var tR1 = viewDirection.multScalar(this.mFarClip);
		var tR2 = this.mV.multScalar(this.mFrustumTop * ratio);
		var tR3 = this.mU.multScalar(this.mFrustumRight * ratio);

		topRightVec3.setFromVec3(this.mEyePoint.add(tR1.add(tR2.add(tR3))));

		var bL1 = viewDirection.multScalar(this.mFarClip);
		var bL2 = this.mV.multScalar(this.mFrustumBottom * ratio);
		var bL3 = this.mU.multScalar(this.mFrustumLeft * ratio);

		bottomLeftVec3.setFromVec3(this.mEyePoint.add(bL1.add(bL2.add(bL3))));

		var bR1 = viewDirection.multScalar(this.mFarClip);
		var bR2 = this.mV.multScalar(this.mFrustumBottom * ratio);
		var bR3 = this.mU.multScalar(this.mFrustumRight * ratio);

		bottomRightVec3.setFromVec3(this.mEyePoint.add(bR1.add(bR2.add(bR3))));
	},

	getFrustum: function () {
		this.calcMatrices();
		var array = {};

		array["left"] = this.mFrustumLeft;
		array["top"] = this.mFrustumTop;
		array["right"] = this.mFrustumRight;
		array["bottom"] = this.mFrustumBottom;
		array["near"] = this.mNearClip;
		array["far"] = this.mFarClip;

		return array;
	},

	generateRay: function ( uPos, vPos, imagePlaneApectRatio ) {
		// TODO: Implement Ray
		this.calcMatrices();

		var s = ( uPos - 0.5 ) * imagePlaneApectRatio;
		var t = ( vPos - 0.5 );
		var viewDistance = imagePlaneApectRatio / Math.abs( this.mFrustumRight - this.mFrustumLeft ) * this.mNearClip;

		var mU = this.mU.multScalar(s);
		var mV = this.mV.multScalar(t);
		var mW = this.mW.multScalar(viewDistance);

		return new Ray( this.mEyePoint, ( mU.add(mV).sub(mW) ).normalized() );
	},

	getBillboardVectors: function (rightVec3, upVec3) {
		var m = this.getModelViewMatrix().components;
		right.setFromElements( m[0], m[4], m[8] );
		up.setFromElements( m[1], m[5], m[9] );
	},

	worldToScreen: function ( worldCoordVec3, screenWidth, screenHeight ) {
		var eyeCoord = this.getModelViewMatrix().transformPointAffine( worldCoordVec3 );
		var ndc = this.getProjectionMatrix().transformPoint( eyeCoord );
	
		return new Vec2f( 
			( ndc.x() + 1.0 ) / 2.0 * screenWidth, 
			( 1.0 - ( ndc.y() + 1.0 ) / 2.0 ) * screenHeight 
		);
	},
	worldToEye: function ( worldCoordVec3 ) {
		return this.getModelViewMatrix().transformPointAffine( worldCoordVec3 );
	},
	worldToEyeDepth: function( worldCoordVec3 ) { 
		var m = getModelViewMatrix.components;
		return m[2] * worldCoordVec3.x() + 
				m[6] * worldCoordVec3.y() + 
				m[10] * worldCoordVec3.z() + 
				m[14]; 
	},
	worldToNdc: function( worldCoordVec3 ) { 
		var eye = getModelViewMatrix().transformPointAffine( worldCoordVec3 ); 
		return getProjectionMatrix().transformPoint( eye ); 
	},

	getScreenRadius: function ( sphere, screenWidth, screenHeight ) {
		// TODO: Implement Sphere
		// Vec2f screenCenter( worldToScreen( sphere.getCenter(), screenWidth, screenHeight ) );	
		// Vec3f orthog = mViewDirection.getOrthogonal().normalized();
		// Vec2f screenPerimeter = worldToScreen( sphere.getCenter() + sphere.getRadius() * orthog, screenWidth, screenHeight );
		// return screenPerimeter.distance( screenCenter );
		throw "This is not implemented yet";
	},

	calcMatrices: function () {
		if( ! this.mModelViewCached ) {
			this.calcModelView();
		}
		if( ! this.mProjectionCached ) {
			this.calcProjection();
		}
	},

	calcModelView: function () {
		this.mW = this.mViewDirection.normalized().inverse();
		this.mU = this.mOrientation.mult( Vec3f.xAxis() );
		this.mV = this.mOrientation.mult( Vec3f.yAxis() );

		var d = new Vec3f( -this.mEyePoint.dot( this.mU ), -this.mEyePoint.dot( this.mV ), -this.mEyePoint.dot( this.mW ) );
		
		var m = this.mModelViewMatrix.components;
		m[ 0] = this.mU.x(); m[ 4] = this.mU.y(); m[ 8] = this.mU.z(); m[12] =  d.x();
		m[ 1] = this.mV.x(); m[ 5] = this.mV.y(); m[ 9] = this.mV.z(); m[13] =  d.y();
		m[ 2] = this.mW.x(); m[ 6] = this.mW.y(); m[10] = this.mW.z(); m[14] =  d.z();
		m[ 3] = 0.0; 	   m[ 7] = 0.0; 	  m[11] = 0.0; 		 m[15] =  1.0;
	
		this.mModelViewCached = true;
		this.mInverseModelViewCached = false;
	},

	calcInverseModelView: function () {
		if( ! this.mModelViewCached ) {
			this.calcModelView();
		}

		this.mInverseModelViewMatrix = this.mModelViewMatrix.affineInverted();
		this.mInverseModelViewCached = true;	
	},













};