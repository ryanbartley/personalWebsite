Matrix33f = function (d0, d1, d2, d3, d4, d5, d6, d7, d8) {
	Matrix33Base.call(this, Float32Array, Matrix33f);
	this.type = CINDER.TYPES.MAT3F;
	if( arguments.length === 0 ) {
		this.setToIdentity();
	}
	else if( arguments.length === 1 ) {
		if( d0.type !== undefined ) {
			if( d0.type.charAt(1) === "3" ) {
				this.setFromMatrix33(d0);
			}
			else if( d0.type.charAt(1) === "2" ) {
				this.setFromMatrix22(d0);
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
	else if( arguments.length === 3 ) {
		this.setFromVec3( d0, d1, d2 );
	}
	else if( arguments.length === 9 ) {
		this.setFromElements(d0, d1, d2, d3, d4, d5, d6, d7, d8);
	}

	return this;
};

Matrix33f.prototype = Object.create( Matrix33Base.prototype );
Matrix33f.prototype.constructor = Matrix33f;
Matrix33f.createRotationFromTo = function (fromVec3, toVec3, worldUpVec3) {
	if( fromVec3.lengthSquared() == 0 ) {
		return new Matrix33f();
	}
	else {
		var zAxis2FromDir = Matrix33f.alignZAxisWithTarget( fromVec3, Vec3f.yAxis() );
		var fromDir2zAxis = zAxis2FromDir.transposed();
		var zAxis2ToDir = Matrix33f.alignZAxisWithTarget( toVec3, worldUpVec3 );
		return fromDir2zAxis.mult(zAxis2ToDir);
	}
};
Matrix33f.createRotation = function( axisVec3, angle )  {
	var unit = axisVec3.normalized();
	var sine = Math.sin( angle );
	var cosine = Math.cos( angle );

	var ret = new Matrix33f();

	ret.components[0] = unit.x() * unit.x() * (1 - cosine) + cosine;
	ret.components[1] = unit.x() * unit.y() * (1 - cosine) + unit.z() * sine;
	ret.components[2] = unit.x() * unit.z() * (1 - cosine) - unit.y() * sine;

	ret.components[3] = unit.x() * unit.y() * (1 - cosine) - unit.z() * sine;
	ret.components[4] = unit.y() * unit.y() * (1 - cosine) + cosine;
	ret.components[5] = unit.y() * unit.z() * (1 - cosine) + unit.x() * sine;

	ret.components[6] = unit.x() * unit.z() * (1 - cosine) + unit.y() * sine;
	ret.components[7] = unit.y() * unit.z() * (1 - cosine) - unit.x() * sine;
	ret.components[8] = unit.z() * unit.z() * (1 - cosine) + cosine;

    return ret;
};
Matrix33f.createRotationEuler = function (eulerVec3) {
	var ret = new Matrix33f();
	var cos_rz, sin_rz, cos_ry, sin_ry, cos_rx, sin_rx;
	
	cos_rx = Math.cos( eulerVec3.x() );
	cos_ry = Math.cos( eulerVec3.y() );
	cos_rz = Math.cos( eulerVec3.z() );

	sin_rx = Math.sin( eulerVec3.x() );
	sin_ry = Math.sin( eulerVec3.y() );
	sin_rz = Math.sin( eulerVec3.z() );

	ret.components[0] =  cos_rz*cos_ry;
	ret.components[1] =  sin_rz*cos_ry;
	ret.components[2] = -sin_ry;

	ret.components[3] = -sin_rz*cos_rx + cos_rz*sin_ry*sin_rx;
	ret.components[4] =  cos_rz*cos_rx + sin_rz*sin_ry*sin_rx;
	ret.components[5] =  cos_ry*sin_rx;

	ret.components[6] =  sin_rz*sin_rx + cos_rz*sin_ry*cos_rx;
	ret.components[7] = -cos_rz*sin_rx + sin_rz*sin_ry*cos_rx;
	ret.components[8] =  cos_ry*cos_rx;

	return ret;
};
Matrix33f.createScale = function (rhType) {
	if( rhType.type !== undefined ) {
		if( rhType.type.charAt(1) === "2" ) {
			var ret = new Matrix33f();
			ret.setAt(0, 0, rhType.x());
			ret.setAt(1, 1, rhType.y());
			ret.setAt(2, 2, 1);
			return ret;
		}
		else if( rhType.type.charAt(1) === "3" ) {
			var ret = new Matrix33f();
			ret.setAt(0, 0, rhType.x());
			ret.setAt(1, 1, rhType.y());
			ret.setAt(2, 2, rhType.z());
			return ret;
		}

	}
	else {
		var ret = new Matrix33f();
		ret.setAt(0, 0, rhType);
		ret.setAt(1, 1, rhType );
		ret.setAt(2, 2, rhType);
		return ret;
	}
};
Matrix33f.alignZAxisWithTarget = function ( targetDirVec3, upDirVec3 ) {
	if( targetDirVec3.lengthSquared() > Matrix33f.EPSILON ) {
		targetDirVec3 = - Vec3f.zAxis();
	}

	if( upDirVec3.lengthSquared() < Matrix33f.EPSILON ) {
		upDirVec3 = Vec3f.yAxis();
	}

	if( upDirVec3.cross( targetDirVec3 ).lengthSquared() === 0 ) {
		upDirVec3 = targetDirVec3.cross( Vec3f.xAxis() );
		if( upDirVec3.lengthSquared() === 0 ) {
			upDirVec3 = targetDirVec3.cross( Vec3f.zAxis() );
		}
	}

	var targetPerpDir = targetDirVec3.cross( upDirVec3 );
	var targetUpDir = targetPerpDir.cross( targetDirVec3 );

	var row = [];
	row[0] = targetPerpDir.normalized();
	row[1] = targetUpDir.normalized();
	row[2] = targetDirVec3.normalized();

	return new Matrix33f(
		row[0].x(),  row[0].y(),  row[0].z(),
		row[1].x(),  row[1].y(),  row[1].z(),
		row[2].x(),  row[2].y(),  row[2].z()
	);
};

function Matrix33Base (arrayType, constructorType) {
	this.ARRAY_TYPE = arrayType;
	this.CONSTRUCTOR_TYPE = constructorType;
	this.DIM = 3;
	this.DIM_SQ = 3*3;
	this.EPSILON = 4.37114e-05;
	this.FLT_MIN = 1.1755e-38;
}

Matrix33Base.prototype.constructor = Matrix33Base;
Matrix33Base.prototype.copy = function (rhsMatrix33) { this.components.set(rhsMatrix33.components); },
Matrix33Base.prototype.clone = function () { return new this.CONSTRUCTOR_TYPE(this.getComponents()); };
Matrix33Base.prototype.setToNull = function () { this.components = new this.ARRAY_TYPE(9); }
Matrix33Base.prototype.setToIdentity = function () {
	this.components = new this.ARRAY_TYPE([
		1.0, 0.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 0.0, 1.0 
	]);
};
Matrix33Base.prototype.setFromArray = function (array) { this.components = new this.ARRAY_TYPE(array); };
Matrix33Base.prototype.setFromMatrix33 = function (rhsMatrix33) { this.components = new this.ARRAY_TYPE(rhsMatrix33.components); };
Matrix33Base.prototype.setFromMatrix22 = function (rhsMatrix22) {
	this.setToIdentity();
	this.components[0] = rhsMatrix22.components[0]; 
	this.components[3] = rhsMatrix22.components[2];
	this.components[1] = rhsMatrix22.components[1]; 
	this.components[4] = rhsMatrix22.components[3];
};
Matrix33Base.prototype.setFromElements = function (d0, d1, d2, d3, d4, d5, d6, d7, d8) {
	this.components = new this.ARRAY_TYPE([
		d0, d1, d2,
		d3, d4, d5,
		d6, d7, d8
	]);
};
Matrix33Base.prototype.setFromVec3 = function (vec1, vec2, vec3) {
	this.components = new this.ARRAY_TYPE([
		vec1.components[0], vec1.components[1], vec1.components[2],
		vec2.components[0], vec2.components[1], vec2.components[2],
		vec3.components[0], vec3.components[1], vec3.components[2]
	]);
};
Matrix33Base.prototype.getComponents = function () { return this.components; },
Matrix33Base.prototype.mult = function (rhsType) {
	if( rhsType.type === CINDER.TYPES.VEC3F ) { 
		var m = this.components;
		return new Vec3f(
			m[0]*rhsType.components[0] + m[3]*rhsType.components[1] + m[6]*rhsType.components[2],
			m[1]*rhsType.components[0] + m[4]*rhsType.components[1] + m[7]*rhsType.components[2],
			m[2]*rhsType.components[0] + m[5]*rhsType.components[1] + m[8]*rhsType.components[2]
		);
	}
	else if( rhsType.type.charAt(0) === "m" ) {
		var ret = new this.CONSTRUCTOR_TYPE();
		var m = this.components;

		ret.components[0] = m[0]*rhsType.components[0] + m[3]*rhsType.components[1] + m[6]*rhsType.components[2];
		ret.components[1] = m[1]*rhsType.components[0] + m[4]*rhsType.components[1] + m[7]*rhsType.components[2];
		ret.components[2] = m[2]*rhsType.components[0] + m[5]*rhsType.components[1] + m[8]*rhsType.components[2];
	
		ret.components[3] = m[0]*rhsType.components[3] + m[3]*rhsType.components[4] + m[6]*rhsType.components[5];
		ret.components[4] = m[1]*rhsType.components[3] + m[4]*rhsType.components[4] + m[7]*rhsType.components[5];
		ret.components[5] = m[2]*rhsType.components[3] + m[5]*rhsType.components[4] + m[8]*rhsType.components[5];
	
		ret.components[6] = m[0]*rhsType.components[6] + m[3]*rhsType.components[7] + m[6]*rhsType.components[8];
		ret.components[7] = m[1]*rhsType.components[6] + m[4]*rhsType.components[7] + m[7]*rhsType.components[8];
		ret.components[8] = m[2]*rhsType.components[6] + m[5]*rhsType.components[7] + m[8]*rhsType.components[8];
	
		return ret;
	}
};
Matrix33Base.prototype.multEq = function (rhsMatrix33) {
	var mat = new this.CONSTRUCTOR_TYPE();
	var m = this.components;
	var newComponents = new this.ARRAY_TYPE(9);

	newComponents[0] = m[0]*rhsMatrix33.components[0] + m[3]*rhsMatrix33.components[1] + m[6]*rhsMatrix33.components[2];
	newComponents[1] = m[1]*rhsMatrix33.components[0] + m[4]*rhsMatrix33.components[1] + m[7]*rhsMatrix33.components[2];
	newComponents[2] = m[2]*rhsMatrix33.components[0] + m[5]*rhsMatrix33.components[1] + m[8]*rhsMatrix33.components[2];

	newComponents[3] = m[0]*rhsMatrix33.components[3] + m[3]*rhsMatrix33.components[4] + m[6]*rhsMatrix33.components[5];
	newComponents[4] = m[1]*rhsMatrix33.components[3] + m[4]*rhsMatrix33.components[4] + m[7]*rhsMatrix33.components[5];
	newComponents[5] = m[2]*rhsMatrix33.components[3] + m[5]*rhsMatrix33.components[4] + m[8]*rhsMatrix33.components[5];
	
	newComponents[6] = m[0]*rhsMatrix33.components[6] + m[3]*rhsMatrix33.components[7] + m[6]*rhsMatrix33.components[8];
	newComponents[7] = m[1]*rhsMatrix33.components[6] + m[4]*rhsMatrix33.components[7] + m[7]*rhsMatrix33.components[8];
	newComponents[8] = m[2]*rhsMatrix33.components[6] + m[5]*rhsMatrix33.components[7] + m[8]*rhsMatrix33.components[8];

	this.components.set(newComponents);
};
Matrix33Base.prototype.multScalar = function (rhScalar) {
	var m = this.components;
	for( var i = 0; i < this.DIM_SQ; ++i ) {
		m[i] *= rhScalar;
	}
};
Matrix33Base.prototype.divScalar = function (rhScalar) {
	var m = this.components;
	var divScalar = 1 / rhScalar;
	for (var i = 0; i < this.DIM_SQ; ++i) {
		m[i] *= divScalar;
	};
};
Matrix33Base.prototype.add = function (rhsMatrix33) {
	var ret = new this.CONSTRUCTOR_TYPE();
	var m = this.components;
	for( var i = 0; i < this.DIM_SQ; ++i ) {
		ret.components[i] = m[i] + rhsMatrix33.components[i];
	}
	return ret;
};
Matrix33Base.prototype.addEq = function (rhsMatrix33) {
	var m = this.components;
	for( var i = 0; i < this.DIM_SQ; ++i ) {
		m[i] += rhsMatrix33.components[i];
	}
};
Matrix33Base.prototype.addScalar = function (rhScalar) {
	var m = this.components;
	for( var i = 0; i < this.DIM_SQ; ++i ) {
		m[i] += rhScalar;
	}
};
Matrix33Base.prototype.sub = function (rhsMatrix33) {
	var ret = new this.CONSTRUCTOR_TYPE();
	var m = this.components;
	for( var i = 0; i < this.DIM_SQ; ++i ) {
		ret.components[i] = m[i] - rhsMatrix33.components[i];
	}
	return ret;
};
Matrix33Base.prototype.subEq = function (rhsMatrix33) {
	var m = this.components;
	for( var i = 0; i < this.DIM_SQ; ++i ) {
		m[i] -= rhsMatrix33.components[i];
	}
};
Matrix33Base.prototype.subScalar = function (rhScalar) {
	var m = this.components;
	for( var i = 0; i < this.DIM_SQ; ++i ) {
		m[i] -= rhScalar;
	}
};
Matrix33Base.prototype.m00 = function (m00) {
	if( m00 === undefined ) {
		return this.components[0];
	}
	else {
		return this.components[0] = m00;
	}
};
Matrix33Base.prototype.m01 = function (m01) {
	if( m01 === undefined ) {
		return this.components[3];
	}
	else {
		return this.components[3] = m01;
	}
};
Matrix33Base.prototype.m02 = function (m02) {
	if( m02 === undefined ) {
		return this.components[6];
	}
	else {
		return this.components[6] = m02;
	}
};
Matrix33Base.prototype.m10 = function (m10) {
	if( m10 === undefined ) {
		return this.components[1];
	}
	else {
		return this.components[1] = m10;
	}
};
Matrix33Base.prototype.m11 = function (m11) {
	if( m11 === undefined ) {
		return this.components[4];
	}
	else {
		return this.components[4] = m11;
	}
};
Matrix33Base.prototype.m12 = function (m12) {
	if( m12 === undefined ) {
		return this.components[7];
	}
	else {
		return this.components[7] = m12;
	}
};
Matrix33Base.prototype.m20 = function (m20) {
	if( m20 === undefined ) {
		return this.components[2];
	}
	else {
		return this.components[2] = m20;
	}
};
Matrix33Base.prototype.m21 = function (m21) {
	if( m21 === undefined ) {
		return this.components[5];
	}
	else {
		return this.components[5] = m21;
	}
};
Matrix33Base.prototype.m22 = function (m22) {
	if( m22 === undefined ) {
		return this.components[8];
	}
	else {
		return this.components[8] = m22;
	}
};
Matrix33Base.prototype.at = function (row, col) {
	if( row >= 0 && row < this.DIM && col >= 0 && col < this.DIM ) {
		return this.components[col * this.DIM + row];
	} 
};
Matrix33Base.prototype.setAt = function (row, col, value) {
	if( row >= 0 && row < this.DIM && col >= 0 && col < this.DIM ) {
		this.components[col * this.DIM + row] = value;
	} 
};
Matrix33Base.prototype.getColumn = function (col) {
	// TODO: Decide if this should be type dependent
	var i = col*this.DIM;
	return new Vec3f(
		this.components[i+0], 
		this.components[i+1], 
		this.components[i+2]
	);
};
Matrix33Base.prototype.setColumn = function (col, rhVec3) {
	var i = col*this.DIM;
	this.components[i+0] = rhVec3.components[0];
	this.components[i+1] = rhVec3.components[1];
	this.components[i+2] = rhVec3.components[2];
};
Matrix33Base.prototype.getRow = function (row) {
	// TODO: Decide if this should be type dependent
	return new Vec3f( 
		this.components[row + 0], 
		this.components[row + 3], 
		this.components[row + 6]
	);
};
Matrix33Base.prototype.setRow = function (row, rhVec3) {
	this.components[row + 0] = rhVec3.components[0];
	this.components[row + 3] = rhVec3.components[1];
	this.components[row + 6] = rhVec3.components[2];
};
Matrix33Base.prototype.getRows = function () {
	var array = [];
	array.push( this.getRow( 0 ) );
	array.push( this.getRow( 1 ) );
	array.push( this.getRow( 2 ) );
	return array;
};
Matrix33Base.prototype.setRows = function (r0Vec3, r1Vec3, r2Vec3) {
	setRow(0, r0Vec3);
	setRow(1, r1Vec3);
	setRow(2, r2Vec3);
};
Matrix33Base.prototype.getColumns = function () {
	var array = [];
	array.push( this.getColumn( 0 ) );
	array.push( this.getColumn( 1 ) );
	array.push( this.getColumn( 2 ) );
	return array;
};
Matrix33Base.prototype.setColumns = function (r0Vec3f, r1Vec3f, r2Vec3f) {
	setColumn(0, r0Vec3f);
	setColumn(1, r1Vec3f);
	setColumn(2, r2Vec3f);
};
Matrix33Base.prototype.subMatrix22 = function (row, col) {
	// TODO: Decide if this should be implemented as a type
	var ret = new Matrix22f();
	ret.setToNull();

	for( var i = 0; i < 2; ++i ) {
		var r = row + i;
		if( r >= 3 ) {
			continue;
		}
		for( var j = 0; j < 2; ++j ) {
			var c = col + j;
			if( c >= 3 ) {
				continue;
			}
			ret.setAt( i, j, this.at( r, c ) );
		}
	}
	return ret;
};
Matrix33Base.prototype.determinant = function () {
	var m = this.components;

	var co00 = m[4]*m[8] - m[5]*m[7];
	var co10 = m[5]*m[6] - m[3]*m[8];
	var co20 = m[3]*m[7] - m[4]*m[6];
	
	var det  = m[0]*co00 + m[1]*co10 + m[2]*co20;
	
	return det;
};
Matrix33Base.prototype.trace = function () {  return this.components[0] + this.components[4] + this.components[8]; };
Matrix33Base.prototype.diagonal = function () {
	var ret = new this.CONSTRUCTOR_TYPE(true);
	ret.components[0] = this.components[0];
	ret.components[4] = this.components[4];
	ret.components[8] = this.components[8];
	return ret;
};
Matrix33Base.prototype.lowerTriangular = function () {
	var ret = new this.CONSTRUCTOR_TYPE(true);

	ret.components[0] = this.components[0];
	ret.components[1] = this.components[1];
	ret.components[2] = this.components[2];
	ret.components[4] = this.components[4];
	ret.components[5] = this.components[5];
	ret.components[8] = this.components[8];

	return ret;
};
Matrix33Base.prototype.upperTriangular = function () {
	var ret = new this.CONSTRUCTOR_TYPE(true);

	ret.components[0] = this.components[0];
	ret.components[3] = this.components[3];
	ret.components[6] = this.components[6];
	ret.components[4] = this.components[4];
	ret.components[7] = this.components[7];
	ret.components[8] = this.components[8];

	return ret;
};
Matrix33Base.prototype.transpose = function () {
	var t;
	t = this.components[3]; this.components[3] = this.components[1]; this.components[1] = t;
	t = this.components[6]; this.components[6] = this.components[2]; this.components[2] = t;
	t = this.components[7]; this.components[7] = this.components[5]; this.components[5] = t;
};
Matrix33Base.prototype.transposed = function () {
	var m = this.components;
	return new this.CONSTRUCTOR_TYPE([
		m[ 0], m[ 3], m[ 6],
		m[ 1], m[ 4], m[ 7],
		m[ 2], m[ 5], m[ 8]
	]);
};
Matrix33Base.prototype.invert = function (epsilon) { this.components.set(this.inverted(epsilon).components); },
Matrix33Base.prototype.inverted = function (epsilon) {
	var m = this.components;

	var inv = new this.CONSTRUCTOR_TYPE(true);

	// Compute the adjoint.
	inv.components[0] = m[4]*m[8] - m[5]*m[7];
	inv.components[1] = m[2]*m[7] - m[1]*m[8];
	inv.components[2] = m[1]*m[5] - m[2]*m[4];
	inv.components[3] = m[5]*m[6] - m[3]*m[8];
	inv.components[4] = m[0]*m[8] - m[2]*m[6];
	inv.components[5] = m[2]*m[3] - m[0]*m[5];
	inv.components[6] = m[3]*m[7] - m[4]*m[6];
	inv.components[7] = m[1]*m[6] - m[0]*m[7];
	inv.components[8] = m[0]*m[4] - m[1]*m[3];
	
	var det = m[0]*inv.components[0] + m[1]*inv.components[3] + m[2]*inv.components[6];
	
	if( Math.abs( det ) > (epsilon || this.FLT_MIN) ) {
		var invDet = 1 / det;
		inv.components[0] *= invDet;
		inv.components[1] *= invDet;
		inv.components[2] *= invDet;
		inv.components[3] *= invDet;
		inv.components[4] *= invDet;
		inv.components[5] *= invDet;
		inv.components[6] *= invDet;
		inv.components[7] *= invDet;
		inv.components[8] *= invDet;
	}
	
	return inv;
};
Matrix33Base.prototype.preMultiply = function (rhVec3) {
	// TODO: Decide whether we should type this
	return new Vec3f(
		rhVec3.components[0]*this.components[0] + rhVec3.components[1]*this.components[1] + rhVec3.components[2]*this.components[2],
		rhVec3.components[0]*this.components[3] + rhVec3.components[1]*this.components[4] + rhVec3.components[2]*this.components[5],
		rhVec3.components[0]*this.components[6] + rhVec3.components[1]*this.components[7] + rhVec3.components[2]*this.components[8]
	);
};
Matrix33Base.prototype.postMultiply = function (rhVec3) {
	// TODO: Decide whether we should type this
	return new Vec3f(
		this.components[0]*rhVec3.components[0] + this.components[3]*rhVec3.components[1] + this.components[6]*rhVec3.components[2],
		this.components[1]*rhVec3.components[0] + this.components[4]*rhVec3.components[1] + this.components[7]*rhVec3.components[2],
		this.components[2]*rhVec3.components[0] + this.components[5]*rhVec3.components[1] + this.components[8]*rhVec3.components[2]
	);
};
Matrix33Base.prototype.transformVec = function (rhVec) { return this.postMultiply( rhVec ); },
Matrix33Base.prototype.rotate = function (rhVec, radians) { 
	var rot = this.CONSTRUCTOR_TYPE.createRotation(rhVec, radians);
	this.multEq( rot ); 
};	
Matrix33Base.prototype.rotateEuler = function (rhVec) { 
	var rot = this.CONSTRUCTOR_TYPE.createRotationEuler( rhVec );
	this.multEq(rot); 
};
Matrix33Base.prototype.rotateFromTo = function (fromVec3, toVec3, worldUpVec3) { 
	var rot = this.CONSTRUCTOR_TYPE.createRotationFromTo(fromVec3, toVec3, worldUpVec3);
	this.multEq( rot ); 
};
Matrix33Base.prototype.invertTransform = function () {
	var ret = new this.CONSTRUCTOR_TYPE();
	
	// transpose rotation part
	for( var i = 0; i < this.DIM; i++ ) {
		for( var j = 0; j < this.DIM; j++ ) {
			ret.setAt( j, i, this.at( i, j ) );
		}
	}
	
	return ret;
};
Matrix33Base.prototype.toS = function () {
	var m = this.components;
	return "values: " + m[0] + ", " + m[1] + ", " + m[2] + 
		", " + m[3] + ", " + m[4] + ", " + m[5] + 
		", " + m[6] + ", " + m[7] + ", " + m[8];
};



















