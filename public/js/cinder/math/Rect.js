Rectf = function (d0, d1, d2, d3) {
	if( arguments.length === 0 ) {
		this.setFromIdentity();
	}
	else if( arguments.length === 1 ) {
		if( d0.type !== undefined ) {
			this.setFromRect(d0);
		}
		else if( d0 instanceof Array ) {
			this.setFromArray(d0);
		}
	}
	else if( arguments.length === 2 ) {
		this.setFromVec2(d0, d1);
	}
	else if( arguments.length === 4 ) {
		this.setFromElements( d0, d1, d2, d3 );
	}
	return this;
}

Rectf.prototype = {
	constructor: Rectf,

	type: "rf",

	copy: function (rhsRect) {
		this.components.set(rhsRect.components);
	},

	setFromElements: function (x1, y1, x2, y2) {
		this.components = new Float32Array([
			x1, y1, x2, y2 
		]);
	},
	setFromRect: function(rect) {
		this.components = new Float32Array(rect.components);
	},
	setFromVec2: function (vec1, vec2) {
		this.components = new Float32Array([
			vec1.x(), vec1.y(), vec2.x(), vec2.y()
		]);
	},
	setFromArray: function (array) {
		this.components = new Float32Array(4);
		for( var i = 0; i < array.length; i++ ) {
			this.include( array[i] )
		}	
	},
	add: function (rhsType) {
		if( rhsType.type.charAt(0) === "v" ) {
			return this.getOffset( rhsType );
		}
		else if( rhsType.type.charAt(0) === "r" ) {
			return new Rectf( 
				this.components[0] + rhsType.x1(),
				this.components[1] + rhsType.y1(),
				this.components[2] + rhsType.x2(),
				this.components[3] + rhsType.y2()
			);
		}
	},
	addEq: function (rhsType) {
		this.offset( rhsType );
	},
	sub: function (rhsType) {
		if( rhsType.type.charAt(0) === "v" ) {
			return this.getOffset( new Vec2f( rhsType.inverse() ) );
		}
		else if( rhsType.type.charAt(0) === "r" ) {
			return new Rectf( 
				this.components[0] - rhsType.x1(),
				this.components[1] - rhsType.y1(),
				this.components[2] - rhsType.x2(),
				this.components[3] - rhsType.y2()
			);
		}
	},
	subEq: function (rhsType) {
		this.offset( rhsType.inverse() );
	},
	multScalar: function (rhScalar) {
		return this.scaled( rhScalar );
	},
	multScalarEq: function (rhScalar) {
		this.scale( rhScalar );
	},
	divScalar: function (rhScalar) {
		return this.scaled( 1 / rhScalar );
	},
	divScalarEq: function (rhScalar) {
		this.scale( 1 / rhScalar );
	},
	setFromIdentity: function() {
		this.components = new Float32Array(4);
	},
	getWidth: function () {
		return this.components[2] - this.components[0];
	},
	getHeight: function () {
		return this.components[3] - this.components[1];
	},
	getAspectRatio: function () {
		return this.getWidth() / this.getHeight();
	},
	calcArea: function () {
		return this.getWidth() * this.getHeight();
	},

	x1: function (x1) { 
		if( x1 === undefined ) {
			return this.components[0]; 
		}
		else {
			return this.components[0] = x1; 
		}
	},
	y1: function (y1) { 
		if( y1 === undefined ) {
			return this.components[1]; 
		}
		else {
			return this.components[1] = y1; 
		}
	},
	x2: function (x2) { 
		if( x2 === undefined ) {
			return this.components[2]; 
		}
		else {
			return this.components[2] = x2; 
		}
	},
	y2: function (y2) { 
		if( y2 === undefined ) {
			return this.components[3]; 
		}
		else {
			return this.components[3] = y2; 
		}
	},
	getX1: function () { return this.components[0]; },
	getY1: function () { return this.components[1]; },
	getX2: function () { return this.components[2]; },
	getY2: function () { return this.components[3]; },
	getUpperLeft: function () { return new Vec2f( this.components[0], this.components[1]); },
	getUpperRight: function () { return new Vec2f( this.components[2], this.components[1]); },
	getLowerRight: function () { return new Vec2f( this.components[2], this.components[3]); },
	getLowerLeft: function () { return new Vec2f( this.components[0], this.components[3]); },
	getCenter: function () { 
		return new Vec2f( 
			( this.components[0] + this.components[2] ) / 2, 
			( this.components[1] + this.components[3] ) / 2 
		);
	},
	getSize: function () { 
		return Vec2f( 
			this.components[2] - this.components[0], 
			this.components[3] - this.components[1] 
		); 
	},

	canonicalize: function() {
		if( this.components[0] > this.components[2] ) {
			var temp = this.components[0];
			this.components[0] = this.components[2];
			this.components[2] = temp;
		}

		if( this.components[1] > this.components[3] ) {
			var temp = this.components[1];
			this.components[1] = this.components[3];
			this.components[3] = temp;
		}
	},
	canonicalized: function () {
		var result = new Rectf(this);
		result.canonicalize();
		return result;
	},
	clipBy: function (rhsRect) {
		if ( this.components[0] < rhsRect.x1() )
			this.components[0] = rhsRect.x1();
		if ( this.components[2] < rhsRect.x1() )
			this.components[2] = rhsRect.x1();
		if ( this.components[0] > rhsRect.x2() )
			this.components[0] = rhsRect.x2();
		if ( this.components[2] > rhsRect.x2() )
			this.components[2] = rhsRect.x2();
	
		if ( this.components[1] < rhsRect.y1() )
			this.components[1] = rhsRect.y1();
		if ( this.components[3] < rhsRect.y1() )
			this.components[3] = rhsRect.y1();
		if ( this.components[1] > rhsRect.y2() )
			this.components[1] = rhsRect.y2();
		if ( this.components[3] > rhsRect.y2() )
			this.components[3] = rhsRect.y2();
	},
	getClipBy: function (rhsRect) {
		var result = new Rectf(this);
		result.clipBy(rhsRect);
		return result;
	},
	getInteriorArea: function () {
		
	},
	offset: function (offsetVec2) {
		this.components[0] += offsetVec2.x();
		this.components[2] += offsetVec2.x();
		this.components[1] += offsetVec2.y();
		this.components[3] += offsetVec2.y();
	},
	getOffset: function (offsetVec2) {
		var result = new Rectf(this);
		result.offset( offsetVec2 );
		return result;
	},
	inflate: function (amountVec2) {
		this.components[0] -= amount.x();
		this.components[2] += amount.x();
		this.components[1] -= amount.y(); // assume canonical rect has y1 < y2
		this.components[3] += amount.y();
	},
	inflated: function (amountVec2) {
		var result = new Rectf(this);
		result.inflate(amountVec2);
	},
	offsetCenterTo: function (centerVec2) {
		offset( centerVec2.sub( this.getCenter() ) );
	},
	scaleCentered: function (scaleVec2) {
		var halfWidth = this.getWidth() * scaleVec2.x() / 2.0;
		var halfHeight = this.getHeight() * scaleVec2.y() / 2.0;
		var center = new Vec2f( this.getCenter() );
		this.components[0] = center.x() - halfWidth;
		this.components[2] = center.x() + halfWidth;
		this.components[1] = center.y() - halfHeight;
		this.components[3] = center.y() + halfHeight;
	},
	scaleCenteredScalar: function (scalar) {
		var halfWidth = this.getWidth() * scalar / 2;
		var halfHeight = this.getHeight() * scalar / 2;
		var center = new Vec2f( this.getCenter() );
		this.components[0] = center.x() - halfWidth;
		this.components[2] = center.x() + halfWidth;
		this.components[1] = center.y() - halfHeight;
		this.components[3] = center.y() + halfHeight;
	},
	scaleCenteredScalar: function (scalar) {
		var halfWidth = this.getWidth() * scalar / 2;
		var halfHeight = this.getHeight() * scalar / 2;
		var center = new Vec2f( this.getCenter() );
		return new Rectf( center.x() - halfWidth, center.y() - halfHeight, center.x() + halfWidth, center.y() + halfHeight );
	},
	scaleScalar: function (scalar) {
		this.components[0] *= scalar;
		this.components[2] *= scalar;
		this.components[1] *= scalar;
		this.components[3] *= scalar;
	},
	scale: function (scaleVec2) {
		this.components[0] *= scaleVec2.x();
		this.components[2] *= scaleVec2.y();
		this.components[1] *= scaleVec2.x();
		this.components[3] *= scaleVec2.y();
	},
	scaledScalar: function (scalar) {
		return new Rectf( 
			this.components[0] * scalar, 
			this.components[1] * scalar, 
			this.components[2] * scalar, 
			this.components[3] * scalar 
		);
	},
	scaled: function (scaleVec2) {
		return new Rectf( 
			this.components[0] * scale.x(), 
			this.components[1] * scale.y(), 
			this.components[2] * scale.x(), 
			this.components[3] * scale.y() 
		);
	},
	transformCopy: function (matrix22Affine) {
		//TODO: Implement Matrix22Affine
	},
	contains: function (ptVec2) {
		return ( 
			( pt.x() >= this.components[0] ) && 
			( pt.x() <= this.components[2] ) && 
			( pt.y() >= this.components[1] ) && 
			( pt.y() <= this.components[3] ) 
		);
	},
	intersects: function ( rect ) {
		if( ( this.components[0] > rect.x2() ) || 
			( this.components[2] < rect.x1() ) || 
			( this.components[1] > rect.y2() ) || 
			( this.components[3] < rect.y1() ) ) {
			return false;
		}
		else {
			return true;
		}
	},
	distance: function (ptVec2) {
		var squaredDistance = 0;
		if( ptVec2.x() < this.components[0] ) {
			squaredDistance += ( this.components[0] - ptVec2.x() ) * ( this.components[0] - ptVec2.x() );
		}
		else if( ptVec2.x() > this.components[2] ) {
			squaredDistance += ( ptVec2.x() - this.components[2] ) * ( ptVec2.x() - this.components[2] );
		}

		if( ptVec2.y() < this.components[1] ) {
			squaredDistance += ( this.components[1] - ptVec2.y() ) * ( this.components[1] - ptVec2.y() );
		}
		else if( ptVec2.y() > this.components[3] ) {
			squaredDistance += ( ptVec2.y() - this.components[3] ) * ( ptVec2.y() - this.components[3] );
		}
		
		if( squaredDistance > 0 )
			return Math.sqrt( squaredDistance );
		else
			return 0;
	},
	distanceSquared: function (ptVec2) {
		var squaredDistance = 0;
		if( ptVec2.x() < this.components[0] ) {
			squaredDistance += ( this.components[0] - ptVec2.x() ) * ( this.components[0] - ptVec2.x() );
		}
		else if( ptVec2.x() > this.components[2] ) {
			squaredDistance += ( ptVec2.x() - this.components[2] ) * ( ptVec2.x() - this.components[2] );
		}

		if( ptVec2.y() < this.components[1] ) {
			squaredDistance += ( this.components[1] - ptVec2.y() ) * ( this.components[1] - ptVec2.y() );
		}
		else if( ptVec2.y() > this.components[3] ) {
			squaredDistance += ( ptVec2.y() - this.components[3] ) * ( ptVec2.y() - this.components[3] );
		}

		return squaredDistance;
	},
	closestPoint: function ( ptVec2 ) {
		var result = new Vec2f(ptVec2);
		if( ptVec2.x() < this.components[0] ) {
			result.x(this.components[0]);
		}
		else if( ptVec2.x() > this.components[2] ) {
			result.x(this.components[2]);
		}

		if( ptVec2.y() < this.components[1] ) {
			result.y(this.components[1]);
		}
		else if( ptVec2.y() > this.components[3] ) {
			result.y(this.components[3]);
		}

		return result;
	},
	getCenteredFit: function (otherRect, expand) {
		var result = new Rectf(this);
		result.offset( otherRect.getCenter() - result.getCenter() );
		
		var isInside = ( ( result.getWidth() < otherRect.getWidth() ) && ( result.getHeight() < otherRect.getHeight() ) );
		if( expand || ( ! isInside ) ) { // need to do some scaling
			var aspectAspect = result.getAspectRatio() / otherRect.getAspectRatio();
			if( aspectAspect >= 1.0 ) { // result is proportionally wider so we need to fit its x-axis
				var scaleBy = otherRect.getWidth() / result.getWidth();
				result.scaleCentered( scaleBy );
			}
			else { // result is proportionally wider so we need to fit its y-axis
				var scaleBy = otherRect.getHeight() / result.getHeight();
				result.scaleCentered( scaleBy );
			}
		}
		
		return result;
	},
	include: function (point) {
		if( this.components[0] > point.x() ) this.components[0] = point.x;
		if( this.components[2] < point.x() ) this.components[2] = point.x;
		if( this.components[1] > point.y() ) this.components[1] = point.y;
		if( this.components[3] < point.y() ) this.components[3] = point.y;
	},
	includePointArray: function (ptArray) {
		for( var i = 0; i < ptArray.length; ++i ) {
			include( ptArray[i] );
		}
	},
	includeRect: function (rect) {
		include( new Vec2f( rect.x1(), rect.y1() ) );
		include( new Vec2f( rect.x2(), rect.y2() ) );
	},
};