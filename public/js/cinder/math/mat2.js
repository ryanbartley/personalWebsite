///////////////////////////////////////////////////////////////////////////
// Matrix22f Class Version of Matrix22Base TODO: Test
///////////////////////////////////////////////////////////////////////////
function Matrix22f (d0, d1, d2, d3) {
	Matrix22Base.call(this, Float32Array, Matrix22f);
	this.type = CINDER.TYPES.MAT2F;

	if( arguments.length === 0 ) {
		this.setToIdentity();
	}
	else if( arguments.length === 1 ) {
		if( d0.type !== undefined ) {
			switch (d0.type) { 
				case CINDER.TYPES.MAT2F: this.setFromMatrix22(d0); break;
			}
		}
		else if( d0 instanceof Array ) {
			this.setFromArray(d0);
		}
		else if( typeof d0 === "boolean" ) {
			if( d0 ) {
				this.setToNull();
			}
			else {
				this.setToIdentity();
			}
		}
	}
	else if( arguments.length === 2 ) {
		this.setFromVec2( d0, d1 );
	}
	else if( arguments.length === 4 ) {
		this.setFromElements(d0, d1, d2, d3);
	}

	return this;
};

Matrix22f.prototype = Object.create( Matrix22Base.prototype );
Matrix22f.prototype.constructor = Matrix22f;
Matrix22f.identity = function () { return new Matrix22f(); };
Matrix22f.createRotation = function (radians) {
	var ret = new Matrix22f();
	var ac = Math.cos( radians );
	var as = Math.sin( radians );
	ret.m00(ac); ret.m01(as);
	ret.m10(-as); ret.m11(ac);
	return ret;
};
Matrix22f.createScale = function (rhType) {
	if( rhType.type !== undefined ) {
		if( rhType.type.charAt(1) === "2" ) {
			var ret = new Matrix22f();
			ret.setAt(0, 0, rhType.x());
			ret.setAt(1, 1, rhType.y());
			return ret;
		}

	}
	else {
		var ret = new Matrix22f();
		ret.setAt(0, 0, rhType);
		ret.setAt(1, 1, rhType);
		return ret;
	}
};

///////////////////////////////////////////////////////////////////////////
// Matrix22Base Implementing all Constructor and Array Independent functions TODO: Test
///////////////////////////////////////////////////////////////////////////

function Matrix22Base (arrayType, constructorType) {
	this.ARRAY_TYPE = arrayType;
	this.CONSTUCTOR_TYPE = constructorType;
	this.DIM = 2;
	this.DIM_SQ = 2*2;
	this.EPSILON = 4.37114e-05;
};

Matrix22Base.prototype.constructor = Matrix22Base,
Matrix22Base.prototype.getComponents = function () { return this.components; },
Matrix22Base.prototype.copy = function (rhsMatrix22) { this.components.set(rhsMatrix22.components); },
Matrix22Base.prototype.clone = function () { return new this.CONSTUCTOR_TYPE(this.components); },
Matrix22Base.prototype.setToNull = function () { this.components = new this.ARRAY_TYPE(4); },
Matrix22Base.prototype.setToIdentity = function () {
	this.components = new this.ARRAY_TYPE([
		1.0, 0.0,
		0.0, 1.0
	]);
};
Matrix22Base.prototype.setFromArray = function (array) { this.components = new this.ARRAY_TYPE(array); },
Matrix22Base.prototype.setFromMatrix22 = function (rhsMatrix22) { this.components = new this.ARRAY_TYPE(rhsMatrix22.components); },
Matrix22Base.prototype.setFromElements = function (d0, d1, d2, d3) {
	this.components = new this.ARRAY_TYPE([
		d0, d1,
		d2, d3
	]);
};
Matrix22Base.prototype.setFromVec2 = function (vec1, vec2) {
	this.components = new this.ARRAY_TYPE(4);
	this.components[0] = vec1.components[0]; 
	this.components[2] = vec2.components[0];
	this.components[1] = vec1.components[1]; 
	this.components[3] = vec2.components[1];
};
Matrix22Base.prototype.mult = function (rhsType) {
	switch(rhsType.type) {
		case CINDER.TYPE.VEC2F: {
			var m = this.components;
			return new Vec2f(
				m[ 0]*rhsType.components[0] + m[ 2]*rhsType.components[1],
				m[ 1]*rhsType.components[0] + m[ 3]*rhsType.components[1]
			);
		}
		break;
		case CINDER.TYPE.MAT2F: {
			var ret = new this.CONSTUCTOR_TYPE();
			var m = this.components;

			ret.components[0] = m[0]*rhsType.components[0] + m[2]*rhsType.components[1];
			ret.components[1] = m[1]*rhsType.components[0] + m[3]*rhsType.components[1];
		
			ret.components[2] = m[0]*rhsType.components[2] + m[2]*rhsType.components[3];
			ret.components[3] = m[1]*rhsType.components[2] + m[3]*rhsType.components[3];
	
			return ret;
		}
		break;
		default:
			throw "ERROR: MATRIX22.mult - I don't know how to multiply with that type";
		break;
	}
};
Matrix22Base.prototype.multEq = function (rhsMatrix22) {
	var m = this.components;

	var m0 = m[0]*rhsMatrix22.components[0] + m[2]*rhsMatrix22.components[1];
	var m1 = m[1]*rhsMatrix22.components[0] + m[3]*rhsMatrix22.components[1];

	var m2 = m[0]*rhsMatrix22.components[2] + m[2]*rhsMatrix22.components[3];
	var m3 = m[1]*rhsMatrix22.components[2] + m[3]*rhsMatrix22.components[3];

	m[0] = m0; m[1] = m1; m[2] = m2; m[3] = m3;
};
Matrix22Base.prototype.multScalar = function (rhScalar) {
	var m = this.components;
	for( var i = 0; i < this.DIM_SQ; ++i ) {
		m[i] *= rhScalar;
	}
};
Matrix22Base.prototype.divScalar = function (rhScalar) {
	var m = this.components;
	var divScalar = 1/rhScalar;
	for (var i = 0; i < this.DIM_SQ; ++i) {
		m[i] *= divScalar;
	};
};
Matrix22Base.prototype.add = function (rhsMatrix22) {
	var ret = new this.CONSTUCTOR_TYPE();
	var m = this.components;
	for( var i = 0; i < this.DIM_SQ; ++i ) {
		ret.components[i] = m[i] + rhsMatrix22.components[i];
	}
	return ret;
};
Matrix22Base.prototype.addEq = function (rhsMatrix22) {
	var m = this.components;
	for( var i = 0; i < this.DIM_SQ; ++i ) {
		m[i] += rhsMatrix22.components[i];
	}
};
Matrix22Base.prototype.addScalar = function (rhScalar) {
	var m = this.components;
	for( var i = 0; i < this.DIM_SQ; ++i ) {
		m[i] += rhScalar;
	}
};
Matrix22Base.prototype.sub = function (rhsMatrix22) {
	var ret = new this.CONSTUCTOR_TYPE();
	var m = this.components;
	for( var i = 0; i < this.DIM_SQ; ++i ) {
		ret.components[i] = m[i] - rhsMatrix22.components[i];
	}
	return ret;
};
Matrix22Base.prototype.subEq = function (rhsMatrix22) {
	var m = this.components;
	for( var i = 0; i < this.DIM_SQ; ++i ) {
		m[i] -= rhsMatrix22.components[i];
	}
};
Matrix22Base.prototype.subScalar = function (rhScalar) {
	var m = this.components;
	for( var i = 0; i < this.DIM_SQ; ++i ) {
		m[i] -= rhScalar;
	}
};
Matrix22Base.prototype.m00 = function (m00) {
	if( m00 === undefined ) {
		return this.components[0];
	}
	else {
		return this.components[0] = m00;
	}
};
Matrix22Base.prototype.m01 = function (m01) {
	if( m01 === undefined ) {
		return this.components[2];
	}
	else {
		return this.components[2] = m01;
	}
};
Matrix22Base.prototype.m10 = function (m10) {
	if( m10 === undefined ) {
		return this.components[1];
	}
	else {
		return this.components[1] = m10;
	}
};
Matrix22Base.prototype.m11 = function (m11) {
	if( m11 === undefined ) {
		return this.components[3];
	}
	else {
		return this.components[3] = m11;
	}
};
Matrix22Base.prototype.at = function (row, col) {
	if( row >= 0 && row < this.DIM && col >= 0 && col < this.DIM ) {
		return this.components[col * this.DIM + row];
	} 
};
Matrix22Base.prototype.setAt = function (row, col, value) {
	if( row >= 0 && row < this.DIM && col >= 0 && col < this.DIM ) {
		this.components[col * this.DIM + row] = value;
	} 
};
Matrix22Base.prototype.getColumn = function (col) {
	var i = col*this.DIM;
	return new Vec2f(
		this.components[i+0], 
		this.components[i+1]
	);
};
Matrix22Base.prototype.setColumn = function (col, rhVec2f) {
	var i = col*this.DIM;
	this.components[i+0] = rhVec4f.components[0];
	this.components[i+1] = rhVec4f.components[1];
};
Matrix22Base.prototype.getRow = function (row) {
	return new Vec2f( 
		this.components[row + 0], 
		this.components[row + 2]
	);
};
Matrix22Base.prototype.setRow = function (row, rhVec2f) {
	this.components[row + 0] = rhVec2f.components[0];
	this.components[row + 2] = rhVec2f.components[1];
};
Matrix22Base.prototype.getRows = function () {
	var array = [];
	array.push( this.getRow( 0 ) );
	array.push( this.getRow( 1 ) );
	return array;
};
Matrix22Base.prototype.setRows = function (r0Vec2f, r1Vec2f) {
	setRow(0, r0Vec2f);
	setRow(1, r1Vec2f);
};
Matrix22Base.prototype.getColumns = function () {
	var array = [];
	array.push( this.getColumn( 0 ) );
	array.push( this.getColumn( 1 ) );
	return array;
};
Matrix22Base.prototype.setColumns = function (r0Vec2f, r1Vec2f) {
	setColumn(0, r0Vec3f);
	setColumn(1, r1Vec3f);
};	
Matrix22Base.prototype.determinant = function () {
	var m = this.components;
	var det  = m[0]*m[3] - m[1]*m[2];

	return det;
};
Matrix22Base.prototype.trace = function (shouldFullTrace) {
	// m00 + m11
	return this.components[0] + this.components[3];
};
Matrix22Base.prototype.diagonal = function () {
	var ret = new this.CONSTUCTOR_TYPE(true);
	// ret m00 = m00;
	// ret m11 = m11;
	ret.components[0] = this.components[0];
	ret.components[3] = this.components[3];
	return ret;
};
Matrix22Base.prototype.lowerTriangular = function () {
	var ret = new this.CONSTUCTOR_TYPE(true);

	// ret.m00 = this.m00
	// ret.m10 = this.m10
	// ret.m11 = this.m11

	ret.components[0] = this.components[0];
	ret.components[1] = this.components[1];
	ret.components[3] = this.components[3];
	return ret;
};
Matrix22Base.prototype.upperTriangular = function () {
	var ret = new this.CONSTUCTOR_TYPE(true);

	// ret.m00(this.m00());
	// ret.m01(this.m01());
	// ret.m11(this.m11());

	ret.components[0] = this.components[0];
	ret.components[2] = this.components[2];
	ret.components[3] = this.components[3];
	return ret;
};
Matrix22Base.prototype.transpose = function () {
	var t;
	//t = this.m01(); this.m01(this.m10()); this.m10(t);
	t = this.components[2]; this.components[2] = this.components[1]; this.components[1] = t;
};
Matrix22Base.prototype.transposed = function () {
	var m = this.components;
	return new this.CONSTUCTOR_TYPE([
		m[ 0], m[ 2],
		m[ 1], m[ 3]
	]);
};
Matrix22Base.prototype.invert = function (epsilon) { this.components.set(this.inverted(epsilon).components); },
Matrix22Base.prototype.inverted = function (epsilon) {
	var m = this.components;

	var inv = new this.CONSTUCTOR_TYPE(true);

	var det = m[0]*m[3] - m[1]*m[2];

	if( Math.abs( det ) > (epsilon || this.EPSILON) ) {
		var invDet = 1 / det;
		inv.components[0] =  m[3]*invDet;
		inv.components[1] = -m[1]*invDet;
		inv.components[2] = -m[2]*invDet;
		inv.components[3] =  m[0]*invDet;
	}
	
	return inv;
};
Matrix22Base.prototype.preMultiply = function (rhVec2) {
	return new Vec2f(
		// rhVec2.components[0]*this.m00() + rhVec2.components[1]*this.m10(),
		// rhVec2.components[0]*this.m01() + rhVec2.components[1]*this.m11()
		rhVec2.components[0]*this.components[0] + rhVec2.components[1]*this.components[1],
		rhVec2.components[0]*this.components[2] + rhVec2.components[1]*this.components[3]
	);
};
Matrix22Base.prototype.postMultiply = function (rhVec2) {
	return new Vec2f(
		// this.m00()*rhVec2.x() + this.m01()*rhVec2.y(),
		// this.m10()*rhVec2.x() + this.m11()*rhVec2.y()
		this.components[0]*rhVec2.components[0] + this.components[1]*rhVec2.components[1],
		this.components[2]*rhVec2.components[0] + this.components[3]*rhVec2.components[1]
	);
};
Matrix22Base.prototype.transformVec = function (rhVec) { return this.postMultiply( rhVec ); },
Matrix22Base.prototype.rotate = function (radians) { 
	// TODO: Test this
	var rot = this.CONSTUCTOR_TYPE.createRotation( radians ); 
	rot.multEq(this);
	this.components.set(rot.components);
};
Matrix22Base.prototype.scale = function (s) {
	var sc = this.CONSTUCTOR_TYPE.createScale(s); 
	sc.multEq(this); 
	this.components.set(sc.components);
};
Matrix22Base.prototype.invertTransform = function () {
	var ret = new this.CONSTUCTOR_TYPE();

	// transpose rotation part
	for( var i = 0; i < this.DIM; i++ ) {
		for( var j = 0; j < this.DIM; j++ ) {
			ret.setAt( j, i, this.at( i, j ) );
		}
	}
	return ret;
};
Matrix22Base.prototype.toS = function () {
	var m = this.components;
	return "values: " + m[0] + ", " + m[1] + ", " + m[2] + ", " + m[3] + ", ";
};
