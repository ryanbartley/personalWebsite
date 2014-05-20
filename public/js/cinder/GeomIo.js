
///////////////////////////////////////////////////////////////////////////
// GEOM NAMESPACE ENUMS TODO: Implement and force all "Indices" as Int32Arrays
///////////////////////////////////////////////////////////////////////////
GEOM = {
	Primitive: {
		LINES: 0,
		TRIANGLES: 1,
		TRIANGLE_STRIP: 2,
		TRIANGLE_FAN: 3
	},
	Attrib: { 
		POSITION: 0, 
		COLOR: 1, 
		TEX_COORD_0: 2, 
		TEX_COORD_1: 3, 
		TEX_COORD_2: 4, 
		TEX_COORD_3: 5,
		NORMAL: 6, 
		TANGENT: 7, 
		BITANGET: 8, 
		BONE_INDEX: 9, 
		BONE_WEIGHT: 10, 
		CUSTOM_0: 11, 
		CUSTOM_1: 12, 
		CUSTOM_2: 13, 
		CUSTOM_3: 14, 
		CUSTOM_4: 15, 
		CUSTOM_5: 16, 
		CUSTOM_6: 17, 
		CUSTOM_7: 18, 
		CUSTOM_8: 19, 
		CUSTOM_9: 20,
		NUM_ATTRIBS: 21 
	},
};

///////////////////////////////////////////////////////////////////////////
// GEOM Source Base Class
///////////////////////////////////////////////////////////////////////////
GEOM.Source = function () { this.mEnabledAttribs = []; };
GEOM.Source.prototype.enable = function(geomAttrib) { this.mEnabledAttribs.push(geomAttrib); };
GEOM.Source.prototype.disable = function(geomAttrib) {
	var index = this.mEnabledAttribs.indexOf(geomAttrib);
	if( index > -1 ) {
		this.mEnabledAttribs.splice(index, 1);
	}
};
GEOM.Source.prototype.clear = function () { this.mEnabledAttribs = []; };
GEOM.Source.prototype.isEnabled = function (geomAttrib) {
	var index = this.mEnabledAttribs.indexOf(geomAttrib);
	return (index > -1) ? true : false;
};
GEOM.Source.prototype.copyIndicesNonIndexed = function ( destArray ) {
	
};
GEOM.Source.prototype.forceCopyIndicesTrianglesImpl = function ( destArray ) {

};

///////////////////////////////////////////////////////////////////////////
// GEOM Target Base Class
///////////////////////////////////////////////////////////////////////////
GEOM.Target = function() {
	return this;
};

GEOM.Target.prototype.generateIndices = function( sourcePrimitive, sourceNumIndices ) {
	var indices = new Uint32Array(sourceNumIndices);
	console.log(sourceNumIndices);
	for( var i = 0; i < sourceNumIndices; ++i ) {
		indices[i] = i;
	}
	console.log("I'm generating");
	var arrayType = Uint32Array;
	//TODO: Figure this out with array types
	// if( sourceNumIndices < 256 )
		// arrayType = Uint8Array;
	// else if( sourceNumIndices < 65536 )
		// arrayType = Uint16Array;
	// now have the target copy these indices
	this.copyIndices( sourcePrimitive, indices, sourceNumIndices, arrayType );
};
GEOM.Target.prototype.copyIndexData = function( sourceIndexData, targetIndexArray ) { targetIndexArray.set( sourceIndexData ); };
GEOM.Target.prototype.copyIndexDataForceTriangles = function( geomPrimitive, srcIndexArray, numIndices, targetIndexArray ) {
	console.log("I'm here and it equals", geomPrimitive);
	switch( geomPrimitive ) {
		case GEOM.Primitive.LINES:
		case GEOM.Primitive.TRIANGLES:
			targetIndexArray.set(srcIndexArray);
		break;
		case GEOM.Primitive.TRIANGLE_STRIP: { // ABC, CBD, CDE, EDF, etc
			if( numIndices < 3 )
				return;
			var outIdx = 0; // (012, 213), (234, 435), etc : (odd,even), (odd,even), etc
			for( var i = 0; i < numIndices - 2; ++i ) {
				if( i & 1 ) { // odd
					// TODO: Figure out what's going on with this. I swapped 2 and 1 because Geom.Rect wasn't working properly
					// need to cout some cinder.
					targetIndexArray[outIdx++] = srcIndexArray[i+2];
					targetIndexArray[outIdx++] = srcIndexArray[0];
					targetIndexArray[outIdx++] = srcIndexArray[i+1];
					console.log(targetIndexArray);
				}
				else { // even
					targetIndexArray[outIdx++] = srcIndexArray[i];
					targetIndexArray[outIdx++] = srcIndexArray[i+1];
					targetIndexArray[outIdx++] = srcIndexArray[i+2];
					console.log(targetIndexArray, "even");
				}
			}
		}
		break;
		case GEOM.Primitive.TRIANGLE_FAN: { // ABC, ACD, ADE, etc
			if( numIndices < 3 )
				return;
			var outIdx = 0;
			for( var i = 0; i < numIndices - 2; ++i ) {
				targetIndexArray[outIdx++] = srcIndexArray[0];
				targetIndexArray[outIdx++] = srcIndexArray[i+1];
				targetIndexArray[outIdx++] = srcIndexArray[i+2];
			}
		}
		break;
		default:
			throw "ERROR: GEOM._copyIndexDataForceTrianglesImpl - Illegal Primitive Type";			
		break;
	}
};



///////////////////////////////////////////////////////////////////////////
// GEOM Rect Class, inherits from Source TODO: Needs testing, also implement LoadInto
///////////////////////////////////////////////////////////////////////////
GEOM.Rect = function (format) {
	GEOM.Source.call(this);
	this.type = "gRect";
	this.init(this, format);	
	return this;
};

GEOM.Rect.prototype = Object.create( GEOM.Source.prototype );
GEOM.Rect.prototype.getNumVertices = function() { return 4; },
GEOM.Rect.prototype.getNumIndices = function () { return 0; },
GEOM.Rect.prototype.getPrimitive = function () { return GEOM.Primitive.TRIANGLE_STRIP; },
GEOM.Rect.prototype.getAttribDims = function (geomAttrib) { 
	switch( geomAttrib ) {
		case GEOM.Attrib.POSITION: return 2;
		case GEOM.Attrib.COLOR: return this.mHasColor ? 3 : 0;
		case GEOM.Attrib.TEX_COORD_0: return this.mHasTexCoord0 ? 2 : 0;
		case GEOM.Attrib.NORMAL: return this.mHasNormals ? 3 : 0;
		default:
			return 0;
	}
},
GEOM.Rect.prototype.init = function (that, format) {
	// we assume if you instantiate this 
	// you'll want positions at least positions
	that.sPositions = new Float32Array([ 
		 0.5, -0.5,	
		-0.5, -0.5,	
		 0.5,  0.5,	
		-0.5,  0.5 
	]);
	that.mHasPositions = true;
	that.mHasColor = format.color;
	that.mHasTexCoord0 = format.texCoords;
	that.mHasNormals = format.normals;

	if( that.mHasColor ) {
		that.sColors = new Float32Array([ 
			1, 0, 1,	
			0, 0, 1,	
			1, 1, 1,	
			0, 1, 1 
		]);
	}
	if( that.mHasTexCoord0 ) {
		that.sTexCoords = new Float32Array([ 
			1, 1,	
			0, 1,	
			1, 0,		
			0, 0 
		]);
	}
	if( that.mHasNormals ) {
		that.sNormals = new Float32Array([ 
			0, 0, 1,	  
			0, 0, 1,	
			0, 0, 1,	
			0, 0, 1 
		]);
	}

	that.mPos = format.position || Vec2f.zero();
	that.mScale = format.scale || Vec2f.one();
},
GEOM.Rect.prototype.loadInto = function (target) {
	// TODO: Implement this when we have our container ready

    var positions = new Float32Array(8);
    for( var p = 0; p < 4; ++p ) {
    	var pos = new Vec2f( this.sPositions[p*2+0], this.sPositions[p*2+1] );
    	pos = pos.mult(this.mScale).add(this.mPos);
    	positions[p*2+0] = pos.components[0];
    	positions[p*2+1] = pos.components[1]; 
    }

    target.copyAttrib( GEOM.Attrib.POSITION, 2, 0, positions, 4 );
    if( this.mHasColor )
    	target.copyAttrib( GEOM.Attrib.COLOR, 3, 0, this.sColors, 4 );
    if( this.mHasTexCoord0 )
    	target.copyAttrib( GEOM.Attrib.TEX_COORD_0, 2, 0, this.sTexCoords, 4 );
    if( this.mHasNormals )
    	target.copyAttrib( GEOM.Attrib.NORMAL, 3, 0, this.sNormals, 4 );
},

///////////////////////////////////////////////////////////////////////////
// GEOM Cube Class, inherits from Source TODO: Needs Testing esp with Trimesh, Also implement LoadInto
///////////////////////////////////////////////////////////////////////////
GEOM.Cube = function (format) {
	GEOM.Source.call(this);
	this.type = "gCube";
	this.init(this, format);	
	return this;
};

GEOM.Cube.prototype = Object.create( GEOM.Source.prototype );

GEOM.Cube.prototype.getNumVertices = function() { return 24; };
GEOM.Cube.prototype.getNumIndices = function () { return 36; };
GEOM.Cube.prototype.getPrimitive = function () { return Primitive.TRIANGLES; };
GEOM.Cube.prototype.getAttribDims = function (geomAttrib) { 
	switch( geomAttrib ) {
		case GEOM.Attrib.POSITION: return 3;
		case GEOM.Attrib.COLOR: return this.mHasColor ? 3 : 0;
		case GEOM.Attrib.TEX_COORD_0: return this.mHasTexCoord0 ? 2 : 0;
		case GEOM.Attrib.NORMAL: return this.mHasNormals ? 2 : 0;
		default:
			return 0;
	}	
};
GEOM.Cube.prototype.init = function (that, format) {
	// we assume if you instantiate this 
	// you'll want positions at least positions
	that.sPositions = new Float32Array([ 
		 1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,	// +X
		 1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,	// +Y
		 1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,	// +Z
		-1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,	// -X
		-1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,	// -Y
		 1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // -Z
	]);
	that.sIndices = new Uint16Array([
		0, 1, 2, 0, 2, 3,
		4, 5, 6, 4, 6, 7,
		8, 9,10, 8, 10,11,
		12,13,14,12,14,15,
		16,17,18,16,18,19,
		20,21,22,20,22,23
	]);
	that.mHasPositions = true;
	that.mHasColor = format.color;
	that.mHasTexCoord0 = format.texCoords;
	that.mHasNormals = format.normals;

	if( that.mHasColor ) {
		that.sColors = new Float32Array([ 
			1,0,0,	1,0,0,	1,0,0,	1,0,0,		// +X = red
			0,1,0,	0,1,0,	0,1,0,	0,1,0,		// +Y = green
			0,0,1,	0,0,1,	0,0,1,	0,0,1,		// +Z = blue
			0,1,1,	0,1,1,	0,1,1,	0,1,1,		// -X = cyan
			1,0,1,	1,0,1,	1,0,1,	1,0,1,		// -Y = purple
			1,1,0,	1,1,0,	1,1,0,	1,1,0 		// -Z = yellow
		]);
	}
	if( that.mHasTexCoord0 ) {
		that.sTexCoords = new Float32Array([ 
			0,0,	1,0,	1,1,	0,1,
			1,0,	1,1,	0,1,	0,0,
			0,0,	1,0,	1,1,	0,1,							
			1,0,	1,1,	0,1,	0,0,
			1,1,	0,1,	0,0,	1,0,
			1,1,	0,1,	0,0,	1,0
		]);
	}
	if( that.mHasNormals ) {
		that.sNormals = new Float32Array([ 
			 1,0,0,	 1,0,0,	 1,0,0,	 1,0,0,
			 0,1,0,	 0,1,0,	 0,1,0,	 0,1,0,
			 0,0,1,	 0,0,1,	 0,0,1,	 0,0,1,
			-1,0,0,	-1,0,0,	-1,0,0,	-1,0,0,
			 0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0,
			 0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1
		]);
	}

	that.mPos = format.position;
	that.mScale = format.scale;
};
GEOM.Cube.prototype.loadInto = function (target) {
	// TODO: Implement this when we have our container ready

	target.copyAttrib( GEOM.Attrib.POSITION, 3, 0, this.sPositions, 24 );
	if( this.mHasColor )
		target.copyAttrib( GEOM.Attrib.COLOR, 3, 0, this.sColors, 24 );
	if( this.mHasTexCoord0 )
		target.copyAttrib( GEOM.Attrib.TEX_COORD_0, 2, 0, this.sTexCoords, 24 );
	if( this.mHasNormals )
		target.copyAttrib( GEOM.Attrib.NORMAL, 3, 0, this.sNormals, 24 );
	
	target.copyIndices( GEOM.Primitive.TRIANGLES, this.sIndices, 36, 1 );
};

///////////////////////////////////////////////////////////////////////////
// GEOM Sphere Class, inherits from Source TODO: Implement LoadInto and test
///////////////////////////////////////////////////////////////////////////
GEOM.Sphere = function (format) {
	GEOM.Source.call(this);
	this.type = "gSphere";
	this.init(this, format);	
	return this;
};

GEOM.Sphere.prototype = Object.create( GEOM.Source.prototype );
GEOM.Sphere.prototype.getPrimitive = function () { return GEOM.Primitive.TRIANGLES; },
GEOM.Sphere.prototype.getNumVertices = function() { 
	this.calculate();
	return this.mVertices.length / 3; 
},
GEOM.Sphere.prototype.getNumIndices = function () { 
	this.calculate();
	return this.mIndices.length;
},
GEOM.Sphere.prototype.getAttribDims = function (geomAttrib) {

	switch( geomAttrib ) {
		case GEOM.Attrib.POSITION: return 3;
		case GEOM.Attrib.TEX_COORD_0: return this.isEnabled( GEOM.Attrib.TEX_COORD_0 ) ? 2 : 0;
		case GEOM.Attrib.NORMAL: return this.isEnabled( GEOM.Attrib.NORMAL ) ? 3 : 0;
		case GEOM.Attrib.COLOR: return this.isEnabled( GEOM.Attrib.COLOR ) ? 3 : 0;
		default:
			return 0;
	}
},
GEOM.Sphere.prototype.calculate = function () {
	if( this.mCalculationsCached )
		return;

	var numSegments = this.mNumSegments || 30;
	if( numSegments <= 0 )
		numSegments = Math.max( 12, Math.floor( mRadius * Math.PI * 2 ) );

	this.calculateImplUV( numSegments, numSegments );
	this.mCalculationsCached = true;
},
GEOM.Sphere.prototype.calculateImplUV = function (segments, rings) {
	this.mVertices = new Float32Array( segments * rings * 3 );
	this.mNormals = new Float32Array( segments * rings * 3 );
	this.mTexCoords = new Float32Array( segments * rings * 2 );
	this.mColors = new Float32Array( segments * rings * 3 );	
	this.mIndices = new Uint32Array( segments * rings * 6 );

	var ringIncr = 1.0 / ( rings - 1 );
	var segIncr = 1.0 / ( segments - 1 );
	var radius = this.mRadius;

	var hasNormals = this.isEnabled( GEOM.Attrib.NORMAL );
	var hasTexCoords = this.isEnabled( GEOM.Attrib.TEX_COORD_0 );
	var hasColors = this.isEnabled( GEOM.Attrib.COLOR );
	console.log( "hasColors", hasColors );
	var vertIt = 0;
	var normIt = 0;
	var texIt = 0;
	var colorIt = 0;
	for( var r = 0; r < rings; r++ ) {
		for( var s = 0; s < segments; s++ ) {
			var x = Math.cos( 2 * Math.PI * s * segIncr ) * Math.sin( Math.PI * r * ringIncr );
			var y = Math.sin( -Math.PI / 2 + Math.PI * r * ringIncr );
			var z = Math.sin( 2 * Math.PI * s * segIncr ) * Math.sin( Math.PI * r * ringIncr );
			
			this.mVertices[vertIt++] = x * radius; 
			this.mVertices[vertIt++] = y * radius;
			this.mVertices[vertIt++] = z * radius;

			if( hasNormals ) {
				this.mNormals[normIt++] = x;
				this.mNormals[normIt++] = y;
				this.mNormals[normIt++] = z;
			}
			if( hasTexCoords ) {
				this.mTexCoords[texIt++] = s * segIncr;
				this.mTexCoords[texIt++] = 1.0 - r * ringIncr;
			}
			if( hasColors ) {
				this.mColors[colorIt++] = x;
				this.mColors[colorIt++] = y;
				this.mColors[colorIt++] = z;
			}
		}
	}

	var indexIt = 0;
	for( var r = 0; r < rings - 1; r++ ) {
		for( var s = 0; s < segments - 1 ; s++ ) {
			this.mIndices[indexIt++] = r * segments + s;
			this.mIndices[indexIt++] = r * segments + ( s + 1 );
			this.mIndices[indexIt++] = ( r + 1 ) * segments + ( s + 1 );

			this.mIndices[indexIt++] = ( r + 1 ) * segments + ( s + 1 );
			this.mIndices[indexIt++] = ( r + 1 ) * segments + s;
			this.mIndices[indexIt++] = r * segments + s;
		}
	}
},
GEOM.Sphere.prototype.init = function (that, format) {
	// we assume if you instantiate this 
	// you'll want positions at least positions
	this.enable( GEOM.Attrib.POSITION );
	this.enable( GEOM.Attrib.NORMAL );
	this.enable( GEOM.Attrib.TEX_COORD_0 );
	this.enable( GEOM.Attrib.COLOR );

	this.mCenter = format.center || Vec3f.zero();
	this.mRadius = format.radius || 1.0;
	this.mNumSegments = format.segments || 30;
	this.mCalculationsCached = false;
},
GEOM.Sphere.prototype.loadInto = function (target) {
	// TODO: Implement this when we have our container ready

	this.calculate();
	if( this.isEnabled( GEOM.Attrib.POSITION ) )
	   target.copyAttrib( GEOM.Attrib.POSITION, 3, 0, this.mVertices, this.mVertices.length );
	if( this.isEnabled( GEOM.Attrib.TEX_COORD_0 ) )
	   target.copyAttrib( GEOM.Attrib.TEX_COORD_0, 2, 0, this.mTexCoords, this.mTexCoords.length );
	if( this.isEnabled( GEOM.Attrib.NORMAL ) )
	   target.copyAttrib( GEOM.Attrib.NORMAL, 3, 0, this.mNormals, this.mNormals.length );
	if( this.isEnabled( GEOM.Attrib.COLOR ) )
	   target.copyAttrib( GEOM.Attrib.COLOR, 3, 0, this.mColors, this.mColors.length );
	
	target.copyIndices( GEOM.Primitive.TRIANGLES, this.mIndices, this.mIndices.length, 4 );
},

///////////////////////////////////////////////////////////////////////////
// GEOM Circle Class, inherits from Source TODO: There's something wrong with the math
// TODO: fix the math
///////////////////////////////////////////////////////////////////////////
GEOM.Circle = function(format) {
	GEOM.Source.call(this);
	this.type = "gCircle";
	this.init(this, format);
	return this;
};

GEOM.Circle.prototype = Object.create(GEOM.Source.prototype);
GEOM.Circle.prototype.getNumVertices = function () { return this.mNumVertices; };
GEOM.Circle.prototype.getNumIndices = function () { return 0; };
GEOM.Circle.prototype.getPrimitive = function () { return GEOM.Primitive.TRIANGLE_FAN; };
GEOM.Circle.prototype.getAttribDims = function (geomAttrib) {
	switch( geomAttrib ) {
		case GEOM.Attrib.POSITION: return 2;
		case GEOM.Attrib.TEX_COORD_0: return this.isEnabled( GEOM.Attrib.TEX_COORD_0 ) ? 2 : 0;
		case GEOM.Attrib.NORMAL: return this.isEnabled( GEOM.Attrib.NORMAL ) ? 3 : 0;
		default:
			return 0;
	}
};
GEOM.Circle.prototype.updateVertexCounts = function () {
	if( this.mRequestedSegments <= 0 ){
		this.mNumSegments = Math.floor( this.mRadius * Math.PI * 2 );
	}
	else {
		this.mNumSegments = this.mRequestedSegments;
	}
	
	if( this.mNumSegments < 3 ) {
		this.mNumSegments = 3;
	}
	console.log("generating vertices", this.mNumSegments);
	this.mNumVertices = this.mNumSegments + 1 + 1;
};
GEOM.Circle.prototype.calculate = function () {
	this.mPositions = new Float32Array(this.mNumVertices * 2);
	if( this.isEnabled( GEOM.Attrib.TEX_COORD_0 ) )
		this.mTexCoords = new Float32Array(this.mNumVertices * 2);
	if( this.isEnabled( GEOM.Attrib.NORMAL ) )		
		this.mNormals = new Float32Array(this.mNumVertices * 3);	

	// center
	this.mPositions[0] = this.mCenter.components[0];
	this.mPositions[1] = this.mCenter.components[1];
	if( this.isEnabled( GEOM.Attrib.TEX_COORD_0 ) ) {
		this.mTexCoords[0] = 0.5;
		this.mTexCoords[1] = 0.5;
	}
	if( this.isEnabled( GEOM.Attrib.NORMAL ) ) {
		this.mNormals[0] = 0;
		this.mNormals[1] = 0;
		this.mNormals[2] = 1;
	}
	
	// iterate the segments
	var tDelta = 1 / this.mNumSegments * 2.0 * 3.14159;
	var t = 0;
	for( var s = 0; s <= this.mNumSegments; s++ ) {
		var unit = new Vec2f( Math.cos( t ), Math.sin( t ) );
		var curPosition = this.mCenter.add(unit.multScalar(this.mRadius));
		console.log(curPosition);
		this.mPositions[s*2+2+0] = curPosition.components[0];
		this.mPositions[s*2+2+1] = curPosition.components[1];
		if( this.isEnabled( GEOM.Attrib.TEX_COORD_0 ) ) {
			var curTexCoord = unit.multScalar(0.5).add( new Vec2f( 0.5, 0.5 ) );
			this.mTexCoords[s*2+2+0] = curTexCoord.components[0];
			this.mTexCoords[s*2+2+1] = curTexCoord.components[1];
		}
		if( this.isEnabled( GEOM.Attrib.NORMAL ) ) {
			this.mNormals[s*3+3+0] = 0;
			this.mNormals[s*3+3+1] = 0;
			this.mNormals[s*3+3+2] = 1;
		}
		t += tDelta;
	}
};
GEOM.Circle.prototype.init = function (that, format) {
	that.enable( GEOM.Attrib.POSITION );
	that.enable( GEOM.Attrib.TEX_COORD_0 );
	that.enable( GEOM.Attrib.NORMAL );
	that.mRadius = format.radius || 1.0;
	that.mRequestedSegments = format.segments || 60.0;
	that.mCenter = format.center || new Vec2f(0, 0);
	that.updateVertexCounts();
};
GEOM.Circle.prototype.segments = function (segments) {
	this.mRequestedSegments = segments;
	this.updateVertexCounts();
};
GEOM.Circle.prototype.radius = function (radius) {
	this.mRadius = radius;
	this.updateVertexCounts();
};
GEOM.Circle.prototype.loadInto = function (target) {
	this.calculate();

	target.copyAttrib( GEOM.Attrib.POSITION, 2, 0, this.mPositions, this.mNumVertices );
	if( this.isEnabled( GEOM.Attrib.TEX_COORD_0 ) )
		target.copyAttrib( GEOM.Attrib.TEX_COORD_0, 2, 0, this.mTexCoords, this.mNumVertices );
	if( this.isEnabled( GEOM.Attrib.NORMAL ) )
		target.copyAttrib( GEOM.Attrib.NORMAL, 3, 0, this.mNormals, this.mNumVertices );
};


///////////////////////////////////////////////////////////////////////////
// GEOM Format class, TODO: Figure out if each Geometry object needs one
///////////////////////////////////////////////////////////////////////////
GEOM.Format = function () {
	this.color = false;
	this.texCoords = false;
	this.normals = false;
	this.position = null;
	this.scale = null;
};


///////////////////////////////////////////////////////////////////////////
// GEOM NAMESPACE STATIC FUNCTIONS BELOW
///////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////
// GEOM Copy Data function taking ptrs to arrays and filling them
// GEOM Impl underneath for non uniform dimensions
// TODO: Test, also figure out what to do if copydataimpl has a dstStrideBytes
///////////////////////////////////////////////////////////////////////////
GEOM.copyData = function (srcDims, srcPtr, numElements, dstDims, dstStrideBytes, dstPtr) {
	if( (srcDims == dstDims) && (dstStrideBytes == 0) ) {
		dstPtr.set(srcPtr);
	}
	else {
		switch( srcDimensions ) {
			case 2:
				switch( dstDimensions ) {
					case 2: GEOM._copyDataImpl( srcData, numElements, dstStrideBytes, dstData, 2, 2 ); break;
					case 3: GEOM._copyDataImpl( srcData, numElements, dstStrideBytes, dstData, 2, 3 ); break;
					case 4: GEOM._copyDataImpl( srcData, numElements, dstStrideBytes, dstData, 2, 4 ); break;
					default: throw "ERROR: GEOM.copyData - Illegal Destination Dimensions";
				}
			break;
			case 3:
				switch( dstDimensions ) {
					case 2: GEOM._copyDataImpl( srcData, numElements, dstStrideBytes, dstData, 3, 2 ); break;
					case 3: GEOM._copyDataImpl( srcData, numElements, dstStrideBytes, dstData, 3, 3 ); break;
					case 4: GEOM._copyDataImpl( srcData, numElements, dstStrideBytes, dstData, 3, 4 ); break;
					default: throw "ERROR: GEOM.copyData - Illegal Destination Dimensions";
				}
			break;
			case 4:
				switch( dstDimensions ) {
					case 2: GEOM._copyDataImpl( srcData, numElements, dstStrideBytes, dstData, 4, 2 ); break;
					case 3: GEOM._copyDataImpl( srcData, numElements, dstStrideBytes, dstData, 4, 3 ); break;
					case 4: GEOM._copyDataImpl( srcData, numElements, dstStrideBytes, dstData, 4, 4 ); break;
					default: throw "ERROR: GEOM.copyData - Illegal Destination Dimensions";
				}
			break;
			default:
				throw "ERROR: GEOM.copyData - Illegal Source Dimensions";
		}
	}
};
GEOM.copyDataImpl = function ( srcData, numElements, dstStrideBytes, dstData, SRCDIM, DSTDIM ) {
	var sFillerData = [ 0, 0, 0, 1 ];
	var MINDIM = (SRCDIM < DSTDIM) ? SRCDIM : DSTDIM;
	
	if( dstStrideBytes == 0 )
		dstStrideBytes = DSTDIM;
	
	for( var v = 0; v < numElements; ++v ) {
		var d;
		for( d = 0; d < MINDIM; ++d ) {
			dstData[v*DSTDIM+d] = srcData[v*SRCDIM+d];
		}
		for( ; d < DSTDIM; ++d ) {
			dstData[v*DSTDIM+d] = sFillerData[d];
		}
	}
};
