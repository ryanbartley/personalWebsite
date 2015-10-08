///////////////////////////////////////////////////////////////////////////
// Vec4i Class Uint32Array Version of Vec4 TODO: Test
///////////////////////////////////////////////////////////////////////////

function Vec4i (d0, d1, d2, d3) {
	Vec4Base.call(this, Uint32Array, Vec4i, Vec2i, Vec3i );
	this.type = CINDER.TYPES.VEC4I;

	if( arguments.length === 0 ) {
		this.setToNull();
	}
	else if( arguments.length === 1 ) {
		if( d0.type !== undefined ) {
			switch (d0.type) {
				case CINDER.TYPES.VEC4I: {
					this.setFromVec4(d0);
				}
				break;
				case CINDER.TYPES.VEC4F: {
					this.setFromVec4(d0);
				}
			}
		}
	}
	else if( arguments.length === 4 ) {
		this.setFromElements(d0, d1, d2, d3);
	}
	return this;
};

Vec4i.prototype = Object.create( Vec4Base.prototype );
Vec4i.prototype.constructor = Vec4i;
Vec4i.zero = function () { return new Vec4i( 0, 0, 0, 0 ); };
Vec4i.one = function () { return new Vec4i( 1, 1, 1, 1 ); };
Vec4i.xAxis = function () { return new Vec4i( 1, 0, 0, 0 ); };
Vec4i.yAxis = function () { return new Vec4i( 0, 1, 0, 0 ); };
Vec4i.zAxis = function () { return new Vec4i( 0, 0, 1, 0 ); };
Vec4i.wAxis = function () { return new Vec4i( 0, 0, 0, 1 ); };

///////////////////////////////////////////////////////////////////////////
// Vec4i Class Float32Array Version of Vec4 TODO: Test
///////////////////////////////////////////////////////////////////////////

function Vec4f (d0, d1, d2, d3) {
	Vec4Base.call(this, Float32Array, Vec4f, Vec2f, Vec3f );
	this.type = CINDER.TYPES.VEC4F;

	if( arguments.length === 0 ) {
		this.setToNull();
	}
	else if( arguments.length === 1 ) {
		if( d0.type !== undefined ) {
			switch (d0.type) {
				case CINDER.TYPES.VEC4F: {
					this.setFromVec4(d0);
				}
				break;
				case CINDER.TYPES.VEC4I: {
					this.setFromVec4(d0);
				}
			}
		}
	}
	else if( arguments.length === 4 ) {
		this.setFromElements(d0, d1, d2, d3);
	}
	return this;
};

Vec4f.prototype = Object.create( Vec4Base.prototype );
Vec4f.prototype.constructor = Vec4f;
Vec4f.zero = function () { return new Vec4f( 0, 0, 0, 0 ); };
Vec4f.one = function () { return new Vec4f( 1, 1, 1, 1 ); }
Vec4f.xAxis = function () { return new Vec4f( 1, 0, 0, 0 ); };
Vec4f.yAxis = function () { return new Vec4f( 0, 1, 0, 0 ); };
Vec4f.zAxis = function () { return new Vec4f( 0, 0, 1, 0 ); };
Vec4f.wAxis = function () { return new Vec4f( 0, 0, 0, 1 ); };

///////////////////////////////////////////////////////////////////////////
// Vec4Base Class Implementing all Array and Constructor Independent Functions TODO: Test
///////////////////////////////////////////////////////////////////////////

function Vec4Base (arrayType, constructorType, swizzleConstructor2, swizzleConstructor3) {
	this.ARRAY_TYPE = arrayType;
	this.CONSTUCTOR_TYPE = constructorType;
	this.SWIZZLE_CONSTRUCTOR2 = swizzleConstructor2;
	this.SWIZZLE_CONSTRUCTOR3 = swizzleConstructor3;
};

Vec4Base.prototype.constructor = Vec4Base;
Vec4Base.prototype.setFromVec4 = function(vec4) { this.components = new this.ARRAY_TYPE(vec4.components); };
Vec4Base.prototype.setFromElements = function (x, y, z, w) { this.components = new this.ARRAY_TYPE([x, y, z, w]); };
Vec4Base.prototype.setToNull = function () { this.components = new this.ARRAY_TYPE(4); };
Vec4Base.prototype.copy = function (rhVec4) { this.components.set(rhVec4.components); };
Vec4Base.prototype.clone = function () { return new this.CONSTUCTOR_TYPE( this.components[0], this.components[1], this.components[2], this.components[3] ); },
Vec4Base.prototype.getComponents = function () { return this.components; },
Vec4Base.prototype.setX = function(x) { this.components[0] = x; },
Vec4Base.prototype.getX = function () { return this.components[0]; },
Vec4Base.prototype.setY = function(y) { this.components[1] = y; },
Vec4Base.prototype.getY = function () {	return this.components[1]; },
Vec4Base.prototype.setZ = function(z) { this.components[2] = z; },
Vec4Base.prototype.getZ = function () {	return this.components[2]; },
Vec4Base.prototype.setW = function(w) { this.components[3] = w; },
Vec4Base.prototype.getW = function () {	return this.components[3]; },
Vec4Base.prototype.x = function (x) { 
	if( x !== undefined ) { 
		return this.components[0] = x; 
	} 
	else { 
		return this.components[0]; 
	} 
};
Vec4Base.prototype.y = function (y) { 
	if( y !== undefined ) { 
		return this.components[1] = y; 
	} 
	else { 
		return this.components[1]; 
	} 
};
Vec4Base.prototype.z = function (z) { 
	if( z !== undefined ) { 
		return this.components[2] = z; 
	} 
	else { 
		return this.components[2]; 
	} 
};
Vec4Base.prototype.w = function (w) { 
	if( w !== undefined ) { 
		return this.components[3] = w; 
	} 
	else { 
		return this.components[3]; 
	} 
};
Vec4Base.prototype.addEq = function(rhVec4) {
	this.components[0] += rhVec4.components[0];
	this.components[1] += rhVec4.components[1];
	this.components[2] += rhVec4.components[2];
	this.components[3] += rhVec4.components[3];
};
Vec4Base.prototype.add = function (rhVec4) {
	return new this.CONSTUCTOR_TYPE( 
		this.components[0] + rhVec4.components[0], 
		this.components[1] + rhVec4.components[1],
		this.components[2] + rhVec4.components[2],
		this.components[3] + rhVec4.components[3] 
	);
};
Vec4Base.prototype.subEq = function(rhVec4) {
	this.components[0] -= rhVec4.components[0];
	this.components[1] -= rhVec4.components[1];
	this.components[2] -= rhVec4.components[2];
	this.components[3] -= rhVec4.components[3];
};
Vec4Base.prototype.sub = function (rhVec4) {
	return new this.CONSTUCTOR_TYPE( 
		this.components[0] - rhVec4.components[0], 
		this.components[1] - rhVec4.components[1],
		this.components[2] - rhVec4.components[2],
		this.components[3] - rhVec4.components[3] 
	);
};
Vec4Base.prototype.multEq = function (rhVec4) {
	this.components[0] *= rhVec4.components[0];
	this.components[1] *= rhVec4.components[1];
	this.components[2] *= rhVec4.components[2];
	this.components[3] *= rhVec4.components[3];
};
Vec4Base.prototype.mult = function (rhVec4) {
	return new this.CONSTUCTOR_TYPE( 
		this.components[0] * rhVec4.components[0], 
		this.components[1] * rhVec4.components[1],
		this.components[2] * rhVec4.components[2],
		this.components[3] * rhVec4.components[3] 
	);
};
Vec4Base.prototype.multScalarEq = function (rhScalar) {
	this.components[0] *= rhScalar;
	this.components[1] *= rhScalar;
	this.components[2] *= rhScalar;
	this.components[3] *= rhScalar;
};
Vec4Base.prototype.multScalar = function (rhScalar) {
	return new this.CONSTUCTOR_TYPE(
		this.components[0] * rhScalar,
		this.components[1] * rhScalar,
		this.components[2] * rhScalar,
		this.components[3] * rhScalar
	);
};
Vec4Base.prototype.divEq = function (rhVec4) {
	this.components[0] /= rhVec4.components[0];
	this.components[1] /= rhVec4.components[1];
	this.components[2] /= rhVec4.components[2];
	this.components[3] /= rhVec4.components[3];
};
Vec4Base.prototype.div = function (rhVec4) {
	return new this.CONSTUCTOR_TYPE(
		this.components[0] / rhVec4.components[0],
		this.components[1] / rhVec4.components[1],
		this.components[2] / rhVec4.components[2],
		this.components[3] / rhVec4.components[3]
	);
};
Vec4Base.prototype.divScalar = function (rhScalar) {
	return new this.CONSTUCTOR_TYPE(
		this.components[0] / rhScalar,
		this.components[1] / rhScalar,
		this.components[2] / rhScalar,
		this.components[3] / rhScalar
	);
};
Vec4Base.prototype.divScalarEq = function (rhScalar) {
	this.components[0] /= rhScalar;
	this.components[1] /= rhScalar;
	this.components[2] /= rhScalar;
	this.components[3] /= rhScalar
};
Vec4Base.prototype.lerpEq = function (fact, rhVec4) {
	this.components[0] = this.components[0] + ( rhVec4.components[0] - this.components[0] ) * fact;
	this.components[1] = this.components[1] + ( rhVec4.components[1] - this.components[1] ) * fact;
	this.components[2] = this.components[2] + ( rhVec4.components[2] - this.components[2] ) * fact;
	this.components[3] = this.components[3] + ( rhVec4.components[3] - this.components[3] ) * fact;
};
Vec4Base.prototype.lerp = function (fact, rhVec4) {
	return new this.CONSTUCTOR_TYPE(
		( this.components[0] + ( rhVec4.components[0] - this.components[0] ) * fact ), 
		( this.components[1] + ( rhVec4.components[1] - this.components[1] ) * fact ),
		( this.components[2] + ( rhVec4.components[2] - this.components[2] ) * fact ),
		( this.components[3] + ( rhVec4.components[3] - this.components[3] ) * fact )
	);
};	
Vec4Base.prototype.dot = function (rhVec4) {
	return this.components[0] * rhVec4.components[0] + 
		   this.components[1] * rhVec4.components[1] +
		   this.components[2] * rhVec4.components[2] +
		   this.components[3] * rhVec4.components[3];
};
Vec4Base.prototype.cross = function (rhVec4) { 
	return new this.CONSTUCTOR_TYPE( 
		this.components[1] * rhVec4.components[2] - rhVec4.components[1] * this.components[2],
		this.components[2] * rhVec4.components[0] - rhVec4.components[2] * this.components[0],
		this.components[0] * rhVec4.components[1] - rhVec4.components[0] * this.components[1]
	); 
};
Vec4Base.prototype.distance = function (rhVec4) { return this.sub(rhVec4).length(); },
Vec4Base.prototype.distanceSquared = function (rhVec4) { return this.sub(rhVec4).lengthSquared(); },
Vec4Base.prototype.length = function () {
	return Math.sqrt( 
		this.components[0] * this.components[0] + 
		this.components[1] * this.components[1] +
		this.components[2] * this.components[2] +
		this.components[3] * this.components[3]
	);
};
Vec4Base.prototype.lengthSquared = function () {
	return this.components[0] * this.components[0] + 
		   this.components[1] * this.components[1] +
		   this.components[2] * this.components[2] +
		   this.components[3] * this.components[3];
};
Vec4Base.prototype.limit = function (maxLength) {
	var lenSquared = this.lengthSquared();
	if( ( lenSquared > maxLength * maxLength ) && ( lenSquared > 0 ) ) {
		var ratio = maxLength / Math.sqrt( lenSquared );
		this.components[0] *= ratio;
		this.components[1] *= ratio;
		this.components[2] *= ratio;
		this.components[3] *= ratio;
	}
};
Vec4Base.prototype.limited = function (maxLength) {
	var lenSquared = this.lengthSquared();
	if( ( lenSquared > maxLength * maxLength ) && ( lenSquared > 0 ) ) {
		var ratio = maxLength / Math.sqrt( lenSquared );
		return new this.CONSTUCTOR_TYPE( 
			this.components[0] * ratio, 
			this.components[1] * ratio,
			this.components[2] * ratio,
			this.components[3] * ratio 
		);
	}
	else {
		return new this.CONSTUCTOR_TYPE( 
			this.components[0], 
			this.components[1],
			this.components[2],
			this.components[3] 
		);
	}
};
Vec4Base.prototype.invert = function () {
	this.components[0] = -this.components[0];
	this.components[1] = -this.components[1];
	this.components[2] = -this.components[2];
	this.components[3] = -this.components[3];
};
Vec4Base.prototype.inverse = function () { 
	return new this.CONSTUCTOR_TYPE( 
		-this.components[0], 
		-this.components[1],
		-this.components[2],
		-this.components[3]
	); 
};
Vec4Base.prototype.normalize = function () {
	var invS = 1 / this.length();
	this.components[0] *= invS;
	this.components[1] *= invS;
	this.components[2] *= invS;
	this.components[3] *= invS;
};
Vec4Base.prototype.normalized = function () {
	var invS = 1 / this.length();
	return new this.CONSTUCTOR_TYPE( 
		this.components[0] * invS, 
		this.components[1] * invS,
		this.components[2] * invS,
		this.components[3] * invS 
	);
};
Vec4Base.prototype.slerp = function (fact, rVec4) {
	var cosAlpha, alpha, sinAlpha;
	var t1, t2;

	cosAlpha = this.dot( rVec4 );

	alpha = Math.acos( cosAlpha );

	sinAlpha = Math.sin( alpha );

	t1 = Math.sin( ( 1 - fact ) * alpha ) / sinAlpha;
	t2 = Math.sin( fact * alpha ) / sinAlpha;

	var newThis = this.clone();
	var newRVec4 = rVec4.clone();
	newThis.multScalar(t1);
	newRVec4.multScalar(t2);

	return newThis.add(newRVec4);
};
Vec4Base.prototype.squad = function (t, tangentAVec4, tangentBVec4, endVec4) {
	var r1 = this.slerp( t, end );
	var r2 = tangentAVec4.slerp( t, tangentBVec4 );
	return r1.slerp( 2 * t * (1-t), r2 );
};

Vec4Base.prototype.xx = function () { return new this.SWIZZLE_CONSTRUCTOR2(this.components[0], this.components[0]); };
Vec4Base.prototype.xy = function () { return new this.SWIZZLE_CONSTRUCTOR2(this.components[0], this.components[1]); };
Vec4Base.prototype.xz = function () { return new this.SWIZZLE_CONSTRUCTOR2(this.components[0], this.components[2]); };
Vec4Base.prototype.yx = function () { return new this.SWIZZLE_CONSTRUCTOR2(this.components[1], this.components[0]); };
Vec4Base.prototype.yy = function () { return new this.SWIZZLE_CONSTRUCTOR2(this.components[1], this.components[1]); };
Vec4Base.prototype.yz = function () { return new this.SWIZZLE_CONSTRUCTOR2(this.components[1], this.components[2]); };
Vec4Base.prototype.zx = function () { return new this.SWIZZLE_CONSTRUCTOR2(this.components[2], this.components[0]); };
Vec4Base.prototype.zy = function () { return new this.SWIZZLE_CONSTRUCTOR2(this.components[2], this.components[1]); };
Vec4Base.prototype.zz = function () { return new this.SWIZZLE_CONSTRUCTOR2(this.components[2], this.components[2]); };

Vec4Base.prototype.xxx = function () { return new this.SWIZZLE_CONSTRUCTOR3(this.components[0], this.components[0], this.components[0]); };
Vec4Base.prototype.xxy = function () { return new this.SWIZZLE_CONSTRUCTOR3(this.components[0], this.components[0], this.components[1]); };
Vec4Base.prototype.xxz = function () { return new this.SWIZZLE_CONSTRUCTOR3(this.components[0], this.components[0], this.components[2]); };
Vec4Base.prototype.xyx = function () { return new this.SWIZZLE_CONSTRUCTOR3(this.components[0], this.components[1], this.components[0]); };
Vec4Base.prototype.xyy = function () { return new this.SWIZZLE_CONSTRUCTOR3(this.components[0], this.components[1], this.components[1]); };
Vec4Base.prototype.xyz = function () { return new this.SWIZZLE_CONSTRUCTOR3(this.components[0], this.components[1], this.components[2]); };
Vec4Base.prototype.xzx = function () { return new this.SWIZZLE_CONSTRUCTOR3(this.components[0], this.components[2], this.components[0]); };
Vec4Base.prototype.xzy = function () { return new this.SWIZZLE_CONSTRUCTOR3(this.components[0], this.components[2], this.components[1]); };
Vec4Base.prototype.xzz = function () { return new this.SWIZZLE_CONSTRUCTOR3(this.components[0], this.components[2], this.components[2]); };
Vec4Base.prototype.yxx = function () { return new this.SWIZZLE_CONSTRUCTOR3(this.components[1], this.components[0], this.components[0]); };
Vec4Base.prototype.yxy = function () { return new this.SWIZZLE_CONSTRUCTOR3(this.components[1], this.components[0], this.components[1]); };
Vec4Base.prototype.yxz = function () { return new this.SWIZZLE_CONSTRUCTOR3(this.components[1], this.components[0], this.components[2]); };
Vec4Base.prototype.yyx = function () { return new this.SWIZZLE_CONSTRUCTOR3(this.components[1], this.components[1], this.components[0]); };
Vec4Base.prototype.yyy = function () { return new this.SWIZZLE_CONSTRUCTOR3(this.components[1], this.components[1], this.components[1]); };
Vec4Base.prototype.yyz = function () { return new this.SWIZZLE_CONSTRUCTOR3(this.components[1], this.components[1], this.components[2]); };
Vec4Base.prototype.yzx = function () { return new this.SWIZZLE_CONSTRUCTOR3(this.components[1], this.components[2], this.components[0]); };
Vec4Base.prototype.yzy = function () { return new this.SWIZZLE_CONSTRUCTOR3(this.components[1], this.components[2], this.components[1]); };
Vec4Base.prototype.yzz = function () { return new this.SWIZZLE_CONSTRUCTOR3(this.components[1], this.components[2], this.components[2]); };
Vec4Base.prototype.zxx = function () { return new this.SWIZZLE_CONSTRUCTOR3(this.components[2], this.components[0], this.components[0]); };
Vec4Base.prototype.zxy = function () { return new this.SWIZZLE_CONSTRUCTOR3(this.components[2], this.components[0], this.components[1]); };
Vec4Base.prototype.zxz = function () { return new this.SWIZZLE_CONSTRUCTOR3(this.components[2], this.components[0], this.components[2]); };
Vec4Base.prototype.zyx = function () { return new this.SWIZZLE_CONSTRUCTOR3(this.components[2], this.components[1], this.components[0]); };
Vec4Base.prototype.zyy = function () { return new this.SWIZZLE_CONSTRUCTOR3(this.components[2], this.components[1], this.components[1]); };
Vec4Base.prototype.zyz = function () { return new this.SWIZZLE_CONSTRUCTOR3(this.components[2], this.components[1], this.components[2]); };
Vec4Base.prototype.zzx = function () { return new this.SWIZZLE_CONSTRUCTOR3(this.components[2], this.components[2], this.components[0]); };
Vec4Base.prototype.zzy = function () { return new this.SWIZZLE_CONSTRUCTOR3(this.components[2], this.components[2], this.components[1]); };
Vec4Base.prototype.zzz = function () { return new this.SWIZZLE_CONSTRUCTOR3(this.components[2], this.components[2], this.components[2]); };

Vec4Base.prototype.xxxx = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[0], this.components[0], this.components[0]); };
Vec4Base.prototype.xxxy = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[0], this.components[0], this.components[1]); };
Vec4Base.prototype.xxxz = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[0], this.components[0], this.components[2]); };
Vec4Base.prototype.xxxw = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[0], this.components[0], this.components[3]); };
Vec4Base.prototype.xxyx = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[0], this.components[1], this.components[0]); };
Vec4Base.prototype.xxyy = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[0], this.components[1], this.components[1]); };
Vec4Base.prototype.xxyz = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[0], this.components[1], this.components[2]); };
Vec4Base.prototype.xxyw = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[0], this.components[1], this.components[3]); };
Vec4Base.prototype.xxzx = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[0], this.components[2], this.components[0]); };
Vec4Base.prototype.xxzy = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[0], this.components[2], this.components[1]); };
Vec4Base.prototype.xxzz = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[0], this.components[2], this.components[2]); };
Vec4Base.prototype.xxzw = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[0], this.components[2], this.components[3]); };
Vec4Base.prototype.xxwx = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[0], this.components[3], this.components[0]); };
Vec4Base.prototype.xxwy = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[0], this.components[3], this.components[1]); };
Vec4Base.prototype.xxwz = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[0], this.components[3], this.components[2]); };
Vec4Base.prototype.xxww = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[0], this.components[3], this.components[3]); };
Vec4Base.prototype.xyxx = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[1], this.components[0], this.components[0]); };
Vec4Base.prototype.xyxy = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[1], this.components[0], this.components[1]); };
Vec4Base.prototype.xyxz = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[1], this.components[0], this.components[2]); };
Vec4Base.prototype.xyxw = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[1], this.components[0], this.components[3]); };
Vec4Base.prototype.xyyx = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[1], this.components[1], this.components[0]); };
Vec4Base.prototype.xyyy = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[1], this.components[1], this.components[1]); };
Vec4Base.prototype.xyyz = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[1], this.components[1], this.components[2]); };
Vec4Base.prototype.xyyw = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[1], this.components[1], this.components[3]); };
Vec4Base.prototype.xyzx = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[1], this.components[2], this.components[0]); };
Vec4Base.prototype.xyzy = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[1], this.components[2], this.components[1]); };
Vec4Base.prototype.xyzz = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[1], this.components[2], this.components[2]); };
Vec4Base.prototype.xyzw = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[1], this.components[2], this.components[3]); };
Vec4Base.prototype.xywx = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[1], this.components[3], this.components[0]); };
Vec4Base.prototype.xywy = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[1], this.components[3], this.components[1]); };
Vec4Base.prototype.xywz = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[1], this.components[3], this.components[2]); };
Vec4Base.prototype.xyww = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[1], this.components[3], this.components[3]); };
Vec4Base.prototype.xzxx = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[2], this.components[0], this.components[0]); };
Vec4Base.prototype.xzxy = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[2], this.components[0], this.components[1]); };
Vec4Base.prototype.xzxz = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[2], this.components[0], this.components[2]); };
Vec4Base.prototype.xzxw = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[2], this.components[0], this.components[3]); };
Vec4Base.prototype.xzyx = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[2], this.components[1], this.components[0]); };
Vec4Base.prototype.xzyy = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[2], this.components[1], this.components[1]); };
Vec4Base.prototype.xzyz = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[2], this.components[1], this.components[2]); };
Vec4Base.prototype.xzyw = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[2], this.components[1], this.components[3]); };
Vec4Base.prototype.xzzx = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[2], this.components[2], this.components[0]); };
Vec4Base.prototype.xzzy = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[2], this.components[2], this.components[1]); };
Vec4Base.prototype.xzzz = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[2], this.components[2], this.components[2]); };
Vec4Base.prototype.xzzw = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[2], this.components[2], this.components[3]); };
Vec4Base.prototype.xzwx = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[2], this.components[3], this.components[0]); };
Vec4Base.prototype.xzwy = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[2], this.components[3], this.components[1]); };
Vec4Base.prototype.xzwz = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[2], this.components[3], this.components[2]); };
Vec4Base.prototype.xzww = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[2], this.components[3], this.components[3]); };
Vec4Base.prototype.xwxx = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[3], this.components[0], this.components[0]); };
Vec4Base.prototype.xwxy = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[3], this.components[0], this.components[1]); };
Vec4Base.prototype.xwxz = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[3], this.components[0], this.components[2]); };
Vec4Base.prototype.xwxw = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[3], this.components[0], this.components[3]); };
Vec4Base.prototype.xwyx = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[3], this.components[1], this.components[0]); };
Vec4Base.prototype.xwyy = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[3], this.components[1], this.components[1]); };
Vec4Base.prototype.xwyz = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[3], this.components[1], this.components[2]); };
Vec4Base.prototype.xwyw = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[3], this.components[1], this.components[3]); };
Vec4Base.prototype.xwzx = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[3], this.components[2], this.components[0]); };
Vec4Base.prototype.xwzy = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[3], this.components[2], this.components[1]); };
Vec4Base.prototype.xwzz = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[3], this.components[2], this.components[2]); };
Vec4Base.prototype.xwzw = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[3], this.components[2], this.components[3]); };
Vec4Base.prototype.xwwx = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[3], this.components[3], this.components[0]); };
Vec4Base.prototype.xwwy = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[3], this.components[3], this.components[1]); };
Vec4Base.prototype.xwwz = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[3], this.components[3], this.components[2]); };
Vec4Base.prototype.xwww = function (){ return new this.CONSTUCTOR_TYPE(this.components[0], this.components[3], this.components[3], this.components[3]); };
Vec4Base.prototype.yxxx = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[0], this.components[0], this.components[0]); };
Vec4Base.prototype.yxxy = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[0], this.components[0], this.components[1]); };
Vec4Base.prototype.yxxz = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[0], this.components[0], this.components[2]); };
Vec4Base.prototype.yxxw = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[0], this.components[0], this.components[3]); };
Vec4Base.prototype.yxyx = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[0], this.components[1], this.components[0]); };
Vec4Base.prototype.yxyy = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[0], this.components[1], this.components[1]); };
Vec4Base.prototype.yxyz = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[0], this.components[1], this.components[2]); };
Vec4Base.prototype.yxyw = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[0], this.components[1], this.components[3]); };
Vec4Base.prototype.yxzx = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[0], this.components[2], this.components[0]); };
Vec4Base.prototype.yxzy = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[0], this.components[2], this.components[1]); };
Vec4Base.prototype.yxzz = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[0], this.components[2], this.components[2]); };
Vec4Base.prototype.yxzw = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[0], this.components[2], this.components[3]); };
Vec4Base.prototype.yxwx = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[0], this.components[3], this.components[0]); };
Vec4Base.prototype.yxwy = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[0], this.components[3], this.components[1]); };
Vec4Base.prototype.yxwz = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[0], this.components[3], this.components[2]); };
Vec4Base.prototype.yxww = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[0], this.components[3], this.components[3]); };
Vec4Base.prototype.yyxx = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[1], this.components[0], this.components[0]); };
Vec4Base.prototype.yyxy = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[1], this.components[0], this.components[1]); };
Vec4Base.prototype.yyxz = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[1], this.components[0], this.components[2]); };
Vec4Base.prototype.yyxw = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[1], this.components[0], this.components[3]); };
Vec4Base.prototype.yyyx = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[1], this.components[1], this.components[0]); };
Vec4Base.prototype.yyyy = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[1], this.components[1], this.components[1]); };
Vec4Base.prototype.yyyz = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[1], this.components[1], this.components[2]); };
Vec4Base.prototype.yyyw = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[1], this.components[1], this.components[3]); };
Vec4Base.prototype.yyzx = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[1], this.components[2], this.components[0]); };
Vec4Base.prototype.yyzy = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[1], this.components[2], this.components[1]); };
Vec4Base.prototype.yyzz = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[1], this.components[2], this.components[2]); };
Vec4Base.prototype.yyzw = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[1], this.components[2], this.components[3]); };
Vec4Base.prototype.yywx = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[1], this.components[3], this.components[0]); };
Vec4Base.prototype.yywy = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[1], this.components[3], this.components[1]); };
Vec4Base.prototype.yywz = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[1], this.components[3], this.components[2]); };
Vec4Base.prototype.yyww = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[1], this.components[3], this.components[3]); };
Vec4Base.prototype.yzxx = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[2], this.components[0], this.components[0]); };
Vec4Base.prototype.yzxy = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[2], this.components[0], this.components[1]); };
Vec4Base.prototype.yzxz = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[2], this.components[0], this.components[2]); };
Vec4Base.prototype.yzxw = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[2], this.components[0], this.components[3]); };
Vec4Base.prototype.yzyx = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[2], this.components[1], this.components[0]); };
Vec4Base.prototype.yzyy = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[2], this.components[1], this.components[1]); };
Vec4Base.prototype.yzyz = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[2], this.components[1], this.components[2]); };
Vec4Base.prototype.yzyw = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[2], this.components[1], this.components[3]); };
Vec4Base.prototype.yzzx = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[2], this.components[2], this.components[0]); };
Vec4Base.prototype.yzzy = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[2], this.components[2], this.components[1]); };
Vec4Base.prototype.yzzz = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[2], this.components[2], this.components[2]); };
Vec4Base.prototype.yzzw = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[2], this.components[2], this.components[3]); };
Vec4Base.prototype.yzwx = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[2], this.components[3], this.components[0]); };
Vec4Base.prototype.yzwy = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[2], this.components[3], this.components[1]); };
Vec4Base.prototype.yzwz = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[2], this.components[3], this.components[2]); };
Vec4Base.prototype.yzww = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[2], this.components[3], this.components[3]); };
Vec4Base.prototype.ywxx = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[3], this.components[0], this.components[0]); };
Vec4Base.prototype.ywxy = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[3], this.components[0], this.components[1]); };
Vec4Base.prototype.ywxz = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[3], this.components[0], this.components[2]); };
Vec4Base.prototype.ywxw = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[3], this.components[0], this.components[3]); };
Vec4Base.prototype.ywyx = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[3], this.components[1], this.components[0]); };
Vec4Base.prototype.ywyy = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[3], this.components[1], this.components[1]); };
Vec4Base.prototype.ywyz = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[3], this.components[1], this.components[2]); };
Vec4Base.prototype.ywyw = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[3], this.components[1], this.components[3]); };
Vec4Base.prototype.ywzx = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[3], this.components[2], this.components[0]); };
Vec4Base.prototype.ywzy = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[3], this.components[2], this.components[1]); };
Vec4Base.prototype.ywzz = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[3], this.components[2], this.components[2]); };
Vec4Base.prototype.ywzw = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[3], this.components[2], this.components[3]); };
Vec4Base.prototype.ywwx = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[3], this.components[3], this.components[0]); };
Vec4Base.prototype.ywwy = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[3], this.components[3], this.components[1]); };
Vec4Base.prototype.ywwz = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[3], this.components[3], this.components[2]); };
Vec4Base.prototype.ywww = function (){ return new this.CONSTUCTOR_TYPE(this.components[1], this.components[3], this.components[3], this.components[3]); };
Vec4Base.prototype.zxxx = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[0], this.components[0], this.components[0]); };
Vec4Base.prototype.zxxy = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[0], this.components[0], this.components[1]); };
Vec4Base.prototype.zxxz = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[0], this.components[0], this.components[2]); };
Vec4Base.prototype.zxxw = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[0], this.components[0], this.components[3]); };
Vec4Base.prototype.zxyx = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[0], this.components[1], this.components[0]); };
Vec4Base.prototype.zxyy = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[0], this.components[1], this.components[1]); };
Vec4Base.prototype.zxyz = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[0], this.components[1], this.components[2]); };
Vec4Base.prototype.zxyw = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[0], this.components[1], this.components[3]); };
Vec4Base.prototype.zxzx = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[0], this.components[2], this.components[0]); };
Vec4Base.prototype.zxzy = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[0], this.components[2], this.components[1]); };
Vec4Base.prototype.zxzz = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[0], this.components[2], this.components[2]); };
Vec4Base.prototype.zxzw = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[0], this.components[2], this.components[3]); };
Vec4Base.prototype.zxwx = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[0], this.components[3], this.components[0]); };
Vec4Base.prototype.zxwy = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[0], this.components[3], this.components[1]); };
Vec4Base.prototype.zxwz = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[0], this.components[3], this.components[2]); };
Vec4Base.prototype.zxww = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[0], this.components[3], this.components[3]); };
Vec4Base.prototype.zyxx = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[1], this.components[0], this.components[0]); };
Vec4Base.prototype.zyxy = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[1], this.components[0], this.components[1]); };
Vec4Base.prototype.zyxz = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[1], this.components[0], this.components[2]); };
Vec4Base.prototype.zyxw = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[1], this.components[0], this.components[3]); };
Vec4Base.prototype.zyyx = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[1], this.components[1], this.components[0]); };
Vec4Base.prototype.zyyy = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[1], this.components[1], this.components[1]); };
Vec4Base.prototype.zyyz = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[1], this.components[1], this.components[2]); };
Vec4Base.prototype.zyyw = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[1], this.components[1], this.components[3]); };
Vec4Base.prototype.zyzx = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[1], this.components[2], this.components[0]); };
Vec4Base.prototype.zyzy = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[1], this.components[2], this.components[1]); };
Vec4Base.prototype.zyzz = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[1], this.components[2], this.components[2]); };
Vec4Base.prototype.zyzw = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[1], this.components[2], this.components[3]); };
Vec4Base.prototype.zywx = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[1], this.components[3], this.components[0]); };
Vec4Base.prototype.zywy = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[1], this.components[3], this.components[1]); };
Vec4Base.prototype.zywz = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[1], this.components[3], this.components[2]); };
Vec4Base.prototype.zyww = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[1], this.components[3], this.components[3]); };
Vec4Base.prototype.zzxx = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[2], this.components[0], this.components[0]); };
Vec4Base.prototype.zzxy = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[2], this.components[0], this.components[1]); };
Vec4Base.prototype.zzxz = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[2], this.components[0], this.components[2]); };
Vec4Base.prototype.zzxw = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[2], this.components[0], this.components[3]); };
Vec4Base.prototype.zzyx = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[2], this.components[1], this.components[0]); };
Vec4Base.prototype.zzyy = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[2], this.components[1], this.components[1]); };
Vec4Base.prototype.zzyz = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[2], this.components[1], this.components[2]); };
Vec4Base.prototype.zzyw = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[2], this.components[1], this.components[3]); };
Vec4Base.prototype.zzzx = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[2], this.components[2], this.components[0]); };
Vec4Base.prototype.zzzy = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[2], this.components[2], this.components[1]); };
Vec4Base.prototype.zzzz = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[2], this.components[2], this.components[2]); };
Vec4Base.prototype.zzzw = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[2], this.components[2], this.components[3]); };
Vec4Base.prototype.zzwx = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[2], this.components[3], this.components[0]); };
Vec4Base.prototype.zzwy = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[2], this.components[3], this.components[1]); };
Vec4Base.prototype.zzwz = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[2], this.components[3], this.components[2]); };
Vec4Base.prototype.zzww = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[2], this.components[3], this.components[3]); };
Vec4Base.prototype.zwxx = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[3], this.components[0], this.components[0]); };
Vec4Base.prototype.zwxy = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[3], this.components[0], this.components[1]); };
Vec4Base.prototype.zwxz = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[3], this.components[0], this.components[2]); };
Vec4Base.prototype.zwxw = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[3], this.components[0], this.components[3]); };
Vec4Base.prototype.zwyx = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[3], this.components[1], this.components[0]); };
Vec4Base.prototype.zwyy = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[3], this.components[1], this.components[1]); };
Vec4Base.prototype.zwyz = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[3], this.components[1], this.components[2]); };
Vec4Base.prototype.zwyw = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[3], this.components[1], this.components[3]); };
Vec4Base.prototype.zwzx = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[3], this.components[2], this.components[0]); };
Vec4Base.prototype.zwzy = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[3], this.components[2], this.components[1]); };
Vec4Base.prototype.zwzz = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[3], this.components[2], this.components[2]); };
Vec4Base.prototype.zwzw = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[3], this.components[2], this.components[3]); };
Vec4Base.prototype.zwwx = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[3], this.components[3], this.components[0]); };
Vec4Base.prototype.zwwy = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[3], this.components[3], this.components[1]); };
Vec4Base.prototype.zwwz = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[3], this.components[3], this.components[2]); };
Vec4Base.prototype.zwww = function (){ return new this.CONSTUCTOR_TYPE(this.components[2], this.components[3], this.components[3], this.components[3]); };
Vec4Base.prototype.wxxx = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[0], this.components[0], this.components[0]); };
Vec4Base.prototype.wxxy = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[0], this.components[0], this.components[1]); };
Vec4Base.prototype.wxxz = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[0], this.components[0], this.components[2]); };
Vec4Base.prototype.wxxw = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[0], this.components[0], this.components[3]); };
Vec4Base.prototype.wxyx = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[0], this.components[1], this.components[0]); };
Vec4Base.prototype.wxyy = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[0], this.components[1], this.components[1]); };
Vec4Base.prototype.wxyz = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[0], this.components[1], this.components[2]); };
Vec4Base.prototype.wxyw = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[0], this.components[1], this.components[3]); };
Vec4Base.prototype.wxzx = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[0], this.components[2], this.components[0]); };
Vec4Base.prototype.wxzy = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[0], this.components[2], this.components[1]); };
Vec4Base.prototype.wxzz = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[0], this.components[2], this.components[2]); };
Vec4Base.prototype.wxzw = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[0], this.components[2], this.components[3]); };
Vec4Base.prototype.wxwx = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[0], this.components[3], this.components[0]); };
Vec4Base.prototype.wxwy = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[0], this.components[3], this.components[1]); };
Vec4Base.prototype.wxwz = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[0], this.components[3], this.components[2]); };
Vec4Base.prototype.wxww = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[0], this.components[3], this.components[3]); };
Vec4Base.prototype.wyxx = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[1], this.components[0], this.components[0]); };
Vec4Base.prototype.wyxy = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[1], this.components[0], this.components[1]); };
Vec4Base.prototype.wyxz = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[1], this.components[0], this.components[2]); };
Vec4Base.prototype.wyxw = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[1], this.components[0], this.components[3]); };
Vec4Base.prototype.wyyx = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[1], this.components[1], this.components[0]); };
Vec4Base.prototype.wyyy = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[1], this.components[1], this.components[1]); };
Vec4Base.prototype.wyyz = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[1], this.components[1], this.components[2]); };
Vec4Base.prototype.wyyw = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[1], this.components[1], this.components[3]); };
Vec4Base.prototype.wyzx = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[1], this.components[2], this.components[0]); };
Vec4Base.prototype.wyzy = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[1], this.components[2], this.components[1]); };
Vec4Base.prototype.wyzz = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[1], this.components[2], this.components[2]); };
Vec4Base.prototype.wyzw = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[1], this.components[2], this.components[3]); };
Vec4Base.prototype.wywx = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[1], this.components[3], this.components[0]); };
Vec4Base.prototype.wywy = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[1], this.components[3], this.components[1]); };
Vec4Base.prototype.wywz = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[1], this.components[3], this.components[2]); };
Vec4Base.prototype.wyww = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[1], this.components[3], this.components[3]); };
Vec4Base.prototype.wzxx = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[2], this.components[0], this.components[0]); };
Vec4Base.prototype.wzxy = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[2], this.components[0], this.components[1]); };
Vec4Base.prototype.wzxz = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[2], this.components[0], this.components[2]); };
Vec4Base.prototype.wzxw = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[2], this.components[0], this.components[3]); };
Vec4Base.prototype.wzyx = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[2], this.components[1], this.components[0]); };
Vec4Base.prototype.wzyy = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[2], this.components[1], this.components[1]); };
Vec4Base.prototype.wzyz = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[2], this.components[1], this.components[2]); };
Vec4Base.prototype.wzyw = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[2], this.components[1], this.components[3]); };
Vec4Base.prototype.wzzx = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[2], this.components[2], this.components[0]); };
Vec4Base.prototype.wzzy = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[2], this.components[2], this.components[1]); };
Vec4Base.prototype.wzzz = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[2], this.components[2], this.components[2]); };
Vec4Base.prototype.wzzw = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[2], this.components[2], this.components[3]); };
Vec4Base.prototype.wzwx = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[2], this.components[3], this.components[0]); };
Vec4Base.prototype.wzwy = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[2], this.components[3], this.components[1]); };
Vec4Base.prototype.wzwz = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[2], this.components[3], this.components[2]); };
Vec4Base.prototype.wzww = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[2], this.components[3], this.components[3]); };
Vec4Base.prototype.wwxx = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[3], this.components[0], this.components[0]); };
Vec4Base.prototype.wwxy = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[3], this.components[0], this.components[1]); };
Vec4Base.prototype.wwxz = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[3], this.components[0], this.components[2]); };
Vec4Base.prototype.wwxw = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[3], this.components[0], this.components[3]); };
Vec4Base.prototype.wwyx = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[3], this.components[1], this.components[0]); };
Vec4Base.prototype.wwyy = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[3], this.components[1], this.components[1]); };
Vec4Base.prototype.wwyz = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[3], this.components[1], this.components[2]); };
Vec4Base.prototype.wwyw = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[3], this.components[1], this.components[3]); };
Vec4Base.prototype.wwzx = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[3], this.components[2], this.components[0]); };
Vec4Base.prototype.wwzy = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[3], this.components[2], this.components[1]); };
Vec4Base.prototype.wwzz = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[3], this.components[2], this.components[2]); };
Vec4Base.prototype.wwzw = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[3], this.components[2], this.components[3]); };
Vec4Base.prototype.wwwx = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[3], this.components[3], this.components[0]); };
Vec4Base.prototype.wwwy = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[3], this.components[3], this.components[1]); };
Vec4Base.prototype.wwwz = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[3], this.components[3], this.components[2]); };
Vec4Base.prototype.wwww = function (){ return new this.CONSTUCTOR_TYPE(this.components[3], this.components[3], this.components[3], this.components[3]); };





