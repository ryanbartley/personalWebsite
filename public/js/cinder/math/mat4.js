function Matrix44f (d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15) {
	Matrix44Base.call(this, Float32Array, Matrix44f);
	this.type = CINDER.TYPES.MAT4F;

	switch(arguments.length) {
		case 0:	this.setToIdentity(); break;
		case 1: {
			if( d0.type !== undefined ) { 
				switch(d0.type) {
					case CINDER.TYPES.MAT3F: this.setFromMatrix33(d0); break;
					case CINDER.TYPES.MAT4F: this.setFromMatrix44(d0); break;
					default: throw "ERROR: Matrix44f Constructor - Unknown type with 1 argument"; break;
				}
			}
			else if( d0 instanceof Array ) {
				this.setFromArray(d0);
			}
		}
		break;
		case 3: this.setFromVec3( d0, d1, d2 ); break;
		case 4: this.setFromVec4( d0, d1, d2, d3 ); break;
		case 16: this.setFromElements(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15); break;
		default: throw "ERROR: Matrix44f Constructor - Unknown amount of arguments"; break;
	}
	return this;
};

Matrix44f.prototype = Object.create( Matrix44Base.prototype );
Matrix44f.prototype.constructor = Matrix44f;
Matrix44f.createTranslation = function ( rhVec, w ) {
	switch(arguments.length) { 
		case 1: { 
			switch(rhVec.type) {
				case CINDER.TYPES.VEC3F: {
					var ret = new Matrix44f();
					ret.components[12] = rhVec.components[0];
					ret.components[13] = rhVec.components[1];
					ret.components[14] = rhVec.components[2];
					ret.components[15] = 1.0;
					return ret;
				}
				case CINDER.TYPES.VEC4F: {
					var ret = new Matrix44f();
					ret.components[12] = rhVec.components[0];
					ret.components[13] = rhVec.components[1];
					ret.components[14] = rhVec.components[2];
					ret.components[15] = rhVec.components[3];
					return ret;
				}
			}
		}
		break;
		case 2: { 
			var ret = new Matrix44f();
			ret.components[12] = rhVec.components[0];
			ret.components[13] = rhVec.components[1];
			ret.components[14] = rhVec.components[2];
			ret.components[15] = w || 0.0;
			return ret;
		}
		break;
		default: throw "ERROR: Matrix44f.CreateTranslate Unknown Type"; break;
	}
};
Matrix44f.createOrthographic = function (left, top, right, bottom, nearZ, farZ) {
	var a = 2 / (right - left);
	var b = 2 / (top - bottom);
	var c = -2 / (farZ - nearZ);
	
	var tx = -(right + left) / (right - left);
	var ty = -(top + bottom) / (top - bottom);
	var tz = -(farZ + nearZ) / (farZ - nearZ);
	
	var ret = new Matrix44f(
		a, 0, 0, 0,
		0, b, 0, 0,
		0, 0, c, 0,
		tx, ty, tz, 1
	);
	
	return ret;
};
Matrix44f.createFrustum = function (left, top, right, bottom, nearZ, farZ) {
	var a = 2 * nearZ / (right - left);
	var b = 2 * nearZ / (top - bottom);
	var c = (right + left) / (right - left);
	
	var d = (top + bottom) / (top - bottom);
	var e = - (farZ + nearZ) / (farZ - nearZ);
	var f = - 2 * farZ * nearZ / (farZ - nearZ);
	
	var ret = new Matrix44f(
		a, 0, 0, 0,
		0, b, 0, 0,
		c, d, e, -1,
		0, 0, f, 0
	);
	
	return ret;
};
Matrix44f.createRotation = function (axisVec, angle) {
	var unit = axisVec.normalized();
	var sine   = Math.sin( angle );
	var cosine = Math.cos( angle );
	
	var ret = new Matrix44f();
	
	ret.components[ 0] = unit.components[0] * unit.components[0] * (1 - cosine) + cosine;
	ret.components[ 1] = unit.components[0] * unit.components[1] * (1 - cosine) + unit.components[2] * sine;
	ret.components[ 2] = unit.components[0] * unit.components[2] * (1 - cosine) - unit.components[1] * sine;
	ret.components[ 3] = 0;
	
	ret.components[ 4] = unit.components[0] * unit.components[1] * (1 - cosine) - unit.components[2] * sine;
	ret.components[ 5] = unit.components[1] * unit.components[1] * (1 - cosine) + cosine;
	ret.components[ 6] = unit.components[1] * unit.components[2] * (1 - cosine) + unit.components[0] * sine;
	ret.components[ 7] = 0;
	
	ret.components[ 8] = unit.components[0] * unit.components[2] * (1 - cosine) + unit.components[1] * sine;
	ret.components[ 9] = unit.components[1] * unit.components[2] * (1 - cosine) - unit.components[0] * sine;
	ret.components[10] = unit.components[2] * unit.components[2] * (1 - cosine) + cosine;
	ret.components[11] = 0;
	
	ret.components[12] = 0;
	ret.components[13] = 0;
	ret.components[14] = 0;
	ret.components[15] = 1;
	
    return ret;
};
Matrix44f.createRotationFromTo = function (fromVec, toVec, worldUpVec) {
	if( fromVec.lengthSquared() == 0 ) {
		return new Matrix44f();
	}
	else {
		var zAxis2FromDir = Matrix44f.alignZAxisWithTarget( fromVec, Vec3f.yAxis() );
		var fromDir2zAxis = zAxis2FromDir.transposed();
		var zAxis2ToDir = Matrix44f.alignZAxisWithTarget( toVec, worldUpVec );
		return fromDir2zAxis.mult( zAxis2ToDir );
	}
};
Matrix44f.createRotationEuler = function (rhVecEuler) {
	var ret = new Matrix44f();
	var cos_rz, sin_rz, cos_ry, sin_ry, cos_rx, sin_rx;
	
	cos_rx = Math.cos( rhVecEuler.components[0] );
	cos_ry = Math.cos( rhVecEuler.components[1] );
	cos_rz = Math.cos( rhVecEuler.components[2] );
	
	sin_rx = Math.sin( rhVecEuler.components[0] );
	sin_ry = Math.sin( rhVecEuler.components[1] );
	sin_rz = Math.sin( rhVecEuler.components[2] );
	
	ret.components[ 0] =  cos_rz*cos_ry;
	ret.components[ 1] =  sin_rz*cos_ry;
	ret.components[ 2] = -sin_ry;
	ret.components[ 3] =  0;
	
	ret.components[ 4] = -sin_rz*cos_rx + cos_rz*sin_ry*sin_rx;
	ret.components[ 5] =  cos_rz*cos_rx + sin_rz*sin_ry*sin_rx;
	ret.components[ 6] =  cos_ry*sin_rx;
	ret.components[ 7] =  0;
	
	ret.components[ 8] =  sin_rz*sin_rx + cos_rz*sin_ry*cos_rx;
	ret.components[ 9] = -cos_rz*sin_rx + sin_rz*sin_ry*cos_rx;
	ret.components[10] =  cos_ry*cos_rx;
	ret.components[11] =  0;
	
	ret.components[12] =  0;
	ret.components[13] =  0;
	ret.components[14] =  0;
	ret.components[15] =  1;
	
	return ret;
};
Matrix44f.createRotationOnb = function (uVec3, vVec3, wVec3) {
	return new Matrix44f(
		uVec3.components[0],  uVec3.components[1], uVec3.components[2], 0,
		vVec3.components[0],  vVec3.components[1], vVec3.components[2], 0,
		wVec3.components[0],  wVec3.components[1], wVec3.components[2], 0,
		0,    				  0,   	   			   0, 		  			1
	);
};
Matrix44f.createScale = function (rhType) {
	if( rhType.type === undefined ) {
		var ret = new Matrix44f();
		ret.setAt(0, 0, rhType);
		ret.setAt(1, 1, rhType);
		ret.setAt(2, 2, rhType);
		ret.setAt(3, 3, rhType);
		return ret;
	}
	else {
		switch(rhType.type) { 
			case CINDER.TYPES.VEC2F: {
				var ret = new Matrix44f();
				ret.setAt(0, 0, rhType.components[0]);
				ret.setAt(1, 1, rhType.components[1]);
				ret.setAt(2, 2, 1);
				ret.setAt(3, 3, 1);
				return ret;
			}
			break;
			case CINDER.TYPES.VEC3F: { 
				var ret = new Matrix44f();
				ret.setAt(0, 0, rhType.components[0]);
				ret.setAt(1, 1, rhType.components[1]);
				ret.setAt(2, 2, rhType.components[2]);
				ret.setAt(3, 3, 1);
				return ret;
			}
			break;
			case CINDER.TYPES.VEC4F: {
				var ret = new Matrix44f();
				ret.setAt(0, 0, rhType.components[0]);
				ret.setAt(1, 1, rhType.components[1]);
				ret.setAt(2, 2, rhType.components[2]);
				ret.setAt(3, 3, rhType.components[3]);
				return ret;
			}
			break;
			case CINDER.TYPES.VEC2I: {
				var ret = new Matrix44f();
				ret.setAt(0, 0, rhType.components[0]);
				ret.setAt(1, 1, rhType.components[1]);
				ret.setAt(2, 2, 1);
				ret.setAt(3, 3, 1);
				return ret;
			}
			break;
			case CINDER.TYPES.VEC3I: { 
				var ret = new Matrix44f();
				ret.setAt(0, 0, rhType.components[0]);
				ret.setAt(1, 1, rhType.components[1]);
				ret.setAt(2, 2, rhType.components[2]);
				ret.setAt(3, 3, 1);
				return ret;
			}
			break;
			case CINDER.TYPES.VEC4I: {
				var ret = new Matrix44f();
				ret.setAt(0, 0, rhType.components[0]);
				ret.setAt(1, 1, rhType.components[1]);
				ret.setAt(2, 2, rhType.components[2]);
				ret.setAt(3, 3, rhType.components[3]);
				return ret;
			}
			break;
			default: {
				throw "ERROR: Matrix44f.createScale - Don't know that type";
			}
		}
	}
	throw "ERROR: Matrix44f.createScale - Don't know that type";
};
Matrix44f.alignZAxisWithTarget = function (targetDirV3, upDirV3) {
	// Ensure that the target direction is non-zero.
    if( targetDirV3.lengthSquared() == 0 )
		targetDirV3 = Vec3f.zAxis();
	
    // Ensure that the up direction is non-zero.
    if( upDirV3.lengthSquared() == 0 )
		upDirV3 = Vec3f.yAxis();
	
    // Check for degeneracies.  If the upDir and targetDir are parallel 
    // or opposite, then compute a new, arbitrary up direction that is
    // not parallel or opposite to the targetDir.
    if( upDirV3.cross( targetDirV3 ).lengthSquared() == 0 ) {
		upDirV3 = targetDirV3.cross( Vec3f.xAxis() );
	if( upDirV3.lengthSquared() == 0 )
	    upDirV3 = targetDirV3.cross( Vec3f.zAxis() );
    }
	
    // Compute the x-, y-, and z-axis vectors of the new coordinate system.
    var targetPerpDir = upDirV3.cross( targetDirV3 );    
    var targetUpDir = targetDirV3.cross( targetPerpDir );
    
	
    // Rotate the x-axis into targetPerpDir (row 0),
    // rotate the y-axis into targetUpDir   (row 1),
    // rotate the z-axis into targetDir     (row 2).
    var row = [];

    row[0] = targetPerpDir.normalized();
    row[1] = targetUpDir.normalized();
    row[2] = targetDirV3.normalized();
    
    return new Matrix44f( 
    	row[0].components[0],  row[0].components[1],  row[0].components[2],  0,
		row[1].components[0],  row[1].components[1],  row[1].components[2],  0,
	    row[2].components[0],  row[2].components[1],  row[2].components[2],  0,
		0,           0,           0,           1 
	);
}

function Matrix44Base (arrayType, constructorType) {
	this.ARRAY_TYPE = arrayType;
	this.CONSTRUCTOR_TYPE = constructorType;
	this.DIM = 4;
	this.DIM_SQ = 4*4;
	this.EPSILON = 4.37114e-05;
	this.FLT_MIN = 1.1755e-38;
}

Matrix44Base.prototype.copy = function (rhsMatrix44) { this.components.set(rhsMatrix44.components); };
Matrix44Base.prototype.getComponents = function () { return this.components; },
Matrix44Base.prototype.constructor = Matrix44f;
Matrix44Base.prototype.copy = function (rhsMatrix44) { this.components.set(rhsMatrix44.components); };
Matrix44Base.prototype.clone = function () { return new this.CONSTRUCTOR_TYPE(this.components); };
Matrix44Base.prototype.setToNull = function () { this.components = new this.ARRAY_TYPE(16); };
Matrix44Base.prototype.setFromArray = function (array) { this.components = new this.ARRAY_TYPE(array); };
Matrix44Base.prototype.setFromMatrix44 = function (rhsMatrix44) { this.components = new this.ARRAY_TYPE(rhsMatrix44.components); };
Matrix44Base.prototype.setFromMatrix33 = function (rhsMatrix33) {
	this.setToIdentity();
	this.components[0] = rhsMatrix33.m00(); 
	this.components[4] = rhsMatrix33.m01(); 
	this.components[8] = rhsMatrix33.m02();
	this.components[1] = rhsMatrix33.m10(); 
	this.components[5] = rhsMatrix33.m11(); 
	this.components[9] = rhsMatrix33.m12();
	this.components[2] = rhsMatrix33.m20(); 
	this.components[6] = rhsMatrix33.m21(); 
	this.components[10] = rhsMatrix33.m22();
};
Matrix44Base.prototype.setToIdentity = function () {
	this.components = new this.ARRAY_TYPE([
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0.0, 0.0, 0.0, 1.0
	]);
};
Matrix44Base.prototype.setFromElements = function (d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15) {
	this.components = new this.ARRAY_TYPE([
		d0,  d1,  d2,  d3,
		d4,  d5,  d6,  d7,
		d8,  d9,  d10, d11,
		d12, d13, d14, d15
	]);
};
Matrix44Base.prototype.setFromVec3 = function (vec1, vec2, vec3) {
	this.components = new this.ARRAY_TYPE([
		vec1.components[0], vec1.components[1], vec1.components[2], 0,
		vec2.components[0], vec2.components[1], vec2.components[2], 0,
		vec3.components[0], vec3.components[1], vec3.components[2], 0,
		0,		  			0, 					0,		  			1 
	]);
};
Matrix44Base.prototype.setFromVec4 = function (vec1, vec2, vec3, vec4) {
	this.components = new this.ARRAY_TYPE([
		vec1.components[0], vec1.components[1], vec1.components[2], vec1.components[3],
		vec2.components[0], vec2.components[1], vec2.components[2], vec2.components[3],
		vec3.components[0], vec3.components[1], vec3.components[2], vec3.components[3],
		vec4.components[0], vec4.components[1], vec4.components[2], vec4.components[3]
	]);
};
Matrix44Base.prototype.m00 = function (m00) {
	if( m00 === undefined ) {
		return this.components[0];
	}
	else {
		return this.components[0] = m00;
	}
};
Matrix44Base.prototype.m01 = function (m01) {
	if( m01 === undefined ) {
		return this.components[4];
	}
	else {
		return this.components[4] = m01;
	}
};
Matrix44Base.prototype.m02 = function (m02) {
	if( m02 === undefined ) {
		return this.components[8];
	}
	else {
		return this.components[8] = m02;
	}
};
Matrix44Base.prototype.m03 = function (m03) {
	if( m03 === undefined ) {
		return this.components[12];
	}
	else {
		return this.components[12] = m03;
	}
};
Matrix44Base.prototype.m10 = function (m10) {
	if( m10 === undefined ) {
		return this.components[1];
	}
	else {
		return this.components[1] = m10;
	}
};
Matrix44Base.prototype.m11 = function (m11) {
	if( m11 === undefined ) {
		return this.components[5];
	}
	else {
		return this.components[5] = m11;
	}
};
Matrix44Base.prototype.m12 = function (m12) {
	if( m12 === undefined ) {
		return this.components[9];
	}
	else {
		return this.components[9] = m12;
	}
};
Matrix44Base.prototype.m13 = function (m13) {
	if( m13 === undefined ) {
		return this.components[13];
	}
	else {
		return this.components[13] = m13;
	}
};
Matrix44Base.prototype.m20 = function (m20) {
	if( m20 === undefined ) {
		return this.components[2];
	}
	else {
		return this.components[2] = m20;
	}
};
Matrix44Base.prototype.m21 = function (m21) {
	if( m21 === undefined ) {
		return this.components[6];
	}
	else {
		return this.components[6] = m21;
	}
};
Matrix44Base.prototype.m22 = function (m22) {
	if( m22 === undefined ) {
		return this.components[10];
	}
	else {
		return this.components[10] = m22;
	}
};
Matrix44Base.prototype.m23 = function (m23) {
	if( m23 === undefined ) {
		return this.components[14];
	}
	else {
		return this.components[14] = m23;
	}
};
Matrix44Base.prototype.m30 = function (m30) {
	if( m30 === undefined ) {
		return this.components[3];
	}
	else {
		return this.components[3] = m30;
	}
};
Matrix44Base.prototype.m31 = function (m31) {
	if( m31 === undefined ) {
		return this.components[7];
	}
	else {
		return this.components[7] = m31;
	}
};
Matrix44Base.prototype.m32 = function (m32) {
	if( m32 === undefined ) {
		return this.components[11];
	}
	else {
		return this.components[11] = m32;
	}
};
Matrix44Base.prototype.m33 = function (m33) {
	if( m33 === undefined ) {
		return this.components[15];
	}
	else {
		return this.components[15] = m33;
	}
};
Matrix44Base.prototype.mult = function (rhsMatrix44) {
	switch(rhsMatrix44.type) { 
		case CINDER.TYPES.VEC3F : { 
			var m = this.components;
			var x = m[ 0]*rhsMatrix44.components[0] + m[ 4]*rhsMatrix44.components[1] + m[ 8]*rhsMatrix44.components[2] + m[12];
			var y = m[ 1]*rhsMatrix44.components[0] + m[ 5]*rhsMatrix44.components[1] + m[ 9]*rhsMatrix44.components[2] + m[13];
			var z = m[ 2]*rhsMatrix44.components[0] + m[ 6]*rhsMatrix44.components[1] + m[10]*rhsMatrix44.components[2] + m[14];
			var w = m[ 3]*rhsMatrix44.components[0] + m[ 7]*rhsMatrix44.components[1] + m[11]*rhsMatrix44.components[2] + m[15];
			
			return new Vec3f( x/w, y/w, z/w );
		}
		break;
		case CINDER.TYPES.VEC4F : { 
			var m = this.components;
			return new Vec4f(
				m[ 0]*rhsMatrix44.components[0] + m[ 4]*rhsMatrix44.components[1] + m[ 8]*rhsMatrix44.components[2] + m[12]*rhsMatrix44.components[3],
				m[ 1]*rhsMatrix44.components[0] + m[ 5]*rhsMatrix44.components[1] + m[ 9]*rhsMatrix44.components[2] + m[13]*rhsMatrix44.components[3],
				m[ 2]*rhsMatrix44.components[0] + m[ 6]*rhsMatrix44.components[1] + m[10]*rhsMatrix44.components[2] + m[14]*rhsMatrix44.components[3],
				m[ 3]*rhsMatrix44.components[0] + m[ 7]*rhsMatrix44.components[1] + m[11]*rhsMatrix44.components[2] + m[15]*rhsMatrix44.components[3]
			);
		}
		break;
		case CINDER.TYPES.MAT4F : { 
			var ret = new this.CONSTRUCTOR_TYPE();
			var m = this.components;
	
			ret.components[ 0] = m[ 0]*rhsMatrix44.components[ 0] + m[ 4]*rhsMatrix44.components[ 1] + m[ 8]*rhsMatrix44.components[ 2] + m[12]*rhsMatrix44.components[ 3];
			ret.components[ 1] = m[ 1]*rhsMatrix44.components[ 0] + m[ 5]*rhsMatrix44.components[ 1] + m[ 9]*rhsMatrix44.components[ 2] + m[13]*rhsMatrix44.components[ 3];
			ret.components[ 2] = m[ 2]*rhsMatrix44.components[ 0] + m[ 6]*rhsMatrix44.components[ 1] + m[10]*rhsMatrix44.components[ 2] + m[14]*rhsMatrix44.components[ 3];
			ret.components[ 3] = m[ 3]*rhsMatrix44.components[ 0] + m[ 7]*rhsMatrix44.components[ 1] + m[11]*rhsMatrix44.components[ 2] + m[15]*rhsMatrix44.components[ 3];
		
			ret.components[ 4] = m[ 0]*rhsMatrix44.components[ 4] + m[ 4]*rhsMatrix44.components[ 5] + m[ 8]*rhsMatrix44.components[ 6] + m[12]*rhsMatrix44.components[ 7];
			ret.components[ 5] = m[ 1]*rhsMatrix44.components[ 4] + m[ 5]*rhsMatrix44.components[ 5] + m[ 9]*rhsMatrix44.components[ 6] + m[13]*rhsMatrix44.components[ 7];
			ret.components[ 6] = m[ 2]*rhsMatrix44.components[ 4] + m[ 6]*rhsMatrix44.components[ 5] + m[10]*rhsMatrix44.components[ 6] + m[14]*rhsMatrix44.components[ 7];
			ret.components[ 7] = m[ 3]*rhsMatrix44.components[ 4] + m[ 7]*rhsMatrix44.components[ 5] + m[11]*rhsMatrix44.components[ 6] + m[15]*rhsMatrix44.components[ 7];
		
			ret.components[ 8] = m[ 0]*rhsMatrix44.components[ 8] + m[ 4]*rhsMatrix44.components[ 9] + m[ 8]*rhsMatrix44.components[10] + m[12]*rhsMatrix44.components[11];
			ret.components[ 9] = m[ 1]*rhsMatrix44.components[ 8] + m[ 5]*rhsMatrix44.components[ 9] + m[ 9]*rhsMatrix44.components[10] + m[13]*rhsMatrix44.components[11];
			ret.components[10] = m[ 2]*rhsMatrix44.components[ 8] + m[ 6]*rhsMatrix44.components[ 9] + m[10]*rhsMatrix44.components[10] + m[14]*rhsMatrix44.components[11];
			ret.components[11] = m[ 3]*rhsMatrix44.components[ 8] + m[ 7]*rhsMatrix44.components[ 9] + m[11]*rhsMatrix44.components[10] + m[15]*rhsMatrix44.components[11];
		
			ret.components[12] = m[ 0]*rhsMatrix44.components[12] + m[ 4]*rhsMatrix44.components[13] + m[ 8]*rhsMatrix44.components[14] + m[12]*rhsMatrix44.components[15];
			ret.components[13] = m[ 1]*rhsMatrix44.components[12] + m[ 5]*rhsMatrix44.components[13] + m[ 9]*rhsMatrix44.components[14] + m[13]*rhsMatrix44.components[15];
			ret.components[14] = m[ 2]*rhsMatrix44.components[12] + m[ 6]*rhsMatrix44.components[13] + m[10]*rhsMatrix44.components[14] + m[14]*rhsMatrix44.components[15];
			ret.components[15] = m[ 3]*rhsMatrix44.components[12] + m[ 7]*rhsMatrix44.components[13] + m[11]*rhsMatrix44.components[14] + m[15]*rhsMatrix44.components[15];
	
			return ret;
		}
		break;
	}
};
Matrix44Base.prototype.multEq = function (rhsMatrix44) {
		var ret = new this.CONSTRUCTOR_TYPE();
		var m = this.components;

		ret.components[ 0] = m[ 0]*rhsMatrix44.components[ 0] + m[ 4]*rhsMatrix44.components[ 1] + m[ 8]*rhsMatrix44.components[ 2] + m[12]*rhsMatrix44.components[ 3];
		ret.components[ 1] = m[ 1]*rhsMatrix44.components[ 0] + m[ 5]*rhsMatrix44.components[ 1] + m[ 9]*rhsMatrix44.components[ 2] + m[13]*rhsMatrix44.components[ 3];
		ret.components[ 2] = m[ 2]*rhsMatrix44.components[ 0] + m[ 6]*rhsMatrix44.components[ 1] + m[10]*rhsMatrix44.components[ 2] + m[14]*rhsMatrix44.components[ 3];
		ret.components[ 3] = m[ 3]*rhsMatrix44.components[ 0] + m[ 7]*rhsMatrix44.components[ 1] + m[11]*rhsMatrix44.components[ 2] + m[15]*rhsMatrix44.components[ 3];
	
		ret.components[ 4] = m[ 0]*rhsMatrix44.components[ 4] + m[ 4]*rhsMatrix44.components[ 5] + m[ 8]*rhsMatrix44.components[ 6] + m[12]*rhsMatrix44.components[ 7];
		ret.components[ 5] = m[ 1]*rhsMatrix44.components[ 4] + m[ 5]*rhsMatrix44.components[ 5] + m[ 9]*rhsMatrix44.components[ 6] + m[13]*rhsMatrix44.components[ 7];
		ret.components[ 6] = m[ 2]*rhsMatrix44.components[ 4] + m[ 6]*rhsMatrix44.components[ 5] + m[10]*rhsMatrix44.components[ 6] + m[14]*rhsMatrix44.components[ 7];
		ret.components[ 7] = m[ 3]*rhsMatrix44.components[ 4] + m[ 7]*rhsMatrix44.components[ 5] + m[11]*rhsMatrix44.components[ 6] + m[15]*rhsMatrix44.components[ 7];
	
		ret.components[ 8] = m[ 0]*rhsMatrix44.components[ 8] + m[ 4]*rhsMatrix44.components[ 9] + m[ 8]*rhsMatrix44.components[10] + m[12]*rhsMatrix44.components[11];
		ret.components[ 9] = m[ 1]*rhsMatrix44.components[ 8] + m[ 5]*rhsMatrix44.components[ 9] + m[ 9]*rhsMatrix44.components[10] + m[13]*rhsMatrix44.components[11];
		ret.components[10] = m[ 2]*rhsMatrix44.components[ 8] + m[ 6]*rhsMatrix44.components[ 9] + m[10]*rhsMatrix44.components[10] + m[14]*rhsMatrix44.components[11];
		ret.components[11] = m[ 3]*rhsMatrix44.components[ 8] + m[ 7]*rhsMatrix44.components[ 9] + m[11]*rhsMatrix44.components[10] + m[15]*rhsMatrix44.components[11];
	
		ret.components[12] = m[ 0]*rhsMatrix44.components[12] + m[ 4]*rhsMatrix44.components[13] + m[ 8]*rhsMatrix44.components[14] + m[12]*rhsMatrix44.components[15];
		ret.components[13] = m[ 1]*rhsMatrix44.components[12] + m[ 5]*rhsMatrix44.components[13] + m[ 9]*rhsMatrix44.components[14] + m[13]*rhsMatrix44.components[15];
		ret.components[14] = m[ 2]*rhsMatrix44.components[12] + m[ 6]*rhsMatrix44.components[13] + m[10]*rhsMatrix44.components[14] + m[14]*rhsMatrix44.components[15];
		ret.components[15] = m[ 3]*rhsMatrix44.components[12] + m[ 7]*rhsMatrix44.components[13] + m[11]*rhsMatrix44.components[14] + m[15]*rhsMatrix44.components[15];
	
		for( var i = 0; i < this.DIM_SQ; ++i ) {
			m[i] = ret.components[i];
		}
};
Matrix44Base.prototype.multScalar = function (rhScalar) {
	var m = this.components;
	for( var i = 0; i < this.DIM_SQ; ++i ) {
		m[i] *= rhScalar;
	}
};
Matrix44Base.prototype.divScalar = function (rhScalar) {
	var m = this.components;
	var divScalar = 1/rhScalar;
	for (var i = 0; i < this.DIM_SQ; ++i) {
		m[i] *= divScalar;
	};
};
Matrix44Base.prototype.add = function (rhsMatrix44) {
	var ret = new this.CONSTRUCTOR_TYPE();
	var m = this.components;
	for( var i = 0; i < this.DIM_SQ; ++i ) {
		ret.components[i] = m[i] + rhsMatrix44.components[i];
	}
	return ret;
};
Matrix44Base.prototype.addEq = function (rhsMatrix44) {
	var m = this.components;
	for( var i = 0; i < this.DIM_SQ; ++i ) {
		m[i] += rhsMatrix44.components[i];
	}
};
Matrix44Base.prototype.addScalar = function (rhScalar) {
	var m = this.components;
	for( var i = 0; i < this.DIM_SQ; ++i ) {
		m[i] += rhScalar;
	}
};
Matrix44Base.prototype.sub = function (rhsMatrix44) {
	var ret = new this.CONSTRUCTOR_TYPE();
	var m = this.components;
	for( var i = 0; i < this.DIM_SQ; ++i ) {
		ret.components[i] = m[i] - rhsMatrix44.components[i];
	}
	return ret;
};
Matrix44Base.prototype.subEq = function (rhsMatrix44) {
	var m = this.components;
	for( var i = 0; i < this.DIM_SQ; ++i ) {
		m[i] -= rhsMatrix44.components[i];
	}
};
Matrix44Base.prototype.subScalar = function (rhScalar) {
	var m = this.components;
	for( var i = 0; i < this.DIM_SQ; ++i ) {
		m[i] -= rhScalar;
	}
};
Matrix44Base.prototype.at = function (row, col) {
	if( row >= 0 && row < this.DIM && col >= 0 && col < this.DIM ) {
		return this.components[col * 4 + row];
	} 
};
Matrix44Base.prototype.setAt = function (row, col, value) {
	if( row >= 0 && row < this.DIM && col >= 0 && col < this.DIM ) {
		this.components[col * 4 + row] = value;
	} 
};
Matrix44Base.prototype.getColumn = function (col) {
	var i = col*this.DIM;
	// TODO: Decide whether this should be typed
	return new Vec4f(
		this.components[i+0], 
		this.components[i+1], 
		this.components[i+2], 
		this.components[i+3]
	);
};
Matrix44Base.prototype.setColumn = function (col, rhVec4) {
	var i = col*this.DIM;
	this.components[i+0] = rhVec4.components[0];
	this.components[i+1] = rhVec4.components[1];
	this.components[i+2] = rhVec4.components[2];
	this.components[i+3] = rhVec4.components[3];
};
Matrix44Base.prototype.getRow = function (row) {
	// TODO: Decide whether this should be typed
	return new Vec4f( 
		this.components[row + 0], 
		this.components[row + 4], 
		this.components[row + 8], 
		this.components[row + 12]
	);
};
Matrix44Base.prototype.setRow = function (row, rhVec4) {
	this.components[row + 0] = rhVec4.components[0];
	this.components[row + 4] = rhVec4.components[1];
	this.components[row + 8] = rhVec4.components[2];
	this.components[row + 12] = rhVec4.components[3];
};
Matrix44Base.prototype.getRows = function () {
	var array = [];
	array.push( this.getRow( 0 ) );
	array.push( this.getRow( 1 ) );
	array.push( this.getRow( 2 ) );
	array.push( this.getRow( 3 ) );
	return array;
};
Matrix44Base.prototype.setRows = function (r0Vec4, r1Vec4, r2Vec4, r3Vec4) {
	this.setRow(0, r0Vec4);
	this.setRow(1, r1Vec4);
	this.setRow(2, r2Vec4);
	this.setRow(3, r3Vec4);
};
Matrix44Base.prototype.getColumns = function () {
	var array = [];
	array.push( this.getColumn( 0 ) );
	array.push( this.getColumn( 1 ) );
	array.push( this.getColumn( 2 ) );
	array.push( this.getColumn( 3 ) );
	return array;
};
Matrix44Base.prototype.setColumns = function (r0Vec4, r1Vec4, r2Vec4, r3Vec4) {
	setColumn(0, r0Vec4);
	setColumn(1, r1Vec4);
	setColumn(2, r2Vec4);
	setColumn(3, r3Vec4);
};
Matrix44Base.prototype.subMatrix22 = function (row, col) {
	// TODO: Decide whether to implement typed for this
	var ret = new Matrix22f();
	ret.setToNull();

	for( var i = 0; i < 2; ++i ) {
		var r = row + i;
		if( r >= 4 ) {
			continue;
		}
		for( var j = 0; j < 2; ++j ) {
			var c = col + j;
			if( c >= 4 ) {
				continue;
			}
			ret.setAt( i, j, this.at( r, c ) );
		}
	}
	return ret;
};
Matrix44Base.prototype.subMatrix33 = function (row, col) {
	// TODO: Decide whether to implement typed for this
	var ret = new Matrix33f();
	ret.setToNull();

	for( var i = 0; i < 3; ++i ) {
		var r = row + i;
		if( r >= 4 ) {
			continue;
		}
		for( var j = 0; j < 3; ++j ) {
			var c = col + j;
			if( c >= 4 ) {
				continue;
			}
			ret.setAt( i, j, this.at( r, c ) );
		}
	}
	return ret;
};
Matrix44Base.prototype.determinant = function () {
	var m = this.components;

	var a0 = m[ 0]*m[ 5] - m[ 1]*m[ 4];
	var a1 = m[ 0]*m[ 6] - m[ 2]*m[ 4];
	var a2 = m[ 0]*m[ 7] - m[ 3]*m[ 4];
	var a3 = m[ 1]*m[ 6] - m[ 2]*m[ 5];
	var a4 = m[ 1]*m[ 7] - m[ 3]*m[ 5];
	var a5 = m[ 2]*m[ 7] - m[ 3]*m[ 6];
	var b0 = m[ 8]*m[13] - m[ 9]*m[12];
	var b1 = m[ 8]*m[14] - m[10]*m[12];
	var b2 = m[ 8]*m[15] - m[11]*m[12];
	var b3 = m[ 9]*m[14] - m[10]*m[13];
	var b4 = m[ 9]*m[15] - m[11]*m[13];
	var b5 = m[10]*m[15] - m[11]*m[14];

	var det = a0*b5 - a1*b4 + a2*b3 + a3*b2 - a4*b1 + a5*b0;

	return det;
};
Matrix44Base.prototype.trace = function (shouldFullTrace) {
	if( shouldFullTrace ) {
		return this.components[0] + this.components[5] + this.components[10] + this.components[15];
	}
	return this.components[0] + this.components[5] + this.components[10];
};
Matrix44Base.prototype.diagonal = function () {
	var ret = new this.CONSTRUCTOR_TYPE();
	ret.setToNull();

	ret.components[0] = this.components[0];
	ret.components[5] = this.components[5];
	ret.components[10] = this.components[10];
	ret.components[15] = this.components[15];
	return ret;
};
Matrix44Base.prototype.lowerTriangular = function () {
	var ret = new this.CONSTRUCTOR_TYPE();
	ret.setToNull();

	ret.components[0] = this.components[0];
	ret.components[1] = this.components[1];
	ret.components[2] = this.components[2];
	ret.components[3] = this.components[3];
	ret.components[5] = this.components[5];
	ret.components[6] = this.components[6];
	ret.components[7] = this.components[7];
	ret.components[10] = this.components[10];
	ret.components[11] = this.components[11];
	ret.components[15] = this.components[15];

	return ret;
};
Matrix44Base.prototype.upperTriangular = function () {
	var ret = new this.CONSTRUCTOR_TYPE();
	ret.setToNull();

	ret.components[0] = this.components[0];
	ret.components[4] = this.components[4];
	ret.components[8] = this.components[8];
	ret.components[12] = this.components[12];
	ret.components[5] = this.components[5];
	ret.components[9] = this.components[9];
	ret.components[13] = this.components[13];
	ret.components[10] = this.components[10];
	ret.components[14] = this.components[14];
	ret.components[15] = this.components[15];

	return ret;
};
Matrix44Base.prototype.transpose = function () {
	var t;
	t = this.components[ 4]; this.components[ 4] = this.components[ 1]; this.components[ 1] = t;
	t = this.components[ 8]; this.components[ 8] = this.components[ 2]; this.components[ 2] = t;
	t = this.components[12]; this.components[12] = this.components[ 3]; this.components[ 3] = t;
	t = this.components[ 9]; this.components[ 9] = this.components[ 6]; this.components[ 6] = t;
	t = this.components[13]; this.components[13] = this.components[ 7]; this.components[ 7] = t;
	t = this.components[14]; this.components[14] = this.components[11]; this.components[11] = t;
};
Matrix44Base.prototype.transposed = function () {
	var m = this.components;
	return new this.CONSTRUCTOR_TYPE([
		m[ 0], m[ 4], m[ 8], m[12],
		m[ 1], m[ 5], m[ 9], m[13],
		m[ 2], m[ 6], m[10], m[14],
		m[ 3], m[ 7], m[11], m[15]
	]);
};
Matrix44Base.prototype.invert = function (epsilon) { this.components.set(this.inverted(epsilon).components); },
Matrix44Base.prototype.inverted = function (epsilon) {
	var m = this.components;

	var inv = new this.CONSTRUCTOR_TYPE();
	inv.setToNull();

	var a0 = m[ 0]*m[ 5] - m[ 1]*m[ 4];
	var a1 = m[ 0]*m[ 6] - m[ 2]*m[ 4];
	var a2 = m[ 0]*m[ 7] - m[ 3]*m[ 4];
	var a3 = m[ 1]*m[ 6] - m[ 2]*m[ 5];
	var a4 = m[ 1]*m[ 7] - m[ 3]*m[ 5];
	var a5 = m[ 2]*m[ 7] - m[ 3]*m[ 6];
	var b0 = m[ 8]*m[13] - m[ 9]*m[12];
	var b1 = m[ 8]*m[14] - m[10]*m[12];
	var b2 = m[ 8]*m[15] - m[11]*m[12];
	var b3 = m[ 9]*m[14] - m[10]*m[13];
	var b4 = m[ 9]*m[15] - m[11]*m[13];
	var b5 = m[10]*m[15] - m[11]*m[14];

	var det = a0*b5 - a1*b4 + a2*b3 + a3*b2 - a4*b1 + a5*b0;
	
	if( Math.abs( det ) > (epsilon || this.FLT_MIN) ) {
		var newM = inv.getComponents();

		newM[ 0] = + m[ 5]*b5 - m[ 6]*b4 + m[ 7]*b3;
		newM[ 4] = - m[ 4]*b5 + m[ 6]*b2 - m[ 7]*b1;
		newM[ 8] = + m[ 4]*b4 - m[ 5]*b2 + m[ 7]*b0;
		newM[12] = - m[ 4]*b3 + m[ 5]*b1 - m[ 6]*b0;
		newM[ 1] = - m[ 1]*b5 + m[ 2]*b4 - m[ 3]*b3;
		newM[ 5] = + m[ 0]*b5 - m[ 2]*b2 + m[ 3]*b1;
		newM[ 9] = - m[ 0]*b4 + m[ 1]*b2 - m[ 3]*b0;
		newM[13] = + m[ 0]*b3 - m[ 1]*b1 + m[ 2]*b0;
		newM[ 2] = + m[13]*a5 - m[14]*a4 + m[15]*a3;
		newM[ 6] = - m[12]*a5 + m[14]*a2 - m[15]*a1;
		newM[10] = + m[12]*a4 - m[13]*a2 + m[15]*a0;
		newM[14] = - m[12]*a3 + m[13]*a1 - m[14]*a0;
		newM[ 3] = - m[ 9]*a5 + m[10]*a4 - m[11]*a3;
		newM[ 7] = + m[ 8]*a5 - m[10]*a2 + m[11]*a1;
		newM[11] = - m[ 8]*a4 + m[ 9]*a2 - m[11]*a0;
		newM[15] = + m[ 8]*a3 - m[ 9]*a1 + m[10]*a0;

		var invDet = 1 / det;
		newM[ 0] *= invDet;
		newM[ 1] *= invDet;
		newM[ 2] *= invDet;
		newM[ 3] *= invDet;
		newM[ 4] *= invDet;
		newM[ 5] *= invDet;
		newM[ 6] *= invDet;
		newM[ 7] *= invDet;
		newM[ 8] *= invDet;
		newM[ 9] *= invDet;
		newM[10] *= invDet;
		newM[11] *= invDet;
		newM[12] *= invDet;
		newM[13] *= invDet;
		newM[14] *= invDet;
		newM[15] *= invDet;
	}
	
	return inv;
};
Matrix44Base.prototype.preMultiply = function (rhVec) {
	switch(rhVec.type) {
		case CINDER.TYPES.VEC3F: { 
			return new Vec3f(
				rhVec.components[0]*this.components[0] + rhVec.components[1]*this.components[1] + rhVec.components[2]*this.components[2],
				rhVec.components[0]*this.components[4] + rhVec.components[1]*this.components[5] + rhVec.components[2]*this.components[6],
				rhVec.components[0]*this.components[8] + rhVec.components[1]*this.components[9] + rhVec.components[2]*this.components[10]
			);
		}
		break;
		case CINDER.TYPES.VEC4F: { 
			return new Vec4f(
				rhVec.components[0]*this.components[ 0] + rhVec.components[1]*this.components[ 1] + rhVec.components[2]*this.components[ 2] + rhVec.components[3]*this.components[ 3],
				rhVec.components[0]*this.components[ 4] + rhVec.components[1]*this.components[ 5] + rhVec.components[2]*this.components[ 6] + rhVec.components[3]*this.components[ 7],
				rhVec.components[0]*this.components[ 8] + rhVec.components[1]*this.components[ 9] + rhVec.components[2]*this.components[10] + rhVec.components[3]*this.components[11],
				rhVec.components[0]*this.components[12] + rhVec.components[1]*this.components[13] + rhVec.components[2]*this.components[14] + rhVec.components[3]*this.components[15]
			);
		}
		break;
	}	
};
Matrix44Base.prototype.postMultiply = function (rhVec) {
	switch(rhVec.type) {
		case CINDER.TYPES.VEC3F: { 
			return new Vec3f(
				this.components[0]*rhVec.components[0] + this.components[4]*rhVec.components[1] + this.components[8]*rhVec.components[2],
				this.components[1]*rhVec.components[0] + this.components[5]*rhVec.components[1] + this.components[9]*rhVec.components[2],
				this.components[2]*rhVec.components[0] + this.components[6]*rhVec.components[1] + this.components[10]*rhVec.components[2]
			);
		} 
		break;
		case CINDER.TYPES.VEC4F: { 
			return new Vec4f(
				this.components[0]*rhVec.components[0] + this.components[4]*rhVec.components[1] + this.components[ 8]*rhVec.components[2] + this.components[12]*rhVec.components[3],
				this.components[1]*rhVec.components[0] + this.components[5]*rhVec.components[1] + this.components[ 9]*rhVec.components[2] + this.components[13]*rhVec.components[3],
				this.components[2]*rhVec.components[0] + this.components[6]*rhVec.components[1] + this.components[10]*rhVec.components[2] + this.components[14]*rhVec.components[3],
				this.components[3]*rhVec.components[0] + this.components[7]*rhVec.components[1] + this.components[11]*rhVec.components[2] + this.components[15]*rhVec.components[3]
			);
		}
		break;
	}
};
Matrix44Base.prototype.affineInvert = function () { this.components.set(affineInverted().components); },
Matrix44Base.prototype.affineInverted = function () {
	var ret = new this.CONSTRUCTOR_TYPE();
	var m = this.components;
	var retM = ret.getComponents();

	// compute upper left 3x3 matrix determinant
	var cofactor0 = m[ 5]*m[10] - m[6]*m[ 9];
	var cofactor4 = m[ 2]*m[ 9] - m[1]*m[10];
	var cofactor8 = m[ 1]*m[ 6] - m[2]*m[ 5];
	var det = m[0]*cofactor0 + m[4]*cofactor4 + m[8]*cofactor8;
	if( Math.abs( det ) <= this.EPSILON ) {
		return ret;
	}

	// create adjunct matrix and multiply by 1/det to get upper 3x3
	var invDet = 1 / det;
	retM[ 0] = invDet*cofactor0;
	retM[ 1] = invDet*cofactor4;
	retM[ 2] = invDet*cofactor8;

	retM[ 4] = invDet*(m[ 6]*m[ 8] - m[ 4]*m[10]);
	retM[ 5] = invDet*(m[ 0]*m[10] - m[ 2]*m[ 8]);
	retM[ 6] = invDet*(m[ 2]*m[ 4] - m[ 0]*m[ 6]);

	retM[ 8] = invDet*(m[ 4]*m[ 9] - m[ 5]*m[ 8]);
	retM[ 9] = invDet*(m[ 1]*m[ 8] - m[ 0]*m[ 9]);
	retM[10] = invDet*(m[ 0]*m[ 5] - m[ 1]*m[ 4]);

	// multiply -translation by inverted 3x3 to get its inverse	    
	retM[12] = -retM[ 0]*m[12] - retM[ 4]*m[13] - retM[ 8]*m[14];
	retM[13] = -retM[ 1]*m[12] - retM[ 5]*m[13] - retM[ 9]*m[14];
	retM[14] = -retM[ 2]*m[12] - retM[ 6]*m[13] - retM[10]*m[14];

	return ret;
},
Matrix44Base.prototype.orthonormalInvert = function () {
	var m1 = this.at(0,1);
	var m2 = this.at(1,0);
	this.setAt(0, 1, m2); this.setAt(1, 0, m1);
	m1 = this.at(0, 2);
	m2 = this.at(2, 0);
	this.setAt(0, 2, m2); this.setAt(2, 0, m1);
	m1 = this.at(1, 2);
	m2 = this.at(2, 1);
	this.setAt(1, 2, m2); this.setAt(2, 1, m1);
	// TODO: Decide if this should be typed
	var newT = new Vec3f( transformVec( new Vec3f(-this.at(0,3),-this.at(1,3),-this.at(2,3) ) ) );
	this.setAt(0, 3, newT.components[0]);
	this.setAt(1, 3, newT.components[1]);
	this.setAt(2, 3, newT.components[2]);
};
Matrix44Base.prototype.orthonormalInverted = function () {
	var ret = this.clone();
	ret.orthonormalInvert();
	return ret;
};
Matrix44Base.prototype.transformPoint = function (rhVec3f) {
	var x = this.components[0]*rhVec3f.components[0] + this.components[4]*rhVec3f.components[1] + this.components[8]*rhVec3f.components[2] + this.components[12];
	var y = this.components[1]*rhVec3f.components[0] + this.components[5]*rhVec3f.components[1] + this.components[9]*rhVec3f.components[2] + this.components[13];
	var z = this.components[2]*rhVec3f.components[0] + this.components[6]*rhVec3f.components[1] + this.components[10]*rhVec3f.components[2] + this.components[14];
	var w = this.components[3]*rhVec3f.components[0] + this.components[7]*rhVec3f.components[1] + this.components[11]*rhVec3f.components[2] + this.components[15];
	// TODO: Decide if this should be typed
	return new Vec3f( x / w, y / w, z / w );
};
Matrix44Base.prototype.transformPointAffine = function (rhVec3f) {
	var x = this.components[0]*rhVec3f.components[0] + this.components[4]*rhVec3f.components[1] + this.components[8]*rhVec3f.components[2] + this.components[12];
	var y = this.components[1]*rhVec3f.components[0] + this.components[5]*rhVec3f.components[1] + this.components[9]*rhVec3f.components[2] + this.components[13];
	var z = this.components[2]*rhVec3f.components[0] + this.components[6]*rhVec3f.components[1] + this.components[10]*rhVec3f.components[2] + this.components[14];
	// TODO: Decide if this should be typed
	return new Vec3f( x, y, z );
};
Matrix44Base.prototype.transformVec = function (rhVec) {
	var x = this.components[0]*rhVec.components[0] + this.components[4]*rhVec.components[1] + this.components[8]*rhVec.components[2];
	var y = this.components[1]*rhVec.components[0] + this.components[5]*rhVec.components[1] + this.components[9]*rhVec.components[2];
	var z = this.components[2]*rhVec.components[0] + this.components[6]*rhVec.components[1] + this.components[10]*rhVec.components[2];
	// TODO: Decide if this should be typed
	return new Vec3f( x, y, z );
};
Matrix44Base.prototype.getTranslate = function () {
	return new Vec4f( 
		this.components[12], this.components[13], 
		this.components[14], this.components[15] 
	);
};
Matrix44Base.prototype.setTranslate = function (rhVec) {
		this.components[12] = rhVec.components[0];
		this.components[13] = rhVec.components[1];
		this.components[14] = rhVec.components[2];
};
Matrix44Base.prototype.translate = function (rhVec) { this.multEq( this.CONSTRUCTOR_TYPE.createTranslation(rhVec) ); },
Matrix44Base.prototype.rotate = function (rhVec, radians) { this.multEq( this.CONSTRUCTOR_TYPE.createRotation(rhVec, radians) ); },	
Matrix44Base.prototype.rotateEuler = function (rhVec) { this.multEq( this.CONSTRUCTOR_TYPE.createRotationEuler(rhVec) ); },
Matrix44Base.prototype.rotateFromTo = function (fromVec, toVec, worldUpVec) { this.multEq( this.CONSTRUCTOR_TYPE.createRotationFromTo(fromVec, toVec, worldUpVec) ); };
Matrix44Base.prototype.scale = function (rhType) {
	if( rhType.type !== undefined ) {
		this.multEq( this.CONSTRUCTOR_TYPE.createScale(rhType) );
	}
	else {
		var opM = this.CONSTRUCTOR_TYPE.createScale( rhType );
		var mat = this;
		mat = opM.mult(mat);
	}
};
Matrix44Base.prototype.invertTransform = function () {	
};
Matrix44Base.prototype.toS = function () {
	var m = this.components;
	return "| " + m[ 0] + ", " + m[ 4] + ", " + m[ 8] + ", " + m[12] + " |\n"
		   "| " + m[ 1] + ", " + m[ 5] + ", " + m[ 9] + ", " + m[13] + " |\n"
		   "| " + m[ 2] + ", " + m[ 6] + ", " + m[10] + ", " + m[14] + " |\n"
		   "| " + m[ 3] + ", " + m[ 7] + ", " + m[11] + ", " + m[15] + " |\n";
};