function Quatf (d0, d1, d2, d3) {
	QuatBase.call(this, Float32Array, Quatf, Vec3f, Matrix33f, Matrix44f);
	this.type = CINDER.TYPES.QUATF;
	switch(arguments.length) {
		case 0: this.setToIdentity(); break;
		case 1: {
			if( d0.type !== undefined ) {
				switch(d0.type) {
					case CINDER.TYPES.QUATF: this.setFromQuaternion(d0); break;
					case CINDER.TYPES.MAT3F: this.setFromMatrix33(d0); break;
					case CINDER.TYPES.MAT4F: this.setFromMatrix44(d0); break;
				}
			}
		}
		break;
		case 2: {
			if( d0.type !== undefined ) {
				this.setFromFromTo(d0, d1);
			}
			else {
				if( d0.type !== undefined ) {
					this.setFromAxisRadian( d0, d1 );
				}
				else {
					this.setFromAxisRadian( d1, d0 );
				}
			}
		}
		break;
		case 3: this.setFromRotations( d0, d1, d2 ); break;
		case 4: this.setFromElements( d0, d1, d2, d3 ); break;
	}

	return this;
}

Quatf.prototype = Object.create( QuatBase.prototype );
Quatf.prototype.constructor = Quatf;
Quatf.splineIntermediate = function( q0Quatf, q1Quatf, q2Quatf ) {
	var q1inv = q1Quatf.inverted();
	var c1 = q1inv.mult(q2Quatf);
	var c2 = q1inv.mult(q0Quatf);
	var c2Log = c2.log();
	var c1Log = c1.log();

	var c3 = c2Log.add(c1Log).multScalar(0.25);
	var qa = q1.mult(c3.exp());
	return qa.normalized();
};
Quatf.identity = function () {
	return new Quatf();
}


function QuatBase (arrayType, constructorType, vec3Type, mat3Type, mat4Type) {
	this.ARRAY_TYPE = arrayType;
	this.CONSTRUCTOR_TYPE = constructorType;
	this.VEC3_TYPE = vec3Type;
	this.MAT3_CONSTRUCTOR = mat3Type;
	this.MAT4_CONSTRUCTOR = mat4Type;
	this.EPSILON = 4.37114e-05;
	this.FLT_MIN = 1.1755e-38;
};

QuatBase.prototype.constructor = QuatBase;
QuatBase.prototype.setFromQuaternion = function (quat) {
	this.components = new this.ARRAY_TYPE(quat.components);
};
QuatBase.prototype.setFromRotations = function (xRotation, yRotation, zRotation) {
	zRotation *= 0.5;
	yRotation *= 0.5;
	xRotation *= 0.5;
	// get sines and cosines of half angles
	var Cx = Math.cos( xRotation );
	var Sx = Math.sin( xRotation );
	var Cy = Math.cos( yRotation );
	var Sy = Math.sin( yRotation );
	var Cz = Math.cos( zRotation );
	var Sz = Math.sin( zRotation );

	// multiply it out
	this.components = new this.ARRAY_TYPE([  
		Cx*Cy*Cz - Sx*Sy*Sz,
		Sx*Cy*Cz + Cx*Sy*Sz,
		Cx*Sy*Cz - Sx*Cy*Sz,
		Cx*Cy*Sz + Sx*Sy*Cx
	]);
};
QuatBase.prototype.setFromFromTo = function (fromVec3, toVec3) {
	var axis = fromVec3.cross( toVec3 );
	
	this.setFromElements( fromVec3.dot( toVec3 ), axis.components[0], axis.components[1], axis.components[2] );
	this.normalize();

	//w
	this.components[0] += 1.0;
	
	if( this.components[0] <= this.EPSILON ) {
		if ( fromVec3.components[2] * fromVec3.components[2] > fromVec3.components[0] * fromVec3.components[0] ) {
			this.setFromElements( 0.0, 0.0, fromVec3.components[2], -fromVec3.components[1] );
		}
		else {
			this.setFromElements( 0.0, fromVec3.components[1], -fromVec3.components[0], 0.0 );
		}
	}
	
	this.normalize();
};
QuatBase.prototype.setFromAxisRadian = function (axisVec3, radian) {
	var v = axisVec3.normalized().multScalar(Math.sin( radians / 2 ));
	this.components = new this.ARRAY_TYPE([  
		Math.cos( radians / 2 ),
		v.components[0],
		v.components[1],
		v.components[2]
	]);
};
QuatBase.prototype.setFromMatrix33 = function (matrix33) {
	var trace = matrix33.trace();
	if ( trace > 0.0 ) {
		var s = Math.sqrt( trace + 1.0 );
		var recip = 0.5 / s;
		this.components = new this.ARRAY_TYPE([  
			s * 0.5,
			( matrix33.at(2,1) - matrix33.at(1,2) ) * recip,
			( matrix33.at(0,2) - matrix33.at(2,0) ) * recip,
			( matrix33.at(1,0) - matrix33.at(0,1) ) * recip
		]);
	}
	else {
		this.components = new this.ARRAY_TYPE(4);
		var i = 0;
		if( matrix33.at(1,1) > matrix33.at(0,0) ) {
			i = 1;
		}
		if( matrix33.at(2,2) > matrix33.at(i,i) ) {
			i = 2;
		}
		var j = ( i + 1 ) % 3;
		var k = ( j + 1 ) % 3;
		var s = Math.sqrt( matrix33.at(i,i) - matrix33.at(j,j) - matrix33.at(k,k) + 1.0 );
		this.components[i+1] = 0.5 * s;
		var recip = 0.5 / s;
		this.components[0] = ( matrix33.at(k,j) - matrix33.at(j,k) ) * recip;
		this.components[j+1] = ( matrix33.at(j,i) + matrix33.at(i,j) ) * recip;
		this.components[k+1] = ( matrix33.at(k,i) + matrix33.at(i,k) ) * recip;
	}
};
QuatBase.prototype.setFromMatrix44 = function (matrix44) {
	var trace = matrix44.trace();
	if ( trace > 0.0 ) {
		var s = Math.sqrt( trace + 1.0 );
		var recip = 0.5 / s;
		this.components = new this.ARRAY_TYPE([ 
			s * 0.5,
			( matrix44.at(2,1) - matrix44.at(1,2) ) * recip,
			( matrix44.at(0,2) - matrix44.at(2,0) ) * recip,
			( matrix44.at(1,0) - matrix44.at(0,1) ) * recip
		]);
	}
	else {
		this.components = new this.ARRAY_TYPE(4);
		var i = 0;
		if( matrix44.at(1,1) > matrix44.at(0,0) )
			i = 1;
		if( matrix44.at(2,2) > matrix44.at(i,i) )
			i = 2;
		var j = ( i + 1 ) % 3;
		var k = ( j + 1 ) % 3;
		var s = Math.sqrt( matrix44.at(i,i) - matrix44.at(j,j) - matrix44.at(k,k) + 1.0 );
		this.components[i+1] = 0.5 * s;
		var recip = 0.5 / s;
		this.components[0] = ( matrix44.at(k,j) - matrix44.at(j,k) ) * recip;
		this.components[j+1] = ( matrix44.at(j,i) + matrix44.at(i,j) ) * recip;
		this.components[k+1] = ( matrix44.at(k,i) + matrix44.at(i,k) ) * recip;
	}
};
QuatBase.prototype.setToIdentity = function () { this.components = new this.ARRAY_TYPE([1, 0, 0, 0]); };
QuatBase.prototype.setFromElements = function (w, x, y, z) { this.components = new this.ARRAY_TYPE([w, x, y, z]); };
QuatBase.prototype.add = function (rhsQuat) {
	return new Quatf( 
		this.components[0] + rhsQuat.components[0], 
		this.components[1] + rhsQuat.components[1], 
		this.components[2] + rhsQuat.components[2], 
		this.components[3] + rhsQuat.components[3] 
	);
};
QuatBase.prototype.addEq = function (rhsQuat) {
	this.components[0] += rhsQuat.components[0];
	this.components[1] += rhsQuat.components[1];
	this.components[2] += rhsQuat.components[2];
	this.components[3] += rhsQuat.components[3];
};
QuatBase.prototype.sub = function (rhsQuat) {
	return new Quatf( 
		this.components[0] - rhsQuat.components[0],
		this.components[1] - rhsQuat.components[1], 
		this.components[2] - rhsQuat.components[2], 
		this.components[3] - rhsQuat.components[3]
	);
};
QuatBase.prototype.subEq = function (rhsQuat) {
	this.components[0] -= rhsQuat.components[0]
	this.components[1] -= rhsQuat.components[1]
	this.components[2] -= rhsQuat.components[2]
	this.components[3] -= rhsQuat.components[3]
};
QuatBase.prototype.multScalar = function (rhScalar) {
	return new Quatf( 
		this.components[0] * rhScalar, 
		this.components[1] * rhScalar, 
		this.components[2] * rhScalar, 
		this.components[3] * rhScalar
	);
};
QuatBase.prototype.multScalarEq = function (rhScalar) {
	this.components[0] *= rhScalar;
	this.components[1] *= rhScalar;
	this.components[2] *= rhScalar;
	this.components[3] *= rhScalar;
};
QuatBase.prototype.mult = function (rhsType) {
	switch(rhsType.type) {
		case CINDER.TYPES.QUATF: { 
			return new Quatf( 
				rhsQuat.components[0]*this.components[0] - rhsQuat.components[1]*this.components[1] - rhsQuat.components[2]*this.components[2] - rhsQuat.components[3]*this.components[3],
   			    rhsQuat.components[0]*this.components[1] + rhsQuat.components[1]*this.components[0] + rhsQuat.components[2]*this.components[3] - rhsQuat.components[3]*this.components[2],
   			    rhsQuat.components[0]*this.components[2] + rhsQuat.components[2]*this.components[0] + rhsQuat.components[3]*this.components[1] - rhsQuat.components[1]*this.components[3],
   			    rhsQuat.components[0]*this.components[3] + rhsQuat.components[3]*this.components[0] + rhsQuat.components[1]*this.components[2] - rhsQuat.components[2]*this.components[1]
   			);
		}
		break;
		case CINDER.TYPES.VEC3F: { 
			var vMult = 2 * ( this.components[1] * rhsType.components[0] + this.components[2] * rhsType.components[1] + this.components[3] * rhsType.components[2] );
			var crossMult = 2 * this.components[0];
			var pMult = crossMult * this.components[0] - 1;
			return new Vec3f( 
				pMult * rhsType.components[0] + vMult * this.components[1] + crossMult * ( this.components[2] * rhsType.components[2] - this.components[3] * rhsType.components[1] ),
				pMult * rhsType.components[1] + vMult * this.components[2] + crossMult * ( this.components[3] * rhsType.components[0] - this.components[1] * rhsType.components[2] ),
				pMult * rhsType.components[2] + vMult * this.components[3] + crossMult * ( this.components[1] * rhsType.components[1] - this.components[2] * rhsType.components[0] ) 
			);
		}
		break;
	}
};
QuatBase.prototype.multEq = function (rhsQuat) {
	this.components.set(this.mult(rhsQuat).components);
};
QuatBase.prototype.x = function (x) {
	if( x === undefined ) {
		return this.components[1];
	}
	else {
		return this.components[1] = x;
	}
};
QuatBase.prototype.y = function (y) {
	if( y === undefined ) {
		return this.components[2];
	}
	else {
		return this.components[2] = y;
	}
};
QuatBase.prototype.z = function (z) {
	if( z === undefined ) {
		return this.components[3];
	}
	else {
		return this.components[3] = z;
	}
};
QuatBase.prototype.v = function (v) {
	if( v === undefined ) {
		return new this.VEC3_TYPE(this.components[1], this.components[2], this.components[3]);
	}
	else {
		this.components[1] = v.components[0];
		this.components[2] = v.components[1];
		this.components[3] = v.components[2];
		return new this.VEC3_TYPE(this.components[1], this.components[2], this.components[3]);
	}
};
QuatBase.prototype.w = function (w) {
	if( w === undefined ) {
		return this.components[0];
	}
	else {
		return this.components[0] = w;
	}
};
QuatBase.prototype.getAxis = function () {
	var cos_angle = this._w;
	var invLen = 1.0 / Math.sqrt( 1 - cos_angle * cos_angle );
	return this.v().multScalar(invLen);
};
QuatBase.prototype.getAngle = function () {
	var cos_angle = this.components[0];
	return Math.acos( cos_angle ) * 2;
};
QuatBase.prototype.getPitch = function () {
	return Math.atan2( 
		2 * ( this.components[2] * this.components[3] + this.components[0] * this.components[1] ), 
		this.components[0] * this.components[0] - this.components[1] * this.components[1] - 
		this.components[2] * this.components[2] + this.components[3] * this.components[3] 
	);
};
QuatBase.prototype.getYaw = function () { return Math.sin( -2 * ( this.components[1] * this.components[3] - this.components[0] * this.components[2] ) ); };
QuatBase.prototype.getRoll = function () {
	return Math.atan2( 2 * ( this.components[1] * this.components[2] + this.components[0] * this.components[3]), 
		this.components[0] * this.components[0] + this.components[1] * this.components[1] - this.components[2] * 
		this.components[2] - this.components[3] * this.components[3] );
};
QuatBase.prototype.dot = function (rhsQuat) { return this.components[0] * rhsQuat.components[0] + this.v().dot( rhsQuat.v() ); };
QuatBase.prototype.length = function () { return Math.sqrt( this.components[0] * this.components[0] + this.v().lengthSquared() ); };
QuatBase.prototype.lengthSquared = function () { return this.components[0] * this.components[0] + this.v().lengthSquared(); };
QuatBase.prototype.inverse = function () {
	var norm = this.components[0] * this.components[0] + 
		this.components[1] * this.components[1] + 
		this.components[2] * this.components[2] + 
		this.components[3] * this.components[3];
	// if we're the zero quaternion, just return identity
	/*if( ! ( math<T>::abs( norm ) < EPSILON_VALUE ) ) {
		return identity();
	}*/
	var normRecip = 1.0 / norm;
	return new this.CONSTRUCTOR_TYPE( 
		normRecip * this.components[0], 
		-normRecip * this.components[1], 
		-normRecip * this.components[2], 
		-normRecip * this.components[3] 
	);
};
QuatBase.prototype.normalize = function () {
	var len = this.length()
	if( len ) {
		this.components[0] /= len;
		var t = this.v().divScalar( len );
		this.components[1] = t.components[0];
		this.components[2] = t.components[1];
		this.components[3] = t.components[2];
	}
	else {
		this.components[0] = 1.0;
		this.components[1] = 0.0;
		this.components[2] = 0.0;
		this.components[3] = 0.0;
	}
};
QuatBase.prototype.normalized = function () {
	var result = new Quatf(this);
	console.log(result);
	var len = this.length();
	if( len ) {
		result.components[0] /= len;
		var t = result.v().divScalar(len);
		result.components[1] = t.components[0];
		result.components[2] = t.components[1];
		result.components[3] = t.components[2];
	}
	else {
		result.setToIdentity();
	}
	
	return result;
};
QuatBase.prototype.log = function () {
	var theta = Math.acos( Math.min( this.components[0], 1.0 ) );
	if( theta == 0 )
		return new this.CONSTRUCTOR_TYPE( this.v(), 0 );
    
	var sintheta = Math.sin( theta );
    
	var k;
	if ( Math.abs( sintheta ) < 1 && Math.abs( theta ) >= 3.402823466e+38 * Math.abs( sintheta ) ){
		k = 1;
	}
	else {
		k = theta / sintheta;
	}
	return new this.CONSTRUCTOR_TYPE( 0, this.components[1] * k, this.components[2] * k, this.components[3] * k );
};

QuatBase.prototype.exp = function () {
	var theta = v.length();
	var sintheta = Math.sin( theta );
    
	var k;
	if( Math.abs( theta ) < 1 && Math.abs( sintheta ) >= 3.402823466e+38 * Math.abs( theta ) ){
		k = 1;
	}
	else {
		k = sintheta / theta;
	}
	var costheta = Math.cos( theta );
	return new this.CONSTRUCTOR_TYPE( costheta, this.components[1] * k, this.components[2] * k, this.components[3] * k );
};
QuatBase.prototype.inverted = function() {
    var qdot = this.dot( this );
	return new Quatf( this.v().divScalar(qdot).invert(), this.components[0] / qdot );
};
QuatBase.prototype.invert = function () {
	var qdot = this.dot( this );
	setFromAxisRadian( this.v().divScalar(qdot).invert(), this.components[0] / qdot );	
};
QuatBase.prototype.getAxisAngle = function (axisVec3, radians) {
	// TODO: make sure radians is becoming changed
	// if not we need figure out what to return
	var cos_angle = this.components[0];
	radians = Math.acos( cos_angle ) * 2;
	var invLen = 1.0 / Math.sqrt( 1.0 - cos_angle * cos_angle );
	axisVec3.components[0] = this.components[1] * invLen;
	axisVec3.components[1] = this.components[2] * invLen;
	axisVec3.components[2] = this.components[3] * invLen;
};
QuatBase.prototype.toMatrix33 = function () {
	var mV = new this.MAT3_CONSTRUCTOR();
	var xs, ys, zs, wx, wy, wz, xx, xy, xz, yy, yz, zz;

	xs = this.components[1] + this.components[1];   
	ys = this.components[2] + this.components[2];
	zs = this.components[3] + this.components[3];
	wx = this.components[0] * xs;
	wy = this.components[0] * ys;
	wz = this.components[0] * zs;
	xx = this.components[1] * xs;
	xy = this.components[1] * ys;
	xz = this.components[1] * zs;
	yy = this.components[2] * ys;
	yz = this.components[2] * zs;
	zz = this.components[3] * zs;

	mV.components[0] = 1 - ( yy + zz );
	mV.components[3] = xy - wz;
	mV.components[6] = xz + wy;

	mV.components[1] = xy + wz;
	mV.components[4] = 1 - ( xx + zz );
	mV.components[7] = yz - wx;

	mV.components[2] = xz - wy;
	mV.components[5] = yz + wx;
	mV.components[8] = 1 - ( xx + yy );

	return mV;
};
QuatBase.prototype.toMatrix44 = function () {
	var mV = new this.MAT4_CONSTRUCTOR();
	var xs, ys, zs, wx, wy, wz, xx, xy, xz, yy, yz, zz;

	xs = this.components[1] + this.components[1];   
	ys = this.components[2] + this.components[2];
	zs = this.components[3] + this.components[3];
	wx = this.components[0] * xs;
	wy = this.components[0] * ys;
	wz = this.components[0] * zs;
	xx = this.components[1] * xs;
	xy = this.components[1] * ys;
	xz = this.components[1] * zs;
	yy = this.components[2] * ys;
	yz = this.components[2] * zs;
	zz = this.components[3] * zs;

	mV.components[ 0] = 1 - ( yy + zz );
	mV.components[ 4] = xy - wz;
	mV.components[ 8] = xz + wy;
	mV.components[12] = 0;

	mV.components[ 1] = xy + wz;
	mV.components[ 5] = 1 - ( xx + zz );
	mV.components[ 9] = yz - wx;
	mV.components[13] = 0;

	mV.components[ 2] = xz - wy;
	mV.components[ 6] = yz + wx;
	mV.components[10] = 1 - ( xx + yy );
	mV.components[14] = 0;

	mV.components[ 3] = 0;
	mV.components[ 7] = 0;
	mV.components[11] = 0;
	mV.components[15] = 1;

	return mV;
};
QuatBase.prototype.lerp = function (t, endQuat) {
	// get cos of "angle" between quaternions
	var cosTheta = this.dot( endQuat );

	// initialize result
	var result = endQuat.mult( t );

	// if "angle" between quaternions is less than 90 degrees
	if( cosTheta >= this.EPSILON ) {
		// use standard interpolation
		result.addEq( this.multScalar( 1.0 - t ) );
	}
	else {
		// otherwise, take the shorter path
		result.addEq( this.multScalar(t - 1.0) );
	}
		
	return result;
};
QuatBase.prototype.slerpShortestUnenforced = function ( t, endQuat ) {
	var d = this.sub(endQuat);
	var lengthD = Math.sqrt( this.dot( endQuat ) );

	var st = this.add(endQuat);
	var lengthS = Math.sqrt( st.dot( st ) );
	
	var a = 2 * Math.atan2( lengthD, lengthS );
	var s = 1 - t;

	var sX1 = MATH.sinx_over_x( s * a ) / MATH.sinx_over_x( a ) * s;
	var sX2 = MATH.sinx_over_x( t * a ) / MATH.sinx_over_x( a ) * t;

	var quat1 = this.mult( sX1 );
	var quat2 = end.mult( sX2 ); 

	var q = new this.CONSTRUCTOR_TYPE( quat1.add(quat2) );

	return q.normalized();
};
QuatBase.prototype.slerp = function (t, endQuat) {
	// get cosine of "angle" between quaternions
	var cosTheta = this.dot( endQuat );
	var startInterp, endInterp;
	// if "angle" between quaternions is less than 90 degrees
	if( cosTheta >= this.EPSILON ) {
		// if angle is greater than zero
		if( ( 1.0 - cosTheta ) > this.EPSILON ) {
			// use standard slerp
			var theta = Math.acos( cosTheta );
			var recipSinTheta = 1.0 / Math.sin( theta );
			startInterp = Math.sin( ( 1.0 - t ) * theta ) * recipSinTheta;
			endInterp = Math.sin( t * theta ) * recipSinTheta;
		}
		// angle is close to zero
		else {
			// use linear interpolation
			startInterp = 1.0 - t;
			endInterp = t;
		}
	}
	// otherwise, take the shorter route
	else {
		// if angle is less than 180 degrees
		if( ( 1.0 + cosTheta ) > this.EPSILON ) {
			// use slerp w/negation of start quaternion
			var theta = Math.acos( -cosTheta );
			var recipSinTheta = 1.0 / Math.sin( theta );
			startInterp = Math.sin( ( t - 1.0 ) * theta ) * recipSinTheta;
			endInterp = Math.sin( t * theta ) * recipSinTheta;
		}
		// angle is close to 180 degrees
		else {
			// use lerp w/negation of start quaternion
			startInterp = t - 1.0;
			endInterp = t;
		}
	}
    
    var quat1 = this.mult(startInterp);
    var quat2 = endQuat.mult(endInterp);
	return quat1.add(quat2);
};
QuatBase.prototype.squadShortestEnforced = function( t, qaQuat, qbQuat, q2Quat ) {
	var r1, r2;
	if( this.dot( q2Quat ) >= 0 ) {
		r1 = this.slerpShortestUnenforced( t, q2Quat );
	}
	else {
		r1 = this.slerpShortestUnenforced( t, q2Quat.inverted() );
	}
	
	if( qaQuat.dot( qbQuat ) >= 0 ) {
		r2 = qaQuat.slerpShortestUnenforced( t, qbQuat );
	}
	else {
		r2 = qaQuat.slerpShortestUnenforced( t, qbQuat.inverted() );
	}
	
	if( r1.dot( r2 ) >= 0 ) {
		return r1.slerpShortestUnenforced( 2 * t * (1-t), r2 );
	}
	else {
		return r1.slerpShortestUnenforced( 2 * t * (1-t), r2.inverted() );
	}
};
QuatBase.prototype.squad = function( t, qaQuat, qbQuat, q2Quat ) {
	var r1 = this.slerp( t, q2Quat );	
	var r2 = qaQuat.slerp( t, qbQuat );
	return r1.slerp( 2 * t * (1-t), r2 );
};
QuatBase.prototype.spline = function( t, q1Quat, q2Quat, q3Quat ) {
	var qa = this.splineIntermediate( this, q1Quat, q2Quat );
	var qb = this.splineIntermediate( q1Quat, q2Quat, q3Quat );
	return q1Quat.squadShortestEnforced( t, qa, qb, q2Quat );
};




