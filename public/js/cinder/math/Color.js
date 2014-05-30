function Color8u (d0, d1, d2) {
	ColorBaseRGB.call(this, Uint8Array, Color8u);
	this.type = CINDER.TYPES.C8U;

	if( arguments.length === 0 ) {
		this.setToNull();
	}
	else if( arguments.length === 1 ) {
		if( d0.type !== undefined ) {
			if( d0.components.length === 3 ) {
				this.setFromColor(d0);
			}
			else if( d0.components.length === 4 ) {
				this.setFromColorA(d0);
			}
		}
	}
	else if( arguments.length === 3 ) {
		this.setFromElements(d0, d1, d2);
	}

	return this;
};
Color8u.prototype = Object.create( ColorBaseRGB.prototype );
Color8u.black = function () { return new Color8u( 0, 0, 0 ); };
Color8u.white = function () { return new Color8u( 255, 255, 255 ); };
Color8u.gray = function ( value ) { return new Color8u( value, value, value ); };
Color8u.hex = function ( hexValue ) {
	var r = ( hexValue >> 16 ) & 255;
	var g = ( hexValue >> 8 ) & 255;
	var b = hexValue & 255;
	return new Color8u( r, g, b );
};


function Color (d0, d1, d2) {
	ColorBaseRGB.call(this, Float32Array, Color);
	this.type = CINDER.TYPES.CF;

	if( arguments.length === 0 ) {
		this.setToNull();
	}
	else if( arguments.length === 1 ) {
		if( d0.type !== undefined ) {
			if( d0.components.length === 3 ) {
				this.setFromColor(d0);
			}
			else if( d0.components.length === 4 ) {
				this.setFromColorA(d0);
			}
		}
		
	}
	else if( arguments.length === 3 ) {
		this.setFromElements(d0, d1, d2);
	}

	return this;
};
Color.prototype = Object.create( ColorBaseRGB.prototype );
Color.black = function () { return new Color( 0, 0, 0 ); };
Color.white = function () { return new Color( 1.0, 1.0, 1.0 ); };
Color.gray = function ( value ) { return new Color( value, value, value ); };
Color.hex = function ( hexValue ) {
	var r = ( hexValue >> 16 ) & 255;
	var g = ( hexValue >> 8 ) & 255;
	var b = hexValue & 255;
	return new Color( r / 255, g / 255, b / 255 );
};

function ColorA8u (d0, d1, d2, d3) {
	ColorBaseRGBA.call(this, Float32Array, ColorA8u);
	this.type = CINDER.TYPES.C8A;

	if( arguments.length === 0 ) {
		this.setToNull();
	}
	else if( arguments.length === 1 ) {
		if( d0.type !== undefined ) {
			if( d0.components.length === 3 ) {
				this.setFromColor(d0);
			}
			else if( d0.components.length === 4 ) {
				this.setFromColorA(d0);
			}
		}
	}
	else if( arguments.length === 2 ) {
		this.setFromColor(d0, d1);
	}
	else if( arguments.length === 4 ) {
		this.setFromElements(d0, d1, d2);
	}

	return this;
};
ColorA8u.prototype = Object.create( ColorBaseRGB.prototype );
ColorA8u.black = function () { return new ColorA8u( 0, 0, 0 ); };
ColorA8u.white = function () { return new ColorA8u( 255, 255, 255 ); };
ColorA8u.gray = function ( value ) { return new ColorA8u( value, value, value ); };
ColorA8u.hex = function ( hexValue ) {
	var r = ( hexValue >> 16 ) & 255;
	var g = ( hexValue >> 8 ) & 255;
	var b = hexValue & 255;
	return new ColorA8u( r, g, b );
};


function ColorA (d0, d1, d2, d3) {
	ColorBaseRGBA.call(this, Float32Array, ColorA);
	this.type = CINDER.TYPES.CFA;

	if( arguments.length === 0 ) {
		this.setToNull();
	}
	else if( arguments.length === 1 ) {
		if( d0.type !== undefined ) {
			if( d0.components.length === 3 ) {
				this.setFromColor(d0);
			}
			else if( d0.components.length === 4 ) {
				this.setFromColorA(d0);
			}
		}
		
	}
	else if( arguments.length === 4 ) {
		this.setFromElements(d0, d1, d2, d3);
	}

	return this;
};
ColorA.prototype = Object.create( ColorBaseRGBA.prototype );
ColorA.black = function () { return new ColorA( 0, 0, 0, 0 ); };
ColorA.white = function () { return new ColorA( 1.0, 1.0, 1.0, 1.0 ); };
ColorA.gray = function ( value ) { return new ColorA( value, value, value, value ); };
ColorA.hex = function ( hexValue ) {
	var r = ( hexValue >> 16 ) & 255;
	var g = ( hexValue >> 8 ) & 255;
	var b = hexValue & 255;
	return new ColorA( r / 255, g / 255, b / 255 );
};

function ColorBaseRGB (arrayType, constructorType) {
	this.ARRAY_TYPE = arrayType;
	this.CONSTUCTOR_TYPE = constructorType;
};

ColorBaseRGB.prototype.constructor = ColorBaseRGB;
ColorBaseRGB.prototype.setFromElements = function (r, g, b) { this.components = new this.ARRAY_TYPE([ r, g, b ]); };
ColorBaseRGB.prototype.setFromColorA = function (colorA) { 
	this.components = new this.ARRAY_TYPE([colorA.components[0], colorA.components[1], colorA.components[2]]); 
};
ColorBaseRGB.prototype.setFromColor = function (color) { this.components = new this.ARRAY_TYPE(color.components); };
ColorBaseRGB.prototype.setToNull = function () { this.components = new this.ARRAY_TYPE([ 0, 0, 0 ]); };
ColorBaseRGB.prototype.copy = function (color) { this.components.set(this.CONSTUCTOR_TYPE(color.components)); };
ColorBaseRGB.prototype.r = function (r) {
	if( r !== undefined ) {
		return this.components[0] = r;
	}
	else {
		return this.components[0];
	}
};
ColorBaseRGB.prototype.g = function (g) {
	if( g !== undefined ) {
		return this.components[1] = g;
	}
	else {
		return this.components[1];
	}
};
ColorBaseRGB.prototype.b = function (b) {
	if( b !== undefined) {
		return this.components[2] = b;
	}
	else {
		return this.components[2];
	}
};
ColorBaseRGB.prototype.equals = function (color) {
	return this.components[0] === color.components[0] &&
			this.components[1] === color.components[1] &&
			this.components[2] === color.components[2];
}
ColorBaseRGB.prototype.add = function (color) {
	if( this.ARRAY_TYPE === color.ARRAY_TYPE ) {
		return new this.CONSTUCTOR_TYPE( 
			this.components[0] + color.components[0],
			this.components[1] + color.components[1],
			this.components[2] + color.components[2]
		)
	}
	else {
		if( this.ARRAY_TYPE.BYTES_PER_ELEMENT > color.ARRAY_TYPE.BYTES_PER_ELEMENT) {
			return new this.CONSTUCTOR_TYPE(
				color.components[0] + (this.components[0] * 255),
				color.components[1] + (this.components[1] * 255),
				color.components[2] + (this.components[2] * 255)
			);
		}
		else {
			return new this.CONSTUCTOR_TYPE(
				this.components[0] + (color.components[0] * 255),
				this.components[1] + (color.components[1] * 255),
				this.components[2] + (color.components[2] * 255)
			);
		}
	}
};
ColorBaseRGB.prototype.addEq = function (color) {
	if( this.ARRAY_TYPE === color.ARRAY_TYPE ) {
		this.components[0] += color.components[0];
		this.components[1] += color.components[1];
		this.components[2] += color.components[2];
	}
	else {
		if( this.ARRAY_TYPE.BYTES_PER_ELEMENT > color.ARRAY_TYPE.BYTES_PER_ELEMENT) {
			this.components[0] += (color.components[0] / 255);
			this.components[1] += (color.components[1] / 255);
			this.components[2] += (color.components[2] / 255);
		}
		else {
			this.components[0] += (color.components[0] * 255);
			this.components[1] += (color.components[1] * 255);
			this.components[2] += (color.components[2] * 255);
		}
	}
};
ColorBaseRGB.prototype.addScalar = function (scalar) {
	return new this.CONSTUCTOR_TYPE(
		this.components[0] + scalar,
		this.components[1] + scalar,
		this.components[2] + scalar
	);
};
ColorBaseRGB.prototype.sub = function (color) {
	if( this.ARRAY_TYPE === color.ARRAY_TYPE ) {
		return new this.CONSTUCTOR_TYPE( 
			this.components[0] - color.components[0],
			this.components[1] - color.components[1],
			this.components[2] - color.components[2]
		)
	}
	else {
		if( this.ARRAY_TYPE.BYTES_PER_ELEMENT > color.ARRAY_TYPE.BYTES_PER_ELEMENT) {
			return new this.CONSTUCTOR_TYPE(
				color.components[0] - (this.components[0] * 255),
				color.components[1] - (this.components[1] * 255),
				color.components[2] - (this.components[2] * 255)
			);
		}
		else {
			return new this.CONSTUCTOR_TYPE(
				this.components[0] - (color.components[0] * 255),
				this.components[1] - (color.components[1] * 255),
				this.components[2] - (color.components[2] * 255)
			);
		}
	}
};
ColorBaseRGB.prototype.subEq = function (color) {
	if( this.ARRAY_TYPE === color.ARRAY_TYPE ) {
		this.components[0] -= color.components[0];
		this.components[1] -= color.components[1];
		this.components[2] -= color.components[2];
	}
	else {
		if( this.ARRAY_TYPE.BYTES_PER_ELEMENT > color.ARRAY_TYPE.BYTES_PER_ELEMENT) {
			this.components[0] -= (color.components[0] / 255);
			this.components[1] -= (color.components[1] / 255);
			this.components[2] -= (color.components[2] / 255);
		}
		else {
			this.components[0] -= (color.components[0] * 255);
			this.components[1] -= (color.components[1] * 255);
			this.components[2] -= (color.components[2] * 255);
		}
	}
};
ColorBaseRGB.prototype.subScalar = function (scalar) {
	return new this.CONSTUCTOR_TYPE(
		this.components[0] - scalar,
		this.components[1] - scalar,
		this.components[2] - scalar
	);
};
ColorBaseRGB.prototype.mult = function (color) {
	if( this.ARRAY_TYPE === color.ARRAY_TYPE ) {
		return new this.CONSTUCTOR_TYPE( 
			this.components[0] * color.components[0],
			this.components[1] * color.components[1],
			this.components[2] * color.components[2]
		)
	}
	else {
		if( this.ARRAY_TYPE.BYTES_PER_ELEMENT > color.ARRAY_TYPE.BYTES_PER_ELEMENT) {
			return new this.CONSTUCTOR_TYPE(
				color.components[0] * (this.components[0] * 255),
				color.components[1] * (this.components[1] * 255),
				color.components[2] * (this.components[2] * 255)
			);
		}
		else {
			return new this.CONSTUCTOR_TYPE(
				this.components[0] * (color.components[0] * 255),
				this.components[1] * (color.components[1] * 255),
				this.components[2] * (color.components[2] * 255)
			);
		}
	}
};
ColorBaseRGB.prototype.multEq = function (color) {
	if( this.ARRAY_TYPE === color.ARRAY_TYPE ) {
		this.components[0] *= color.components[0];
		this.components[1] *= color.components[1];
		this.components[2] *= color.components[2];
	}
	else {
		if( this.ARRAY_TYPE.BYTES_PER_ELEMENT > color.ARRAY_TYPE.BYTES_PER_ELEMENT) {
			this.components[0] *= (color.components[0] / 255);
			this.components[1] *= (color.components[1] / 255);
			this.components[2] *= (color.components[2] / 255);
		}
		else {
			this.components[0] *= (color.components[0] * 255);
			this.components[1] *= (color.components[1] * 255);
			this.components[2] *= (color.components[2] * 255);
		}
	}
};
ColorBaseRGB.prototype.multScalar = function (scalar) {
	return new this.CONSTUCTOR_TYPE(
		this.components[0] * scalar,
		this.components[1] * scalar,
		this.components[2] * scalar
	);
};
ColorBaseRGB.prototype.multScalarEq = function (scalar) {
	this.components[0] *= scalar;
	this.components[1] *= scalar;
	this.components[2] *= scalar;
};
ColorBaseRGB.prototype.div = function (color) {
	if( this.ARRAY_TYPE === color.ARRAY_TYPE ) {
		return new this.CONSTUCTOR_TYPE( 
			this.components[0] / color.components[0],
			this.components[1] / color.components[1],
			this.components[2] / color.components[2]
		)
	}
	else {
		if( this.ARRAY_TYPE.BYTES_PER_ELEMENT > color.ARRAY_TYPE.BYTES_PER_ELEMENT) {
			return new this.CONSTUCTOR_TYPE(
				color.components[0] / (this.components[0] * 255),
				color.components[1] / (this.components[1] * 255),
				color.components[2] / (this.components[2] * 255)
			);
		}
		else {
			return new this.CONSTUCTOR_TYPE(
				this.components[0] / (color.components[0] * 255),
				this.components[1] / (color.components[1] * 255),
				this.components[2] / (color.components[2] * 255)
			);
		}
	}
};
ColorBaseRGB.prototype.divEq = function (color) {
	if( this.ARRAY_TYPE === color.ARRAY_TYPE ) {
		this.components[0] /= color.components[0];
		this.components[1] /= color.components[1];
		this.components[2] /= color.components[2];
	}
	else {
		if( this.ARRAY_TYPE.BYTES_PER_ELEMENT > color.ARRAY_TYPE.BYTES_PER_ELEMENT) {
			this.components[0] /= (color.components[0] / 255);
			this.components[1] /= (color.components[1] / 255);
			this.components[2] /= (color.components[2] / 255);
		}
		else {
			this.components[0] /= (color.components[0] * 255);
			this.components[1] /= (color.components[1] * 255);
			this.components[2] /= (color.components[2] * 255);
		}
	}
};
ColorBaseRGB.prototype.divScalar = function (scalar) {
	return new this.CONSTUCTOR_TYPE(
		this.components[0] / scalar,
		this.components[1] / scalar,
		this.components[2] / scalar
	);
};
ColorBaseRGB.prototype.divScalarEq = function (scalar) {
	this.components[0] /= scalar;
	this.components[1] /= scalar;
	this.components[2] /= scalar;
};
ColorBaseRGB.prototype.dot = function (color) {
	if( this.ARRAY_TYPE === color.ARRAY_TYPE ) {
		return this.components[0] * color.components[0] +
				this.components[1] * color.components[1] +
				this.components[2] * color.components[2];
	}
	else {
		if( this.ARRAY_TYPE.BYTES_PER_ELEMENT > color.ARRAY_TYPE.BYTES_PER_ELEMENT) {
			return this.components[0] * (color.components[0] / 255) +
					this.components[1] * (color.components[1] / 255) +
					this.components[2] * (color.components[2] / 255);
		}
		else {
			return this.components[0] * (color.components[0] * 255) +
					this.components[1] * (color.components[1] * 255) +
					this.components[2] * (color.components[2] * 255);
		}
	}
};
ColorBaseRGB.prototype.distance = function (color) {
	if( this.ARRAY_TYPE === color.ARRAY_TYPE ) {
		return Math.sqrt( 
			( this.components[0] - color.components[0] ) *
			( this.components[1] - color.components[1] ) *
			( this.components[2] - color.components[2] )
		);
	}
	else {
		if( this.ARRAY_TYPE.BYTES_PER_ELEMENT > color.ARRAY_TYPE.BYTES_PER_ELEMENT) {
			return Math.sqrt( 
				( this.components[0] - (color.components[0] / 255) ) *
				( this.components[1] - (color.components[1] / 255) ) *
				( this.components[2] - (color.components[2] / 255) )
			);
		}
		else {
			return Math.sqrt( 
				( this.components[0] - (color.components[0] * 255) ) *
				( this.components[1] - (color.components[1] * 255) ) *
				( this.components[2] - (color.components[2] * 255) )
			);
		}
	}
};
ColorBaseRGB.prototype.distanceSquared = function (color) {
	if( this.ARRAY_TYPE === color.ARRAY_TYPE ) {
		return ( this.components[0] - color.components[0] ) *
			( this.components[1] - color.components[1] ) *
			( this.components[2] - color.components[2] ) ;
	}
	else {
		if( this.ARRAY_TYPE.BYTES_PER_ELEMENT > color.ARRAY_TYPE.BYTES_PER_ELEMENT) {
			return ( this.components[0] - (color.components[0] / 255) ) *
				( this.components[1] - (color.components[1] / 255) ) *
				( this.components[2] - (color.components[2] / 255) ) ;
		}
		else {
			return ( this.components[0] - (color.components[0] * 255) ) *
				( this.components[1] - (color.components[1] * 255) ) *
				( this.components[2] - (color.components[2] * 255) ) ;
		}
	}
};
ColorBaseRGB.prototype.length = function () {
	return Math.sqrt( 
		this.components[0] * this.components[0] +
		this.components[1] * this.components[1] +
		this.components[2] * this.components[2] 
	);
};
ColorBaseRGB.prototype.lengthSquared = function () {
	return this.components[0] * this.components[0] +
		this.components[1] * this.components[1] +
		this.components[2] * this.components[2] ;
};
ColorBaseRGB.prototype.normalize = function () {
	var s = this.length();
	if ( s > 0 ) {
		this.components[0] = this.components[0] / s;
		this.components[1] = this.components[1] / s;
		this.components[2] = this.components[2] / s;
	}
};
ColorBaseRGB.prototype.lerp = function (fact, color) {
	return new this.CONSTUCTOR_TYPE(
		 this.components[0] + ( color.components[0] - this.components[0] ) * fact, 
		 this.components[1] + ( color.components[1] - this.components[1] ) * fact, 
		 this.components[2] + ( color.components[2] - this.components[2] ) * fact 
	);
};

function ColorBaseRGBA (arrayType, constructorType) {
	this.ARRAY_TYPE = arrayType;
	this.CONSTUCTOR_TYPE = constructorType;
};

ColorBaseRGBA.prototype.constructor = ColorBaseRGBA,
ColorBaseRGBA.prototype.setFromElements = function (r, g, b, a) { this.components = new this.ARRAY_TYPE([ r, g, b, a ]); };
ColorBaseRGBA.prototype.setFromColorA = function (colorA) { this.components = new this.ARRAY_TYPE(colorA.components); };
ColorBaseRGBA.prototype.setFromColor = function (color, a) {
	this.components = new this.ARRAY_TYPE([color.components[0], color.components[1], color.components[2], a]);	
};
ColorBaseRGBA.prototype.setToNull = function () { this.components = new this.ARRAY_TYPE([ 0, 0, 0, 0 ]); };
ColorBaseRGBA.prototype.copy = function (color) { /* TODO: figure out if it's a colorA */this.components.set(color.components); };
ColorBaseRGBA.prototype.r = function (r) {
	if( r !== undefined) {
		return this.components[0] = r;
	}
	else {
		return this.components[0];
	}
};
ColorBaseRGBA.prototype.g = function (g) {
	if( g !== undefined ) {
		return this.components[1] = g;
	}
	else {
		return this.components[1];
	}
};
ColorBaseRGBA.prototype.b = function (b) {
	if( b !== undefined ) {
		return this.components[2] = b;
	}
	else {
		return this.components[2];
	}
};
ColorBaseRGBA.prototype.a = function (a) {
	if( a ) {
		return this.components[3] = a;
	}
	else {
		return this.components[3];
	}
};
ColorBaseRGBA.prototype.equals = function (color) {
	if( this.ARRAY_TYPE === color.ARRAY_TYPE ) {
		return this.components[0] === color.components[0] &&
			this.components[1] === color.components[1] &&
			this.components[2] === color.components[2] &&
			this.components[3] === color.components[3];
	}
	else {
		return false;
	}
}
ColorBaseRGBA.prototype.add = function (color) {
	if( this.ARRAY_TYPE === color.ARRAY_TYPE ) {
		return new this.CONSTUCTOR_TYPE( 
			this.components[0] + color.components[0],
			this.components[1] + color.components[1],
			this.components[2] + color.components[2],
			this.components[3] + color.components[3]
		)
	}
	else {
		if( this.ARRAY_TYPE.BYTES_PER_ELEMENT > color.ARRAY_TYPE.BYTES_PER_ELEMENT) {
			return new this.CONSTUCTOR_TYPE(
				color.components[0] + (this.components[0] * 255),
				color.components[1] + (this.components[1] * 255),
				color.components[2] + (this.components[2] * 255),
				color.components[3] + (this.components[3] * 255)
			);
		}
		else {
			return new this.CONSTUCTOR_TYPE(
				this.components[0] + (color.components[0] * 255),
				this.components[1] + (color.components[1] * 255),
				this.components[2] + (color.components[2] * 255),
				this.components[3] + (color.components[3] * 255)
			);
		}
	}
};
ColorBaseRGBA.prototype.addEq = function (color) {
	if( this.ARRAY_TYPE === color.ARRAY_TYPE ) {
		this.components[0] += color.components[0];
		this.components[1] += color.components[1];
		this.components[2] += color.components[2];
		this.components[3] += color.components[3];
	}
	else {
		if( this.ARRAY_TYPE.BYTES_PER_ELEMENT > color.ARRAY_TYPE.BYTES_PER_ELEMENT) {
			this.components[0] += (color.components[0] / 255);
			this.components[1] += (color.components[1] / 255);
			this.components[2] += (color.components[2] / 255);
			this.components[3] += (color.components[3] / 255);				
		}
		else {
			this.components[0] += (color.components[0] * 255);
			this.components[1] += (color.components[1] * 255);
			this.components[2] += (color.components[2] * 255);
			this.components[3] += (color.components[3] * 255);
		}
	}
};
ColorBaseRGBA.prototype.addScalar = function (scalar) {
	return new this.CONSTUCTOR_TYPE(
		this.components[0] + scalar,
		this.components[1] + scalar,
		this.components[2] + scalar,
		this.components[3] + scalar
	);
};
ColorBaseRGBA.prototype.addScalar = function (scalar) {
	this.components[0] += scalar;
	this.components[1] += scalar;
	this.components[2] += scalar;
	this.components[3] += scalar;
};
ColorBaseRGBA.prototype.sub = function (color) {
	if( this.ARRAY_TYPE === color.ARRAY_TYPE ) {
		return new this.CONSTUCTOR_TYPE( 
			this.components[0] - color.components[0],
			this.components[1] - color.components[1],
			this.components[2] - color.components[2],
			this.components[3] - color.components[3]
		)
	}
	else {
		if( this.ARRAY_TYPE.BYTES_PER_ELEMENT > color.ARRAY_TYPE.BYTES_PER_ELEMENT) {
			return new this.CONSTUCTOR_TYPE(
				color.components[0] - (this.components[0] * 255),
				color.components[1] - (this.components[1] * 255),
				color.components[2] - (this.components[2] * 255),
				color.components[3] - (this.components[3] * 255)
			);
		}
		else {
			return new this.CONSTUCTOR_TYPE(
				this.components[0] - (color.components[0] * 255),
				this.components[1] - (color.components[1] * 255),
				this.components[2] - (color.components[2] * 255),
				this.components[3] - (color.components[3] * 255)
			);
		}
	}
};
ColorBaseRGBA.prototype.subEq = function (color) {
	if( this.ARRAY_TYPE === color.ARRAY_TYPE ) {
		this.components[0] -= color.components[0];
		this.components[1] -= color.components[1];
		this.components[2] -= color.components[2];
		this.components[3] -= color.components[3];
	}
	else {
		if( this.ARRAY_TYPE.BYTES_PER_ELEMENT > color.ARRAY_TYPE.BYTES_PER_ELEMENT) {
			this.components[0] -= (color.components[0] / 255);
			this.components[1] -= (color.components[1] / 255);
			this.components[2] -= (color.components[2] / 255);
			this.components[3] -= (color.components[3] / 255);
		}
		else {
			this.components[0] -= (color.components[0] * 255);
			this.components[1] -= (color.components[1] * 255);
			this.components[2] -= (color.components[2] * 255);
			this.components[3] -= (color.components[3] * 255);
		}
	}
};
ColorBaseRGBA.prototype.subScalar = function (scalar) {
	return new this.CONSTUCTOR_TYPE(
		this.components[0] - scalar,
		this.components[1] - scalar,
		this.components[2] - scalar,
		this.components[3] - scalar
	);
};
ColorBaseRGBA.prototype.subScalarEq = function (scalar) {
	this.components[0] -= scalar;
	this.components[1] -= scalar;
	this.components[2] -= scalar;
	this.components[3] -= scalar;
};
ColorBaseRGBA.prototype.mult = function (color) {
	if( this.ARRAY_TYPE === color.ARRAY_TYPE ) {
		return new this.CONSTUCTOR_TYPE( 
			this.components[0] * color.components[0],
			this.components[1] * color.components[1],
			this.components[2] * color.components[2],
			this.components[3] * color.components[3]
		)
	}
	else {
		if( this.ARRAY_TYPE.BYTES_PER_ELEMENT > color.ARRAY_TYPE.BYTES_PER_ELEMENT) {
			return new this.CONSTUCTOR_TYPE(
				color.components[0] * (this.components[0] * 255),
				color.components[1] * (this.components[1] * 255),
				color.components[2] * (this.components[2] * 255),
				color.components[3] * (this.components[3] * 255)
			);
		}
		else {
			return new this.CONSTUCTOR_TYPE(
				this.components[0] * (color.components[0] * 255),
				this.components[1] * (color.components[1] * 255),
				this.components[2] * (color.components[2] * 255),
				this.components[3] * (color.components[3] * 255)
			);
		}
	}
};
ColorBaseRGBA.prototype.multEq = function (color) {
	if( this.ARRAY_TYPE === color.ARRAY_TYPE ) {
		this.components[0] *= color.components[0];
		this.components[1] *= color.components[1];
		this.components[2] *= color.components[2];
		this.components[3] *= color.components[3];
	}
	else {
		if( this.ARRAY_TYPE.BYTES_PER_ELEMENT > color.ARRAY_TYPE.BYTES_PER_ELEMENT) {
			this.components[0] *= (color.components[0] / 255);
			this.components[1] *= (color.components[1] / 255);
			this.components[2] *= (color.components[2] / 255);
			this.components[3] *= (color.components[3] / 255);
		}
		else {
			this.components[0] *= (color.components[0] * 255);
			this.components[1] *= (color.components[1] * 255);
			this.components[2] *= (color.components[2] * 255);
			this.components[3] *= (color.components[3] * 255);
		}
	}
};
ColorBaseRGBA.prototype.multScalar = function (scalar) {
	return new this.CONSTUCTOR_TYPE(
		this.components[0] * scalar,
		this.components[1] * scalar,
		this.components[2] * scalar,
		this.components[3] * scalar
	);
};
ColorBaseRGBA.prototype.multScalarEq = function (scalar) {
	this.components[0] *= scalar;
	this.components[1] *= scalar;
	this.components[2] *= scalar;
	this.components[3] *= scalar;
};
ColorBaseRGBA.prototype.div = function (color) {
	if( this.ARRAY_TYPE === color.ARRAY_TYPE ) {
		return new this.CONSTUCTOR_TYPE( 
			this.components[0] / color.components[0],
			this.components[1] / color.components[1],
			this.components[2] / color.components[2],
			this.components[3] / color.components[3]
		)
	}
	else {
		if( this.ARRAY_TYPE.BYTES_PER_ELEMENT > color.ARRAY_TYPE.BYTES_PER_ELEMENT) {
			return new this.CONSTUCTOR_TYPE(
				this.components[0] / (color.components[0] / 255),
				this.components[1] / (color.components[1] / 255),
				this.components[2] / (color.components[2] / 255),
				this.components[3] / (color.components[3] / 255)
			);
		}
		else {
			return new this.CONSTUCTOR_TYPE(
				this.components[0] / (color.components[0] * 255),
				this.components[1] / (color.components[1] * 255),
				this.components[2] / (color.components[2] * 255),
				this.components[3] / (color.components[3] * 255)
			);
		}
	}
};
ColorBaseRGBA.prototype.divEq = function (color) {
	if( this.ARRAY_TYPE === color.ARRAY_TYPE ) {
		this.components[0] /= color.components[0];
		this.components[1] /= color.components[1];
		this.components[2] /= color.components[2];
		this.components[3] /= color.components[3];
	}
	else {
		if( this.ARRAY_TYPE.BYTES_PER_ELEMENT > color.ARRAY_TYPE.BYTES_PER_ELEMENT) {
			this.components[0] /= (color.components[0] / 255);
			this.components[1] /= (color.components[1] / 255);
			this.components[2] /= (color.components[2] / 255);
			this.components[3] /= (color.components[3] / 255);
		}
		else {
			this.components[0] /= (color.components[0] * 255);
			this.components[1] /= (color.components[1] * 255);
			this.components[2] /= (color.components[2] * 255);
			this.components[3] /= (color.components[3] * 255);
		}
	}
};
ColorBaseRGBA.prototype.divScalar = function (scalar) {
	return new this.CONSTUCTOR_TYPE(
		this.components[0] / scalar,
		this.components[1] / scalar,
		this.components[2] / scalar,
		this.components[3] / scalar
	);
};
ColorBaseRGBA.prototype.divScalarEq = function (scalar) {
	this.components[0] /= scalar;
	this.components[1] /= scalar;
	this.components[2] /= scalar;
	this.components[3] /= scalar;
};
ColorBaseRGBA.prototype.dot = function (color) {
	if( this.ARRAY_TYPE === color.ARRAY_TYPE ) {
		return this.components[0] * color.components[0] +
				this.components[1] * color.components[1] +
				this.components[2] * color.components[2] +
				this.components[3] * color.components[3];
	}
	else {
		if( this.ARRAY_TYPE.BYTES_PER_ELEMENT > color.ARRAY_TYPE.BYTES_PER_ELEMENT) {
			return this.components[0] * (color.components[0] / 255) +
					this.components[1] * (color.components[1] / 255) +
					this.components[2] * (color.components[2] / 255) +
					this.components[3] * (color.components[3] / 255);
		}
		else {
			return this.components[0] * (color.components[0] * 255) +
					this.components[1] * (color.components[1] * 255) +
					this.components[2] * (color.components[2] * 255) +
					this.components[3] * (color.components[3] * 255);
		}
	}
};
ColorBaseRGBA.prototype.distance = function (color) {
	if( this.ARRAY_TYPE === color.ARRAY_TYPE ) {
		return Math.sqrt( 
			( this.components[0] - color.components[0] ) *
			( this.components[1] - color.components[1] ) *
			( this.components[2] - color.components[2] ) *
			( this.components[3] - color.components[3] ) 
		);
	}
	else {
		if( this.ARRAY_TYPE.BYTES_PER_ELEMENT > color.ARRAY_TYPE.BYTES_PER_ELEMENT) {
			return Math.sqrt( 
				( this.components[0] - (color.components[0] / 255) ) *
				( this.components[1] - (color.components[1] / 255) ) *
				( this.components[2] - (color.components[2] / 255) )
				( this.components[3] - (color.components[3] / 255) )
			);
		}
		else {
			return Math.sqrt( 
				( this.components[0] - (color.components[0] * 255) ) *
				( this.components[1] - (color.components[1] * 255) ) *
				( this.components[2] - (color.components[2] * 255) )
				( this.components[3] - (color.components[3] * 255) )
			);
		}
	}
};
ColorBaseRGBA.prototype.distanceSquared = function (color) {
	if( this.ARRAY_TYPE === color.ARRAY_TYPE ) {
		return ( this.components[0] - color.components[0] ) *
			( this.components[1] - color.components[1] ) *
			( this.components[2] - color.components[2] ) ;
	}
	else {
		if( this.ARRAY_TYPE.BYTES_PER_ELEMENT > color.ARRAY_TYPE.BYTES_PER_ELEMENT) {
			return ( this.components[0] - (color.components[0] / 255) ) *
				( this.components[1] - (color.components[1] / 255) ) *
				( this.components[2] - (color.components[2] / 255) ) ;
		}
		else {
			return ( this.components[0] - (color.components[0] * 255) ) *
				( this.components[1] - (color.components[1] * 255) ) *
				( this.components[2] - (color.components[2] * 255) ) ;
		}
	}
};
ColorBaseRGBA.prototype.length = function () {
	return Math.sqrt( 
		this.components[0] * this.components[0] +
		this.components[1] * this.components[1] +
		this.components[2] * this.components[2] 
	);
};
ColorBaseRGBA.prototype.lengthSquared = function () {
	return this.components[0] * this.components[0] +
		this.components[1] * this.components[1] +
		this.components[2] * this.components[2] ;
};
ColorBaseRGBA.prototype.normalize = function () {
	var s = this.length();
	if ( s > 0 ) {
		this.components[0] = this.components[0] / s;
		this.components[1] = this.components[1] / s;
		this.components[2] = this.components[2] / s;
	}
};
ColorBaseRGBA.prototype.lerp = function (fact, color) {
	return new this.CONSTUCTOR_TYPE(
		 this.components[0] + ( color.components[0] - this.components[0] ) * fact, 
		 this.components[1] + ( color.components[1] - this.components[1] ) * fact, 
		 this.components[2] + ( color.components[2] - this.components[2] ) * fact,
		 this.components[3] + ( color.components[3] - this.components[3] ) * fact 
	);
};
ColorBaseRGBA.prototype.toS = function () {
	return "r: " + this.components[0] + ", g: " + this.components[1] + ", b: " + this.components[2] + ", a: " + this.components[3];
}