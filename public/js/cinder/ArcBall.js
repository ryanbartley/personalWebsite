function ArcBall (screenSizeVec2) {

	if( arguments.length === 0 ) {
		this.mWindowSize = new Vec2f();
		this.mInitialMousePos = new Vec2f();
		this.mCenter = new Vec2f();
	
		this.mRadius = 0.0;
		this.mConstraintAxis = new Vec3f();
		this.mUseConstraint = false;

		this.mCurrentQuat = Quatf.identity():
		this.mInitialQuat = Quatf.identity();

		this.setNoConstraintAxis();
	}
	else if( arguments.length === 1 ) {
		this.mWindowSize = screenSizeVec2;
		this.setCenter( new Vec2f( 
			this.mWindowSize.x() / 2.0, 
			this.mWindowSize.y() / 2.0 
			) 
		);
		this.mInitialMousePos = new Vec2f();
		this.mConstraintAxis = new Vec3f();
		
		this.mRadius = Math.min( this.mWindowSize.x() / 2.0, this.mWindowSize.y() / 2 );
		setNoConstraintAxis()

		this.mCurrentQuat = Quatf.identity():
		this.mInitialQuat = Quatf.identity();
	}

	return this;
};

ArcBall.prototype = {
	constructor: ArcBall,

	mouseDown: function (mousePos) {
		this.mInitialMousePos = mousePos;
		this.mInitialQuat = this.mCurrentQuat;
	},
	mouseDrag: function (mousePos) {
		var from = this.mouseOnSphere( this.mInitialMousePos );
		var to = this.mouseOnSphere( mousePos );
		if( this.mUseConstraint ) {
			from = this.constrainToAxis( from, this.mConstraintAxis );
			to = this.constrainToAxis( to, this.mConstraintAxis );
		}

		var axis = from.cross( to );
		this.mCurrentQuat = this.mInitialQuat.mult( new Quatf( from.dot( to ), axis.x(), axis.y(), axis.z() ) );
		this.mCurrentQuat.normalize();
	},
	resetQuat: function () {
		this.mCurrentQuat = Quatf.identity();
		this.mInitialQuat = Quatf.identity();
	},
	getQuat: function () {
		return this.mCurrentQuat;
	},
	setQuat: function (quat) {
		this.mCurrentQuat = quat;
	},
	setWindowSize: function (windowSize) {
		this.mWindowSize = windowSize;
	},
	setCenter: function (center) {
		this.mCenter = center;
	},
	getCenter: function () {
		return this.mCenter;
	},
	setRadius: function (radius) {
		this.radius = radius;
	},
	getRadius: function () {
		return this.radius;
	},
	setConstraintAxis: function (constraintAxisVec3) {
		this.mConstraintAxis = constraintAxisVec3;
		this.mUseConstraint = true;
	},
	setNoConstraintAxis: function () {
		this.mUseConstraint = false;
	},
	isUsingConstraint: function () {
		return this.mUseConstraint;
	},
	getConstraintAxis: function () {
		return this.mConstraintAxis;
	},
	mouseOnSphere: function (point) {
		var result = new Vec3f();

		result.x( ( point.x() - this.mCenter.x() ) / ( this.mRadius * 2 ) );
		result.y( ( point.y() - this.mCenter.y() ) / ( this.mRadius * 2 ) );
		result.z( 0.0 );

		var mag = result.lengthSquared();
		if( mag > 1.0 ) {
			result.normalize();
		}
		else {
			result.z = Math.sqrt( 1.0 - mag );
			result.normalize();
		}

		return result;
	},
	constrainToAxis: function (looseVec3, axisVec3) {
		var onPlane = loose.sub(axis.mult(axis.dot(loose)));
		var norm = onPlane.lengthSquared();
		if( norm > 0.0 ) {
			if( onPlane.z() < 0.0 ) {
				onPlane = onPlane.inverse();
			}
			return ( onPlane.multScalar( 1.0 / Math.sqrt( norm ) ) );
		}

		if( axis.dot( Vec3f.zAxis() ) < 0.0001 ) {
			onPlane = Vec3f.xAxis();
		}
		else {
			onPlane = new Vec3f( -axis.y(), axis.x(), 0.0 );
			onPlane.normalize();
		}

		return onPlane;
	}
}












};