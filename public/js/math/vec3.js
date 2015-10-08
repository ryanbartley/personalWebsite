///////////////////////////////////////////////////////////////////////////
// Vec3i Class Uint32Array Version of Vec3Base TODO: Test
///////////////////////////////////////////////////////////////////////////

function Vec3i (x, y, z) {
	Vec3Base.call(this, Uint32Array, Vec3i, Vec2i );
	this.type =  CINDER.TYPES.VEC3I

	if( arguments.length === 0 ) {
		this.setToNull();
	}
	else if( arguments.length === 1 ) {
		this.setFromVec3(x);
	}
	else if( arguments.length === 3 ) {
		this.setFromElements(x, y, z);
	}
	return this;
};

Vec3i.prototype = Object.create( Vec3Base.prototype );
Vec3i.prototype.constructor = Vec3i;
Vec3i.zero = function () { return new Vec3i( 0, 0, 0 ); };
Vec3i.one = function () { return new Vec3i( 1, 1, 1 ); };
Vec3i.xAxis = function () { return new Vec3i( 1, 0, 0 ); };
Vec3i.yAxis = function () { return new Vec3i( 0, 1, 0 ); };
Vec3i.zAxis = function () { return new Vec3i( 0, 0, 1 ); };

///////////////////////////////////////////////////////////////////////////
// Vec3f Class Float32Array Version of Vec3Base TODO: Test
///////////////////////////////////////////////////////////////////////////

function Vec3f (x, y, z) {
	Vec3Base.call(this, Float32Array, Vec3f, Vec2f );
	this.type = CINDER.TYPES.VEC3F;

	if( arguments.length === 0 ) {
		this.setToNull();
	}
	else if( arguments.length === 1 ) {
		this.setFromVec3(x);
	}
	else if( arguments.length === 3 ) {
		this.setFromElements(x, y, z);
	}
	return this;
};

Vec3f.prototype = Object.create( Vec3Base.prototype );
Vec3f.prototype.constructor = Vec3f;
Vec3f.zero = function () { return new Vec3f( 0, 0, 0 ); };
Vec3f.one = function () { return new Vec3f( 1, 1, 1 ); };
Vec3f.xAxis = function () { return new Vec3f( 1, 0, 0 ); };
Vec3f.yAxis = function () { return new Vec3f( 0, 1, 0 ); };
Vec3f.zAxis = function () { return new Vec3f( 0, 0, 1 ); };

///////////////////////////////////////////////////////////////////////////
// Vec3Base Class Implementing all Array and Constructor Independent Functions TODO: Test
///////////////////////////////////////////////////////////////////////////

function Vec3Base (arrayType, constructorType, swizzleConstructor2) {
	this.ARRAY_TYPE = arrayType;
	this.CONSTUCTOR_TYPE = constructorType;
	this.SWIZZLE_CONSTRUCTOR2 = swizzleConstructor2;
};

Vec3Base.prototype.constructor = Vec3Base;
Vec3Base.prototype.setFromVec3 = function(vec3) { this.components = new this.ARRAY_TYPE(vec3.components); };
Vec3Base.prototype.setFromElements = function (x, y, z) { this.components = new this.ARRAY_TYPE([x, y, z]); };
Vec3Base.prototype.setToNull = function () { this.components = new this.ARRAY_TYPE(3); };
Vec3Base.prototype.copy = function (rhVec3) { this.components.set(rhVec3.components); };
Vec3Base.prototype.clone = function () { return new this.CONSTUCTOR_TYPE( this.components[0], this.components[1], this.components[2] ); },
Vec3Base.prototype.getComponents = function () { return this.components; },
Vec3Base.prototype.setX = function(x) { this.components[0] = x; },
Vec3Base.prototype.getX = function () { return this.components[0]; },
Vec3Base.prototype.setY = function(y) { this.components[1] = y; },
Vec3Base.prototype.getY = function () {	return this.components[1]; },
Vec3Base.prototype.setZ = function(z) { this.components[2] = z; },
Vec3Base.prototype.getZ = function () {	return this.components[2]; },
Vec3Base.prototype.x = function (x) { 
	if( x !== undefined ) { 
		return this.components[0] = x; 
	} 
	else { 
		return this.components[0]; 
	} 
};
Vec3Base.prototype.y = function (y) { 
	if( y !== undefined ) { 
		return this.components[1] = y; 
	} 
	else { 
		return this.components[1]; 
	} 
};
Vec3Base.prototype.z = function (z) { 
	if( z !== undefined ) { 
		return this.components[2] = z; 
	} 
	else { 
		return this.components[2]; 
	} 
};
Vec3Base.prototype.addEq = function(rhVec3) {
	this.components[0] += rhVec3.components[0];
	this.components[1] += rhVec3.components[1];
	this.components[2] += rhVec3.components[2];
};
Vec3Base.prototype.add = function (rhVec3) {
	return new this.CONSTUCTOR_TYPE( 
		this.components[0] + rhVec3.components[0], 
		this.components[1] + rhVec3.components[1],
		this.components[2] + rhVec3.components[2] 
	);
};
Vec3Base.prototype.subEq = function(rhVec3) {
	this.components[0] -= rhVec3.components[0];
	this.components[1] -= rhVec3.components[1];
	this.components[2] -= rhVec3.components[2];
};
Vec3Base.prototype.sub = function (rhVec3) {
	return new this.CONSTUCTOR_TYPE( 
		this.components[0] - rhVec3.components[0], 
		this.components[1] - rhVec3.components[1],
		this.components[2] - rhVec3.components[2] 
	);
};
Vec3Base.prototype.multEq = function (rhVec3) {
	this.components[0] *= rhVec3.components[0];
	this.components[1] *= rhVec3.components[1];
	this.components[2] *= rhVec3.components[2];
};
Vec3Base.prototype.mult = function (rhVec3) {
	return new this.CONSTUCTOR_TYPE( 
		this.components[0] * rhVec3.components[0], 
		this.components[1] * rhVec3.components[1],
		this.components[2] * rhVec3.components[2] 
	);
};
Vec3Base.prototype.multScalarEq = function (rhScalar) {
	this.components[0] *= rhScalar;
	this.components[1] *= rhScalar;
	this.components[2] *= rhScalar;
};
Vec3Base.prototype.multScalar = function (rhScalar) {
	return new this.CONSTUCTOR_TYPE(
		this.components[0] * rhScalar,
		this.components[1] * rhScalar,
		this.components[2] * rhScalar
	);
};
Vec3Base.prototype.multQuatf = function (rhsQuatf) {
	var vMult = 2 * ( rhsQuatf._v.x() * this.components[0] + rhsQuatf._v.y() * this.components[1] + rhsQuatf._v.z() * this.components[2] );
    var crossMult = 2 * rhsQuatf._w;
    var pMult = crossMult * rhsQuatf._w - 1;

    return new Vec3f( 
    	pMult * this.components[0] + vMult * rhsQuatf._v.components[0] + crossMult * ( rhsQuatf._v.components[1] * this.components[2] - rhsQuatf._v.components[2] * this.components[1] ),        
        pMult * this.components[1] + vMult * rhsQuatf._v.components[1] + crossMult * ( rhsQuatf._v.components[2] * this.components[0] - rhsQuatf._v.components[0] * this.components[2] ),
        pMult * this.components[2] + vMult * rhsQuatf._v.components[2] + crossMult * ( rhsQuatf._v.components[0] * this.components[1] - rhsQuatf._v.components[1] * this.components[0] ) 
    );
};
Vec3Base.prototype.divEq = function (rhVec3) {
	this.components[0] /= rhVec3.components[0];
	this.components[1] /= rhVec3.components[1];
	this.components[2] /= rhVec3.components[2];
};
Vec3Base.prototype.div = function (rhVec3) {
	return new this.CONSTUCTOR_TYPE(
		this.components[0] / rhVec3.components[0],
		this.components[1] / rhVec3.components[1],
		this.components[2] / rhVec3.components[2]
	);
};
Vec3Base.prototype.divScalar = function (rhScalar) {
	return new this.CONSTUCTOR_TYPE(
		this.components[0] / rhScalar,
		this.components[1] / rhScalar,
		this.components[2] / rhScalar
	);
};
Vec3Base.prototype.divScalarEq = function (rhScalar) {
	this.components[0] /= rhScalar;
	this.components[1] /= rhScalar;
	this.components[2] /= rhScalar;
};
Vec3Base.prototype.lerpEq = function (fact, rhVec3) {
	this.components[0] = this.components[0] + ( rhVec3.components[0] - this.components[0] ) * fact;
	this.components[1] = this.components[1] + ( rhVec3.components[1] - this.components[1] ) * fact;
	this.components[2] = this.components[2] + ( rhVec3.components[2] - this.components[2] ) * fact;
};
Vec3Base.prototype.lerp = function (fact, rhVec3) {
	return new this.CONSTUCTOR_TYPE(
		( this.components[0] + ( rhVec3.components[0] - this.components[0] ) * fact ), 
		( this.components[1] + ( rhVec3.components[1] - this.components[1] ) * fact ),
		( this.components[1] + ( rhVec3.components[2] - this.components[1] ) * fact )
	);
};
Vec3Base.prototype.dot = function (rhVec3) {
	return this.components[0] * rhVec3.components[0] + 
		   this.components[1] * rhVec3.components[1] +
		   this.components[2] * rhVec3.components[2];
};
Vec3Base.prototype.cross = function (rhVec3) { 
	return new this.CONSTUCTOR_TYPE( 
		this.components[1] * rhVec3.components[2] - rhVec3.components[1] * this.components[2],
		this.components[2] * rhVec3.components[0] - rhVec3.components[2] * this.components[0],
		this.components[0] * rhVec3.components[1] - rhVec3.components[0] * this.components[1]
	); 
};
Vec3Base.prototype.distance = function (rhVec3) { return this.sub(rhVec3).length(); },
Vec3Base.prototype.distanceSquared = function (rhVec3) { return this.sub(rhVec3).lengthSquared(); },
Vec3Base.prototype.length = function () {
	return Math.sqrt( 
		this.components[0] * this.components[0] + 
		this.components[1] * this.components[1] +
		this.components[2] * this.components[2]
	);
};
Vec3Base.prototype.lengthSquared = function () {
	return this.components[0] * this.components[0] + 
		   this.components[1] * this.components[1] +
		   this.components[2] * this.components[2];
};
Vec3Base.prototype.limit = function (maxLength) {
	var lenSquared = this.lengthSquared();
	if( ( lenSquared > maxLength * maxLength ) && ( lenSquared > 0 ) ) {
		var ratio = maxLength / Math.sqrt( lenSquared );
		this.components[0] *= ratio;
		this.components[1] *= ratio;
		this.components[2] *= ratio;
	}
};
Vec3Base.prototype.limited = function (maxLength) {
	var lenSquared = this.lengthSquared();
	if( ( lenSquared > maxLength * maxLength ) && ( lenSquared > 0 ) ) {
		var ratio = maxLength / Math.sqrt( lenSquared );
		return new this.CONSTUCTOR_TYPE( 
			this.components[0] * ratio, 
			this.components[1] * ratio,
			this.components[2] * ratio 
		);
	}
	else {
		return new this.CONSTUCTOR_TYPE( 
			this.components[0], 
			this.components[1],
			this.components[2] 
		);
	}
};
Vec3Base.prototype.invert = function () {
	this.components[0] = -this.components[0];
	this.components[1] = -this.components[1];
	this.components[2] = -this.components[2];
};
Vec3Base.prototype.inverse = function () { 
	return new this.CONSTUCTOR_TYPE( 
		-this.components[0], 
		-this.components[1],
		-this.components[2]
	); 
};
Vec3Base.prototype.normalize = function () {
	var invS = 1 / this.length();
	this.components[0] *= invS;
	this.components[1] *= invS;
	this.components[2] *= invS;
};
Vec3Base.prototype.normalized = function () {
	var invS = 1 / this.length();
	return new this.CONSTUCTOR_TYPE( 
		this.components[0] * invS, 
		this.components[1] * invS,
		this.components[2] * invS 
	);
};
Vec3Base.prototype.getOrthogonal = function () {
	if( Math.abs( this.components[1] ) < 1 ) {
		return new this.CONSTUCTOR_TYPE( -this.components[2], 0, this.components[0] );
	}
	else {
		return new this.CONSTUCTOR_TYPE( 0, this.components[2], -this.components[1] );
	}
};
Vec3Base.prototype.rotateX = function (angle) {
	var sina = Math.sin( angle );
	var cosa = Math.cos( angle );
	var ry = this.components[1] * cosa - this.components[2] * sina;
	var rz = this.components[1] * sina + this.components[2] * cosa;
	this.components[1] = rx;
	this.components[2] = rz
};
Vec3Base.prototype.rotateY = function (angle) {
	var sina = Math.sin(angle);
	var cosa = Math.cos(angle);
	var rx = this.components[0] * cosa - this.components[2] * sina;
	var rz = this.components[0] * sina + this.components[2] * cosa;
	this.components[0] = rx;
	this.components[2] = rz;
};
Vec3Base.prototype.rotateZ = function (angle) {
	var sina = Math.sin(angle);
	var cosa = Math.cos(angle);
	var rx = this.components[0] * cosa - this.components[1] * sina;
	var ry = this.components[0] * sina + this.components[1] * cosa;
	this.components[0] = rx;
	this.components[1] = ry;
};
Vec3Base.prototype.rotate = function (axisVec3, angle) {
	var cosa = Math.cos(angle);
	var sina = Math.sin(angle);

	var axX = axisVec3.components[0];
	var axY = axisVec3.components[1];
	var axZ = axisVec3.components[2];

	var rx = (cosa + (1 - cosa) * axX * axX) * this.components[0];
	rx += ((1 - cosa) * axX * axY - axZ * sina) * this.components[1];
	rx += ((1 - cosa) * axX * axZ + axY * sina) * this.components[2];

	var ry = ((1 - cosa) * axX * axY + axZ * sina) * this.components[0];
	ry += (cosa + (1 - cosa) * axY * axY) * this.components[1];
	ry += ((1 - cosa) * axY * axZ - axX * sina) * this.components[2];

	var rz = ((1 - cosa) * axX * axZ - axY * sina) * this.components[0];
	rz += ((1 - cosa) * axY * axZ + axX * sina) * this.components[1];
	rz += (cosa + (1 - cosa) * axZ * axZ) * this.components[2];

	this.components[0] = rx;
	this.components[1] = ry;
	this.components[2] = rz;
};
Vec3Base.prototype.slerp = function (fact, rVec3) {
	var cosAlpha, alpha, sinAlpha;
	var t1, t2;

	cosAlpha = this.dot( rVec3 );

	alpha = Math.acos( cosAlpha );

	sinAlpha = Math.sin( alpha );

	t1 = Math.sin( ( 1 - fact ) * alpha ) / sinAlpha;
	t2 = Math.sin( fact * alpha ) / sinAlpha;

	var newThis = this.clone();
	var newRVec3 = rVec3.clone();
	newThis.multScalar(t1);
	newRVec3.multScalar(t2);

	return newThis.add(newRVec3);
};
Vec3Base.prototype.squad = function (t, tangentAVec3, tangentBVec3, endVec3) {
	var r1 = this.slerp( t, end );
	var r2 = tangentAVec3.slerp( t, tangentBVec3 );
	return r1.slerp( 2 * t * (1-t), r2 );
};

Vec3Base.prototype.xx = function () { return new this.SWIZZLE_CONSTRUCTOR2(this.components[0], this.components[0]); };
Vec3Base.prototype.xy = function () { return new this.SWIZZLE_CONSTRUCTOR2(this.components[0], this.components[1]); };
Vec3Base.prototype.xz = function () { return new this.SWIZZLE_CONSTRUCTOR2(this.components[0], this.components[2]); };
Vec3Base.prototype.yx = function () { return new this.SWIZZLE_CONSTRUCTOR2(this.components[1], this.components[0]); };
Vec3Base.prototype.yy = function () { return new this.SWIZZLE_CONSTRUCTOR2(this.components[1], this.components[1]); };
Vec3Base.prototype.yz = function () { return new this.SWIZZLE_CONSTRUCTOR2(this.components[1], this.components[2]); };
Vec3Base.prototype.zx = function () { return new this.SWIZZLE_CONSTRUCTOR2(this.components[2], this.components[0]); };
Vec3Base.prototype.zy = function () { return new this.SWIZZLE_CONSTRUCTOR2(this.components[2], this.components[1]); };
Vec3Base.prototype.zz = function () { return new this.SWIZZLE_CONSTRUCTOR2(this.components[2], this.components[2]); };

Vec3Base.prototype.xxx = function () { return new this.CONSTUCTOR_TYPE(this.components[0], this.components[0], this.components[0]); };
Vec3Base.prototype.xxy = function () { return new this.CONSTUCTOR_TYPE(this.components[0], this.components[0], this.components[1]); };
Vec3Base.prototype.xxz = function () { return new this.CONSTUCTOR_TYPE(this.components[0], this.components[0], this.components[2]); };
Vec3Base.prototype.xyx = function () { return new this.CONSTUCTOR_TYPE(this.components[0], this.components[1], this.components[0]); };
Vec3Base.prototype.xyy = function () { return new this.CONSTUCTOR_TYPE(this.components[0], this.components[1], this.components[1]); };
Vec3Base.prototype.xyz = function () { return new this.CONSTUCTOR_TYPE(this.components[0], this.components[1], this.components[2]); };
Vec3Base.prototype.xzx = function () { return new this.CONSTUCTOR_TYPE(this.components[0], this.components[2], this.components[0]); };
Vec3Base.prototype.xzy = function () { return new this.CONSTUCTOR_TYPE(this.components[0], this.components[2], this.components[1]); };
Vec3Base.prototype.xzz = function () { return new this.CONSTUCTOR_TYPE(this.components[0], this.components[2], this.components[2]); };
Vec3Base.prototype.yxx = function () { return new this.CONSTUCTOR_TYPE(this.components[1], this.components[0], this.components[0]); };
Vec3Base.prototype.yxy = function () { return new this.CONSTUCTOR_TYPE(this.components[1], this.components[0], this.components[1]); };
Vec3Base.prototype.yxz = function () { return new this.CONSTUCTOR_TYPE(this.components[1], this.components[0], this.components[2]); };
Vec3Base.prototype.yyx = function () { return new this.CONSTUCTOR_TYPE(this.components[1], this.components[1], this.components[0]); };
Vec3Base.prototype.yyy = function () { return new this.CONSTUCTOR_TYPE(this.components[1], this.components[1], this.components[1]); };
Vec3Base.prototype.yyz = function () { return new this.CONSTUCTOR_TYPE(this.components[1], this.components[1], this.components[2]); };
Vec3Base.prototype.yzx = function () { return new this.CONSTUCTOR_TYPE(this.components[1], this.components[2], this.components[0]); };
Vec3Base.prototype.yzy = function () { return new this.CONSTUCTOR_TYPE(this.components[1], this.components[2], this.components[1]); };
Vec3Base.prototype.yzz = function () { return new this.CONSTUCTOR_TYPE(this.components[1], this.components[2], this.components[2]); };
Vec3Base.prototype.zxx = function () { return new this.CONSTUCTOR_TYPE(this.components[2], this.components[0], this.components[0]); };
Vec3Base.prototype.zxy = function () { return new this.CONSTUCTOR_TYPE(this.components[2], this.components[0], this.components[1]); };
Vec3Base.prototype.zxz = function () { return new this.CONSTUCTOR_TYPE(this.components[2], this.components[0], this.components[2]); };
Vec3Base.prototype.zyx = function () { return new this.CONSTUCTOR_TYPE(this.components[2], this.components[1], this.components[0]); };
Vec3Base.prototype.zyy = function () { return new this.CONSTUCTOR_TYPE(this.components[2], this.components[1], this.components[1]); };
Vec3Base.prototype.zyz = function () { return new this.CONSTUCTOR_TYPE(this.components[2], this.components[1], this.components[2]); };
Vec3Base.prototype.zzx = function () { return new this.CONSTUCTOR_TYPE(this.components[2], this.components[2], this.components[0]); };
Vec3Base.prototype.zzy = function () { return new this.CONSTUCTOR_TYPE(this.components[2], this.components[2], this.components[1]); };
Vec3Base.prototype.zzz = function () { return new this.CONSTUCTOR_TYPE(this.components[2], this.components[2], this.components[2]); };