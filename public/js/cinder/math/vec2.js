///////////////////////////////////////////////////////////////////////////
// Vec2i Class Uint32Array Version of Vec2Base TODO: Test
///////////////////////////////////////////////////////////////////////////

function Vec2i (x, y) {
	Vec2Base.call(this, Int32Array, Vec2i, Vec3i);
	this.type = CINDER.TYPES.VEC2I;

	if( arguments.length === 0 ) {
		this.setToNull();
	}
	else if( arguments.length === 1 ) {
		this.setFromVec2(x);
	}
	else if( arguments.length === 2 ) {
		this.setFromElements(x, y);
	}
	return this;
};

Vec2i.prototype = Object.create( Vec2Base.prototype );
// Vec2i.prototype.constructor = Vec2i;
Vec2i.zero = function () { return new Vec2i( 0, 0 ); };
Vec2i.one = function () { return new Vec2i( 1, 1 ); };
Vec2i.xAxis = function () { return new Vec2i( 1, 0 ); };
Vec2i.yAxis = function () { return new Vec2i( 0, 1 ); };

///////////////////////////////////////////////////////////////////////////
// Vec2f Class Float32Array Version of Vec2Base TODO: Test
///////////////////////////////////////////////////////////////////////////

function Vec2f (x, y) {
	Vec2Base.call(this, Float32Array, Vec2f, Vec3f);
	this.type = CINDER.TYPES.VEC2F;

	if( arguments.length === 0 ) {
		this.setToNull();
	}
	else if( arguments.length === 1 ) {
		this.setFromVec2(x);
	}
	else if( arguments.length === 2 ) {
		this.setFromElements(x, y);
	}
	return this;
};

Vec2f.prototype = Object.create( Vec2Base.prototype );
// Vec2f.prototype.constructor = Vec2f;
Vec2f.zero = function () { return new Vec2f( 0, 0 ); };
Vec2f.one = function () { return new Vec2f( 1, 1 ); }
Vec2f.xAxis = function () { return new Vec2f( 1, 0 ); };
Vec2f.yAxis = function () { return new Vec2f( 0, 1 ); };

///////////////////////////////////////////////////////////////////////////
// Vec2Base Class Implementing all Array and Constructor Independent Functions TODO: Test
///////////////////////////////////////////////////////////////////////////

function Vec2Base (arrayType, constructorType, swizzleConstructor3) {
	this.ARRAY_TYPE = arrayType;
	this.CONSTUCTOR_TYPE = constructorType;
	this.SWIZZLE_CONSTRUCTOR3 = swizzleConstructor3;
};

Vec2Base.prototype.constructor = Vec2Base;
Vec2Base.prototype.setFromVec2 = function(vec2) { this.components = new this.ARRAY_TYPE(vec2.components); };
Vec2Base.prototype.setFromElements = function (x, y) { this.components = new this.ARRAY_TYPE([x, y]); };
Vec2Base.prototype.setToNull = function () { this.components = new this.ARRAY_TYPE(2); };
Vec2Base.prototype.copy = function (rhVec2) { this.components.set(rhVec2.components); };
Vec2Base.prototype.clone = function () { return new this.CONSTUCTOR_TYPE( this.components[0], this.components[1] ); };
Vec2Base.prototype.getComponents = function () { return this.components; };
Vec2Base.prototype.setX = function(x) { this.components[0] = x; };
Vec2Base.prototype.getX = function () { return this.components[0]; };
Vec2Base.prototype.setY = function(y) { this.components[1] = y; };
Vec2Base.prototype.getY = function () {	return this.components[1]; };
Vec2Base.prototype.x = function (x) { 
	if( x !== undefined ) { 
		return this.components[0] = x; 
	} 
	else { 
		return this.components[0]; 
	} 
};
Vec2Base.prototype.y = function (y) { 
	if( y !== undefined ) { 
		return this.components[1] = y; 
	} 
	else { 
		return this.components[1]; 
	} 
};
Vec2Base.prototype.addEq = function(rhVec2) {
	this.components[0] += rhVec2.components[0];
	this.components[1] += rhVec2.components[1];
};
Vec2Base.prototype.add = function (rhVec2) {
	return new this.CONSTUCTOR_TYPE( 
		this.components[0] + rhVec2.components[0], 
		this.components[1] + rhVec2.components[1] 
	);
};
Vec2Base.prototype.subEq = function(rhVec2) {
	this.components[0] -= rhVec2.components[0];
	this.components[1] -= rhVec2.components[1];
};
Vec2Base.prototype.sub = function (rhVec2) {
	return new this.CONSTUCTOR_TYPE( 
		this.components[0] - rhVec2.components[0], 
		this.components[1] - rhVec2.components[1] 
	);
};
Vec2Base.prototype.multEq = function (rhVec2) {
	this.components[0] *= rhVec2.components[0];
	this.components[1] *= rhVec2.components[1];
};
Vec2Base.prototype.mult = function (rhVec2) {
	return new this.CONSTUCTOR_TYPE( 
		this.components[0] * rhVec2.components[0], 
		this.components[1] * rhVec2.components[1] 
	);
};
Vec2Base.prototype.multScalarEq = function (rhScalar) {
	this.components[0] *= rhScalar;
	this.components[1] *= rhScalar;
};
Vec2Base.prototype.multScalar = function (rhScalar) {
	return new this.CONSTUCTOR_TYPE(
		this.components[0] * rhScalar,
		this.components[1] * rhScalar
	);
};
Vec2Base.prototype.divEq = function (rhVec2) {
	this.components[0] /= rhVec2.components[0];
	this.components[1] /= rhVec2.components[1];
};
Vec2Base.prototype.div = function (rhVec2) {
	return new this.CONSTUCTOR_TYPE(
		this.components[0] / rhVec2.components[0],
		this.components[1] / rhVec2.components[1]
	);
};
Vec2Base.prototype.divScalar = function (rhScalar) {
	return new this.CONSTUCTOR_TYPE(
		this.components[0] / rhScalar,
		this.components[1] / rhScalar
	);
};
Vec2Base.prototype.divScalarEq = function (rhScalar) {
	this.components[0] /= rhScalar;
	this.components[1] /= rhScalar;
};
Vec2Base.prototype.lerp = function (fact, rhVec2) {
	return new this.CONSTUCTOR_TYPE( 
		( this.components[0] + ( rhVec2.components[0] - this.components[0] ) * fact ), 
		( this.components[1] + ( rhVec2.components[1] - this.components[1] ) * fact ) 
	);
};
Vec2Base.prototype.lerpEq = function (fact, rhVec2) {
	this.components[0] = this.components[0] + ( rhVec2.components[0] - this.components[0] ) * fact;
	this.components[1] = this.components[1] + ( rhVec2.components[1] - this.components[1] ) * fact;
};
Vec2Base.prototype.dot = function (rhVec2) {
	return  this.components[0] * rhVec2.components[0] + 
			this.components[1] * rhVec2.components[1];
};
Vec2Base.prototype.cross = function (rhVec2) { 
	return this.components[0] * rhVec2.components[1] - 
			this.components[1] * rhVec2.components[0]; 
};
Vec2Base.prototype.distance = function (rhVec2) {
	var newVec = new this.CONSTUCTOR_TYPE( 
		this.components[0] - rhVec2.components[0], 
		this.components[1] - rhVec2.components[1] 
	);
	return newVec.length();
};
Vec2Base.prototype.distanceSquared = function (rhVec2) {
	var newVec = new this.CONSTUCTOR_TYPE( 
		this.components[0] - rhVec2.components[0], 
		this.components[1] - rhVec2.components[1] 
	);
	return newVec.lengthSquared();
};
Vec2Base.prototype.length = function (rhVec2) {
	return Math.sqrt( 
		this.components[0] * this.components[0] + 
		this.components[1] * this.components[1] 
	);
};
Vec2Base.prototype.normalize = function () {
	var invS = 1 / this.length();
	this.components[0] *= invS;
	this.components[1] *= invS;
};
Vec2Base.prototype.normalized = function () {
	var invS = 1 / this.length();
	return new this.CONSTUCTOR_TYPE( 
		this.components[0] * invS, 
		this.components[1] * invS 
	);
};
Vec2Base.prototype.rotate = function (radians) {
	var cosa = Math.cos( radians );
	var sina = Math.sin( radians );
	var rx = this.components[0] * cosa - this.components[1] * sina;
	this.components[1] = this.components[0] * sina + this.components[1] * cosa;
	this.components[0] = rx;
};
Vec2Base.prototype.lengthSquared = function () {
	return this.components[0] * this.components[0] + 
			this.components[1] * this.components[1];
};
Vec2Base.prototype.limit = function (maxLength) {
	var lenSquared = this.lengthSquared();
	if( ( lenSquared > maxLength * maxLength ) && ( lenSquared > 0 ) ) {
		var ratio = maxLength / Math.sqrt( lenSquared );
		this.components[0] *= ratio;
		this.components[1] *= ratio;
	}
};
Vec2Base.prototype.limited = function (maxLength) {
	var lenSquared = this.lengthSquared();
	if( ( lenSquared > maxLength * maxLength ) && ( lenSquared > 0 ) ) {
		var ratio = maxLength / Math.sqrt( lenSquared );
		return new this.CONSTUCTOR_TYPE( this.components[0] * ratio, this.components[1] * ratio );
	}
	else {
		return new this.CONSTUCTOR_TYPE( this );
	}
};
Vec2Base.prototype.invert = function () {
	this.components[0] = -this.components[0];
	this.components[1] = -this.components[1];
};
Vec2Base.prototype.inverse = function () { return new this.CONSTUCTOR_TYPE( -this.components[0], -this.components[1] ); };

Vec2Base.prototype.xx = function () { return new this.CONSTUCTOR_TYPE( this.components[0], this.components[0] ); };
Vec2Base.prototype.xy = function () { return new this.CONSTUCTOR_TYPE( this.components[0], this.components[1] ); };
Vec2Base.prototype.yx = function () { return new this.CONSTUCTOR_TYPE( this.components[1], this.components[0] ); };
Vec2Base.prototype.yy = function () { return new this.CONSTUCTOR_TYPE( this.components[1], this.components[1] ); };
Vec2Base.prototype.xxx = function () { return new this.SWIZZLE_CONSTRUCTOR3( this.components[0], this.components[0], this.components[0] ); };
Vec2Base.prototype.xxy = function () { return new this.SWIZZLE_CONSTRUCTOR3( this.components[0], this.components[0], this.components[1] ); };
Vec2Base.prototype.xyx = function () { return new this.SWIZZLE_CONSTRUCTOR3( this.components[0], this.components[1], this.components[0] ); };
Vec2Base.prototype.xyy = function () { return new this.SWIZZLE_CONSTRUCTOR3( this.components[0], this.components[1], this.components[1] ); };
Vec2Base.prototype.yxx = function () { return new this.SWIZZLE_CONSTRUCTOR3( this.components[1], this.components[0], this.components[0] ); };
Vec2Base.prototype.yxy = function () { return new this.SWIZZLE_CONSTRUCTOR3( this.components[1], this.components[0], this.components[1] ); };
Vec2Base.prototype.yyx = function () { return new this.SWIZZLE_CONSTRUCTOR3( this.components[1], this.components[1], this.components[0] ); };
Vec2Base.prototype.yyy = function () { return new this.SWIZZLE_CONSTRUCTOR3( this.components[1], this.components[1], this.components[1] ); };
