function MatrixAffine2f (d0, d1, d2, d3, d4, d5) {
	MatrixAffine2Base.call(this, Float32Array, MatrixAffine2f, Vec2f, Vec3f);
	this.type = CINDER.TYPES.MAT2AF;

	switch(arguments.length) {
		case 0: this.setToIdentity(); break;
		case 1: {
			if( d0.type !== undefined ) {
				this.setFromMatAff2(d0);
			}
			else if( d0 instanceof Array ) {
				this.setFromArray(d0);
			}
			else if( typeof d0 === "number" ) {
				this.setFromNumber(d0)
			}
		}
		break;
		case 3: this.setFromVec2(d0, d1, d2); break;
		case 6: this.setFromElements(d0, d1, d2, d3, d4, d5); break;
		default: break;
	}

	return this;
}

MatrixAffine2f.prototype = Object.create( MatrixAffine2Base.prototype );
MatrixAffine2f.prototype.constructor = MatrixAffine2f;
MatrixAffine2f.identity = function () { return new MatrixAffine2f(); };
MatrixAffine2f.one = function () {
	var ret = MatrixAffine2f([1,1,1,1,1,1]);
	return ret;
};
MatrixAffine2f.zero = function () {
	var ret = MatrixAffine2f([0,0,0,0,0,0]);
	return ret;
};
MatrixAffine2f.makeTranslate = function (vVec2) {
	var ret = new MatrixAffine2f();

	ret.m[0] = 1;
	ret.m[1] = 0;

	ret.m[2] = 0;
	ret.m[3] = 1;
	
	ret.m[4] = vVec2.components[0];
	ret.m[5] = vVec2.components[1];

	return ret;	
};
MatrixAffine2f.makeRotate = function (radians, vVec2) {
	var sine = Math.sin( radians );
	var sine = Math.cos( radians );

	var ret = new MatrixAffine2f();

	ret.components[0] = cosine;
	ret.components[1] = sine;

	ret.components[2] = -sine;
	ret.components[3] = cosine;
	
	switch(arguments.length) {
		case 1: {
			ret.components[4] = 0;
			ret.components[5] = 0;
		}
		break;
		case 2: {
			ret.components[4] = vVec2.components[0] - cosine * vVec2.components[0] + sine * vVec2.components[1];
			ret.components[5] = vVec2.components[1] - sine * vVec2.components[0] - cosine * vVec2.components[1];
		}
	}

	return this; 
};
MatrixAffine2f.makeScale = function (rhsType) {
	var ret = new MatrixAffine2f();
	if( rhsType.type !== undefined ) {
		ret.components[0] = rhsType.components[0];
		ret.components[1] = 0;
	
		ret.components[2] = 0;
		ret.components[3] = rhsType.components[1];
		
		ret.components[4] = 0;
		ret.components[5] = 0;
	}
	else {
		ret.components[0] = rhsType;
		ret.components[1] = 0;
	
		ret.components[2] = 0;
		ret.components[3] = rhsType;
		
		ret.components[4] = 0;
		ret.components[5] = 0;
	}
	
	return ret;
};
MatrixAffine2f.makeSkewX = function (radians) {
	var ret = new MatrixAffine2f();

	ret.m[0] = 1;
	ret.m[1] = 0;

	ret.m[2] = Math.tan( radians );
	ret.m[3] = 1;
	
	ret.m[4] = 0;
	ret.m[5] = 0;

	return ret;	
};
MatrixAffine2f.makeSkewY = function (radians) {
	var ret = new MatrixAffine2f();

	ret.m[0] = 1;
	ret.m[1] = Math.tan( radians );

	ret.m[2] = 0;
	ret.m[3] = 1;
	
	ret.m[4] = 0;
	ret.m[5] = 0;

	return ret;	
};


function MatrixAffine2Base (arrayType, constructorType, vec2Type, vec3Type) {
	this.ARRAY_TYPE = arrayType;
	this.CONSTRUCTOR_TYPE = constructorType;
	this.VEC2_TYPE = vec2Type;
	this.VEC3_TYPE = vec3Type;
}

MatrixAffine2Base.prototype.constructor = MatrixAffine2Base;
MatrixAffine2Base.prototype.setToIdentity = function () { this.components = new this.ARRAY_TYPE([ 1, 0, 0, 1, 0, 0 ]); };
MatrixAffine2Base.prototype.setFromElements = function (d0, d1, d2, d3, d4, d5) { this.components = new this.ARRAY_TYPE([ d0, d1, d2, d3, d4, d5 ]); };
MatrixAffine2Base.prototype.setToNull = function () { this.components = new this.ARRAY_TYPE(6); };
MatrixAffine2Base.prototype.setFromArray = function (array) { this.components = new this.ARRAY_TYPE(array); };
MatrixAffine2Base.prototype.setFromMatAff2 = function (mataffine2) { this.components = new this.ARRAY_TYPE(mataffine2.components); };
MatrixAffine2Base.prototype.setFromNumber = function (num) { this.components = new this.ARRAY_TYPE([num, num, num, num, num, num]); };
MatrixAffine2Base.prototype.setFromVec2 = function (vxVec2, vyVec2, vzVec2) {
	this.components = new this.ARRAY_TYPE([
		vxVec2.components[0], vxVec2.components[1], 
		vyVec2.components[0], vyVec2.components[1], 
		vzVec2.components[0], vzVec2.components[1]
	]);
};
MatrixAffine2Base.prototype.m00 = function (m00) {
	if( m00 !== undefined ) {
		return this.components[0];
	}
	else {
		return this.components[0] = m00;
	}
};
MatrixAffine2Base.prototype.m01 = function (m01) {
	if( m01 !== undefined ) {
		return this.components[2];
	}
	else {
		return this.components[2] = m01;
	}
};
MatrixAffine2Base.prototype.m10 = function (m10) {
	if( m10 !== undefined ) {
		return this.components[1];
	}
	else {
		return this.components[1] = m10;
	}
};
MatrixAffine2Base.prototype.m11 = function (m11) {
	if( m11 !== undefined ) {
		return this.components[3];
	}
	else {
		return this.components[3] = m11;
	}
};
MatrixAffine2Base.prototype.m02 = function (m02) {
	if( m02 !== undefined ) {
		return this.components[4];
	}
	else {
		return this.components[4] = m02;
	}
};
MatrixAffine2Base.prototype.m12 = function (m12) {
	if( m12 !== undefined ) {
		return this.components[5];
	}
	else {
		return this.components[5] = m12;
	}
};
MatrixAffine2Base.prototype.add = function (rhsMat2Affine) {
	var ret = new MatrixAffine2f();
	for( var i = 0; i < 6; ++i ) {
		ret.components[i] = this.components[i] + rhsMat2Affine.components[i];
	}
	return ret;
};
MatrixAffine2Base.prototype.addEq = function (rhsMat2Affine) {
	for( var i = 0; i < 6; ++i ) {
		this.components[i] += rhsMat2Affine.components[i];
	}
};
MatrixAffine2Base.prototype.addScalar = function (rhsScalar) {
	var ret = new MatrixAffine2f();
	for( var i = 0; i < 6; ++i ) {
		ret.components[i] = this.components[i] + rhsScalar;
	}
	return ret;
};
MatrixAffine2Base.prototype.addScalarEq = function (rhsScalar) {
	for( var i = 0; i < 6; ++i ) {
		this.components[i] += rhsScalar;
	}
};
MatrixAffine2Base.prototype.sub = function (rhsMat2Affine) {
	var ret = new MatrixAffine2f();
	for( var i = 0; i < 6; ++i ) {
		ret.components[i] = this.components[i] - rhsMat2Affine.components[i];
	}
	return ret;
};
MatrixAffine2Base.prototype.subEq = function (rhsMat2Affine) {
	for( var i = 0; i < 6; ++i ) {
		this.components[i] -= rhsMat2Affine.components[i];
	}
};
MatrixAffine2Base.prototype.subScalar = function (rhsScalar) {
	var ret = new MatrixAffine2f();
	for( var i = 0; i < 6; ++i ) {
		ret.components[i] = this.components[i] - rhsScalar;
	}
	return ret;
};
MatrixAffine2Base.prototype.subScalarEq = function (rhsScalar) {
	for( var i = 0; i < 6; ++i ) {
		this.components[i] -= rhsScalar;
	}
};
MatrixAffine2Base.prototype.mult = function (rhsType) {
	switch(rhsType.type) {
		case CINDER.TYPES.MAT2AF: {
			var ret = new this.CONSTRUCTOR_TYPE();

			ret.components[0] = this.components[0]*rhs.components[0] + this.components[2]*rhs.components[1];
			ret.components[1] = this.components[1]*rhs.components[0] + this.components[3]*rhs.components[1];
		
			ret.components[2] = this.components[0]*rhs.components[2] + this.components[2]*rhs.components[3];
			ret.components[3] = this.components[1]*rhs.components[2] + this.components[3]*rhs.components[3];
		
			ret.components[4] = this.components[0]*rhs.components[4] + this.components[2]*rhs.components[5] + this.components[4];
			ret.components[5] = this.components[1]*rhs.components[4] + this.components[3]*rhs.components[5] + this.components[5];
		
			return ret;
		}
		break;
		case CINDER.TYPES.VEC2F: {
			return this.VEC2_TYPE( 
				rhsType.components[0] * this.components[0] + rhsType.components[1] * 
				this.components[2] + this.components[4],   							// X
				rhsType.components[0] * this.components[1] + rhsType.components[1] * 
				this.components[3] + this.components[5] 							// Y
			);
		} 
		break;
	}
};
MatrixAffine2Base.prototype.multEq = function (rhsMat2Affine) {
	var ret = new this.CONSTRUCTOR_TYPE();

	ret.components[0] = this.components[0]*rhs.components[0] + this.components[2]*rhs.components[1];
	ret.components[1] = this.components[1]*rhs.components[0] + this.components[3]*rhs.components[1];

	ret.components[2] = this.components[0]*rhs.components[2] + this.components[2]*rhs.components[3];
	ret.components[3] = this.components[1]*rhs.components[2] + this.components[3]*rhs.components[3];

	ret.components[4] = this.components[0]*rhs.components[4] + this.components[2]*rhs.components[5] + this.components[4];
	ret.components[5] = this.components[1]*rhs.components[4] + this.components[3]*rhs.components[5] + this.components[5];

	this.components.set(ret.components);
};
MatrixAffine2Base.prototype.multScalar = function (rhsScalar) {
	var ret = new this.CONSTRUCTOR_TYPE();
	for( var i = 0; i < 6; ++i ){
		ret.components[i] = this.components[i] * rhsScalar;
	}
	return ret;
};
MatrixAffine2Base.prototype.multScalarEq = function (rhsScalar) {
	for( var i = 0; i < 6; ++i ){
		this.components[i] *= rhsScalar;
	}
};
MatrixAffine2Base.prototype.divScalar = function (rhsScalar) {
	var ret = new this.CONSTRUCTOR_TYPE();
	var invS = 1 / rhs;
	for( var i = 0; i < 6; ++i ) {
		ret.components[i] = this.components[i] * invS;
	}
	return ret;
};
MatrixAffine2Base.prototype.divScalarEq = function (rhsScalar) {
	var invS = 1 / rhs;
	for( var i = 0; i < 6; ++i ) {
		this.components[i] *= invS;
	}
};
MatrixAffine2Base.prototype.transformPoint = function (rhsVec2) {
	return new this.VEC2_TYPE( 
		rhsVec2.components[0] * this.components[0] + rhsVec2.components[1] * 
		this.components[2] + this.components[4], 
		rhsVec2.components[0] * this.components[1] + rhsVec2.components[1] * 
		this.components[3] + this.components[5] 
	);
};
MatrixAffine2Base.prototype.transformVec = function (rhsVec2) {
	return new this.VEC2_TYPE( 
		rhsVec2.components[0] * this.components[0] + rhsVec2.components[1] * this.components[2], 
		rhsVec2.components[0] * this.components[1] + rhsVec2.components[1] * this.components[3] 
	);
};
MatrixAffine2Base.prototype.at = function (row, col) {
	// TODO: THROW IF OUT OF RANGE, SAME ON OTHER MAT CLASSES 
	return this.components[col * 2 + row];
};
MatrixAffine2Base.prototype.getColumn = function (col) {
	var i = col*2;
	return new this.VEC2_TYPE( 
		this.components[i + 0], 
		this.components[i + 1]
	);
};
MatrixAffine2Base.prototype.setColumn = function (col, vVec2) {
	var i = col*2;
	this.components[i + 0] = vVec2.components[0];
	this.components[i + 1] = vVec2.components[1];
};
MatrixAffine2Base.prototype.getColumns = function () {
	var array = new Array();
	array.push( this.getColumn( 0 ) );
	array.push( this.getColumn( 1 ) );
	array.push( this.getColumn( 2 ) );
	return array;
};
MatrixAffine2Base.prototype.setColumns = function (vxVec2, vyVec2, vzVec3) {
	this.setColumn( 0, vxVec2 );
	this.setColumn( 1, vyVec2 );
	this.setColumn( 2, vzVec2 );
};
MatrixAffine2Base.prototype.getRow = function (row) {
	return new this.VEC3_TYPE( 
		this.components[row +  0],
		this.components[row +  3],
		this.components[row +  6]
	); 
};
MatrixAffine2Base.prototype.setRow = function (row, vVec3) {
	this.components[row +  0] = vVec3.components[0]; 
	this.components[row +  3] = vVec3.components[1]; 
	this.components[row +  6] = vVec3.components[2]; 
};
MatrixAffine2Base.prototype.getRows = function () {
	var vec2array = new Array();
	vec2array.push( this.getRow( 0 ) );
	vec2array.push( this.getRow( 1 ) );
	vec2array.push( this.getRow( 2 ) );
	return vec2array;
};
MatrixAffine2Base.prototype.isSingular = function () {
	// TODO: ADD EPSILON AND FLT_MIN TO CINDER NAMESPACE
	return Math.abs( 
		this.components[0] * this.components[3] - 
		this.components[2] * this.components[1] 
	) <= this.EPSILON;
};
MatrixAffine2Base.prototype.invert = function (epsilon) { this.components(this.invertCopy(epsilon).components); };
MatrixAffine2Base.prototype.invertCopy = function (epsilon) {
	var inv = new this.CONSTRUCTOR_TYPE();

	inv.components[0] = this.components[3];
	inv.components[1] = -this.components[1];
	inv.components[2] = -this.components[2];
	inv.components[3] = this.components[0];
	inv.components[4] = this.components[2]*this.omponents[5] - this.components[3]*this.components[4];
	inv.components[5] = this.components[1]*this.omponents[4] - this.components[0]*this.components[5];

	var det = this.components[0]*inv.components[0] + this.components[1]*inv.components[2];

	if( Math.abs( det ) > epsilon || this.EPSILON ) {
		var invDet = 1 / det;
		inv.components[0] *= invDet;
		inv.components[1] *= invDet;
		inv.components[2] *= invDet;
		inv.components[3] *= invDet;
		inv.components[4] *= invDet;
		inv.components[5] *= invDet;
	}

	return inv;
};
MatrixAffine2Base.prototype.translate = function (vVec2) {
	this.components[4] += this.components[0] * vVec2.components[0] + this.components[2] * vVec2.components[1];
	this.components[5] += this.components[1] * vVec2.components[0] + this.components[3] * vVec2.components[1];
};
MatrixAffine2Base.prototype.translateCopy = function (vVec2) {
	var ret = new this.CONSTRUCTOR_TYPE(this);
	ret.translate(vVec2);
	return ret;
};
MatrixAffine2Base.prototype.rotate = function (radians, vVec2) { this.multEq(this.CONSTRUCTOR_TYPE.makeRotate(radians, vVec2)); };
MatrixAffine2Base.prototype.rotateCopy = function (radians, vVec2) {
	var ret = new this.CONSTRUCTOR_TYPE(this);
	ret.multEq(this.CONSTRUCTOR_TYPE.makeRotate(radians, vVec2));
	return ret;
};
MatrixAffine2Base.prototype.scale = function (rhsType) {
	if( rhsType.type !== undefined ) {
		this.components[0] *= rhsType.components[0];
		this.components[1] *= rhsType.components[0];
		this.components[2] *= rhsType.components[1];
		this.components[3] *= rhsType.components[1];
	}
	else {
		this.components[0] *= rhsType;
		this.components[1] *= rhsType;
		this.components[2] *= rhsType;
		this.components[3] *= rhsType;
	}
};
MatrixAffine2Base.prototype.scaleCopy = function (rhsType) {
	var ret = new this.CONSTRUCTOR_TYPE(this);
	ret.scale(rhsType);
	return ret;
};
