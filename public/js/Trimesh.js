function TriMesh (type) {

	if( type instanceof TriMesh.Format ) {
		this.mPositionsDims = format.positionsDims;
		this.mColorsDims = format.colorsDims;
		this.mNormalsDims = format.normalsDims; 
		this.mTangentsDims = format.tangentDims; 
		this.mColorsDims = format.colorsDims;
		this.mTexCoords0Dims = format.texCoords0Dims;
		this.mTexCoords1Dims = format.texCoords1Dims;
		this.mTexCoords2Dims = format.texCoords2Dims;
		this.mTexCoords3Dims = format.texCoords3Dims;

		this.mPositions = new Float32Array(1);
		this.mColors = new Float32Array(1);
		this.mNormals = new Float32Array(1);
		this.mTangents = new Float32Array(1);
		this.mTexCoords0 = new Float32Array(1);
		this.mTexCoords1 = new Float32Array(1);
		this.mTexCoords2 = new Float32Array(1);
		this.mTexCoords3 = new Float32Array(1);
		this.mIndices = new Float32Array(1);
	}
	else if( type.type !== undefined ) {
		if( type.type.charAt(0) === "g" ) {
			this.mPositionsDims = 0;
			this.mColorsDims = 0;
			this.mNormalsDims = 0;
			this.mTangentsDims = 0;
			this.mColorsDims = 0;
			this.mTexCoords0Dims = 0;
			this.mTexCoords1Dims = 0;
			this.mTexCoords2Dims = 0;
			this.mTexCoords3Dims = 0;
			this.initFromGeom(type);
		}
	}

	return this;
};

TriMesh.prototype = {
	constructor: TriMesh,

	initFromGeom: function (geomSource) {
		var numPositions = geomSource.getNumVertices();
	
		// positions
		if( geomSource.getAttribDims( GEOM.Attrib.POSITION ) > 0 ) {
			this.mPositionsDims = geomSource.getAttribDims( GEOM.Attrib.POSITION );
			this.mPositions = new Float32Array( this.mPositionsDims * numPositions );
		}
	
		// normals
		if( geomSource.getAttribDims( GEOM.Attrib.NORMAL ) > 0 ) {
			this.mNormalsDims = 3;
			this.mNormals = new Float32Array( this.mNormalsDims * numPositions );
		}
	
		// tangents
		if( geomSource.getAttribDims( GEOM.Attrib.TANGENT ) > 0 ) {
			this.mTangentsDims = 3;
			this.mTangents = new Float32Array( this.mTangentsDims * numPositions );
		}
	
		// colors
		console.log("about to check color")
		if( geomSource.getAttribDims( GEOM.Attrib.COLOR ) > 0 ) {
			this.mColorsDims = geomSource.getAttribDims( GEOM.Attrib.COLOR );
			console.log( "I'm in color and dims is ", this.mColorsDims );
			this.mColors = new Float32Array( this.mColorsDims * numPositions );
		}
	
		// tex coords 0
		if( geomSource.getAttribDims( GEOM.Attrib.TEX_COORD_0 ) > 0 ) {
			this.mTexCoords0Dims = geomSource.getAttribDims( GEOM.Attrib.TEX_COORD_0 );
			this.mTexCoords0 = new Float32Array( this.mTexCoords0Dims * numPositions );
		}
	
		// tex coords 1
		if( geomSource.getAttribDims( GEOM.Attrib.TEX_COORD_1 ) > 0 ) {
			this.mTexCoords1Dims = geomSource.getAttribDims( GEOM.Attrib.TEX_COORD_1 );
			this.mTexCoords1 = new Float32Array( this.mTexCoords1Dims * numPositions );
		}
	
		// tex coords 2
		if( geomSource.getAttribDims( GEOM.Attrib.TEX_COORD_2 ) > 0 ) {
			this.mTexCoords2Dims = geomSource.getAttribDims( GEOM.Attrib.TEX_COORD_2 );
			this.mTexCoords2 = new Float32Array( this.mTexCoords2Dims * numPositions );
		}
	
		// tex coords 3
		if( geomSource.getAttribDims( GEOM.Attrib.TEX_COORD_3 ) > 0 ) {
			this.mTexCoords3Dims = geomSource.getAttribDims( GEOM.Attrib.TEX_COORD_3 );
			this.mTexCoords3 = new Float32Array( this.mTexCoords3Dims * numPositions );
		}
	
		var target = new TriMeshGeomTarget( this );
		geomSource.loadInto( target );
		
		// if geomSource is-nonindexed, generate indices
		if( geomSource.getNumIndices() == 0 )
			target.generateIndices( geomSource.getPrimitive(), geomSource.getNumVertices() );
	},
	loadInto: function (triMeshGeomTarget) {
		for( var attribIt = 0; attribIt < GEOM.Attrib.NUM_ATTRIBS; ++attribIt ) {
			var attribDims = this.getAttribDims( attribIt );
			if( attribDims ) {
				var dims;
				var strideBytes;
	
				// TODO: On all getAttribPointers take out pointer and just return it
				var attribObj = this.getAttribPointer( attribIt );
				
				if( attribObj.resultPtr )
					triMeshGeomTarget.copyAttrib( attribIt, attribObj );
			}
		}
		
		// copy indices
		if( this.getNumIndices() )
			triMeshGeomTarget.copyIndices( GEOM.Primitive.TRIANGLES, this.mIndices, this.getNumIndices(), 4 /* bytes per index */ );
	},

	clear: function () {
		this.mPositions = new Float32Array(1);
		this.mColors = new Float32Array(1);
		this.mNormals = new Float32Array(1);
		this.mTangents = new Float32Array(1);
		this.mTexCoords0 = new Float32Array(1);
		this.mTexCoords1 = new Float32Array(1);
		this.mTexCoords2 = new Float32Array(1);
		this.mTexCoords3 = new Float32Array(1);
		this.mIndices = new Float32Array(1);
	},

	hasNormals: function () { return mNormals.length !== 0; },
	hasTangents: function () { return mTangents.length !== 0; },
	hasColors: function () { return mColors.length !== 0; },
	hasColorsRgb: function () { return mColorsDims === 3 && mColors.length !== 0; },
	hasColorsRgba: function () { return mColorsDims === 4 && mColors.length !== 0; },

	hasTexCoords: function () { return mTexCoords0.length !== 0; },
	hasTexCoords0: function () { return mTexCoords0.length !== 0; },
	hasTexCoords1: function () { return mTexCoords1.length !== 0; },
	hasTexCoords2: function () { return mTexCoords2.length !== 0; },
	hasTexCoords3: function () { return mTexCoords3.length !== 0; },

	// This function and the array version of this function will only append values that have the same dimensions
	// i.e. if vert or vecTypeVerts is a Vec3, it(they) will only be appended if mPositionsDims
	// === 3, or Vec4 if mPositionsDims === 4
	appendVertex: function (vecTypeVert) { 
		if( this.mPositionsDims === vecTypeVert.components.length ) {
			this.mPositions.set( vecTypeVert.components, this.mPositions.length - 1 );
		}
	},
	appendVertices: function (vecTypeVerts, num) {
		if( this.mPositionsDims === vecTypeVerts[0].components.length ) {
			for( var i = 0; i < num; ++i ) {
				this.mPositions.set( vecTypeVerts[i].components, this.mPositions.length - 1 );
			}
		}
	},

	// This function and the array version of this function will only append values that have the same dimensions
	// mNormalsDims is automatically set to 3.
	appendNormal: function (vec3Normal) {
		if( this.mNormalsDims === vec3Normal.components.length ) {
			this.mNormals.set( vec3Normal.components, this.mNormals.length - 1 );
		}
	},
	appendNormals: function (vec3Normals, num) {
		if( this.mNormalsDims === vec3Normals[0].components.length ) {
			for( var i = 0; i < num; ++i ) {
				this.mNormals.set( vec3Normals[i].components, this.mNormals.length - 1 );
			}
		}
	},

	// This function and the array version of this function will only append values that have the same dimensions
	// mTangentDims is automatically set to 3.
	appendTangent: function (vec3Tangent) {
		if( this.mTangentDims === vec3Tangent.components.length ) {
			this.mTangents.set( vec3Tangent.components, this.mTangents.length - 1 );
		}
	},
	appendTangents: function (vec3Tangents, num) {
		if( this.mTangentsDims === vec3Tangents[0].components.length ) {
			for( var i = 0; i < num; ++i ) {
				this.mTangents.set( vec3Tangents[i].components, this.mTangents.length - 1 );
			}
		}
	},

	// These functions and the array version of this function will only append values that have the same dimensions
	// Use rgb for Color and rgba for colorA.
	// TODO: if Color8u version check to create or convert from or to float or 8u
	appendColorRgb: function(rgb) { 
		if( this.mColorsDims === 3 && rgb.components.length === 3 ) {
			this.mColors.set( rgb.components, this.mColors.length - 1 );
		}
	}, 
	appendColorRgba: function(rgba) { 
		if( this.mColorsDims === 4 && rgba.components.length === 4 ) {
			this.mColors.set( rgba.components, this.mColors.length - 1 );
		}
	},
	appendColors: function(rgbs, num) {
		if( this.mColorsDims === 3 && rgbs[0].components.length === 3 ) {
			for( var i = 0; i < num; ++i ) {
				this.mColors.set( rgbs[i].components, this.mColors.length - 1 );
			}
		}
		else if( this.mColorsDims === 4 && rgbs[0].components.length === 4 ) {
			for( var i = 0; i < num; ++i ) {
				this.mColors.set( rgbs[i].components, this.mColors.length - 1 );
			}
		}
	},

	appendTexCoord: function(vecType) { 
		if( this.mTexCoords0Dims === vecType.components.length ) {
			this.mTexCoords0.set( vecType.components, this.mTexCoords0.length - 1 );
		}
	},
	appendTexCoord0: function(vecType) { 
		if( this.mTexCoords0Dims === vecType.components.length ) {
			this.mTexCoords0.set( vecType.components, this.mTexCoords0.length - 1 );
		}
	},
	appendTexCoord1: function(vecType) {  
		if( this.mTexCoords1Dims === vecType.components.length ) {
			this.mTexCoords1.set( vecType.components, this.mTexCoords1.length - 1 );
		}
	},
	appendTexCoord2: function(vecType) {  
		if( this.mTexCoords2Dims === vecType.components.length ) {
			this.mTexCoords2.set( vecType.components, this.mTexCoords2.length - 1 );
		}
	},
	appendTexCoord3: function(vecType) {  
		if( this.mTexCoords3Dims === vecType.components.length ) {
			this.mTexCoords3.set( vecType.components, this.mTexCoords3.length - 1 );
		}
	},
	appendTexCoords0: function(vecTypeTexCoords, num){
		if( this.mTexCoords0Dims === vecTypeTexCoords[0].components.length ) {
			for( var i = 0; i < num; ++i ) {
				this.mTexCoords0.set( vecTypeTexCoords[i].components, this.mTexCoords0.length - 1 );
			}
		}
	},
	appendTexCoords1: function(vecTypeTexCoords, num){
		if( this.mTexCoords1Dims === vecTypeTexCoords[0].components.length ) {
			for( var i = 0; i < num; ++i ) {
				this.mTexCoords1.set( vecTypeTexCoords[i].components, this.mTexCoords1.length - 1 );
			}
		}
	},
	appendTexCoords2: function(vecTypeTexCoords, num){
		if( this.mTexCoords2Dims === vecTypeTexCoords[0].components.length ) {
			for( var i = 0; i < num; ++i ) {
				this.mTexCoords2.set( vecTypeTexCoords[i].components, this.mTexCoords2.length - 1 );
			}
		}
	},
	appendTexCoords3: function(vecTypeTexCoords, num){
		if( this.mTexCoords3Dims === vecTypeTexCoords[0].components.length ) {
			for( var i = 0; i < num; ++i ) {
				this.mTexCoords3.set( vecTypeTexCoords[i].components, this.mTexCoords3.length - 1 );
			}
		}
	},

	appendTriangle: function (v0, v1, v2) { 
		this.mIndices.push( v0 ); 
		this.mIndices.push( v1 ); 
		this.mIndices.push( v2 ); 
	},
	appendIndices: function (indices, num) {
		this.mIndices.set(indices);
	},
	getNumIndices: function () { return this.mIndices.length; },
	getNumTriangles: function () { return this.mIndices.length / 3; },
	getNumVertices: function () { 
		if( this.mPositionsDims ) { 
			return this.mPositions.length / this.mPositionsDims; 
		} 
		else { 
			return 0; 
		} 
	},
	getTriangleVertices: function( idx, vecTypeA, vecTypeB, vecTypeC ) {
		if( this.mPositionsDims === vecTypeA.components.length ) {
			vecTypeA.components.set([ this.mPositions[this.mIndices[idx * 3] * 3 + 0], this.mPositions[this.mIndices[idx * 3] * 3 + 1], this.mPositions[ this.mIndices[idx * 3] * 3 + 2 ] ]);
			vecTypeB.components.set([ this.mPositions[this.mIndices[idx * 3 + 1] * 3 + 0], this.mPositions[this.mIndices[idx * 3 + 1] * 3 + 1], this.mPositions[ this.mIndices[idx * 3 + 1] * 3 + 2 ] ]);
			vecTypeC.components.set([ this.mPositions[this.mIndices[idx * 3 + 2] * 3 + 0], this.mPositions[this.mIndices[idx * 3 + 2] * 3 + 1], this.mPositions[ this.mIndices[idx * 3 + 2] * 3 + 2 ] ]);
		}
	},
	getVertices: function () { return this.mPositions; },
	getNormals: function () { return this.mNormals; },
	getTangents: function () { return this.mTangents; },
	// TODO: Implement RGBA and RGB depending on dim;
	getColors: function () { return this.mColors; },
	// getColors: function () { return this.mColorsRGBA; },
	getTexCoords: function () { return this.mTexCoords; },	
	getIndices: function () { return this.mIndices; },
	
	// TODO: Create AxisAlignedBox3f
	calcBoundingBox: function () {
		if( this.mPositions.length === 0 )
			return AxisAlignedBox3f( Vec3f.zero(), Vec3f.zero() );

		var min = new Vec3f( this.mPositions[0], this.mPositions[1], this.mPositions[2] );
		var max = new Vec3f( this.mPositions[0], this.mPositions[1], this.mPositions[2] );
		for( var i = 1; i < mPositions.length / 3; ++i ) {
			var x = mPositions[i*3+0];
			var y = mPositions[i*3+1];
			var z = mPositions[i*3+2];
			if( x < min.x() ) {
				min.x(x);
			}
			else if( x > max.x() ) {
				max.x(x);
			}
			if( y < min.y() ) {
				min.y(y);
			}
			else if( y > max.y() ) {
				max.y(y);
			}
			if( z < min.z() ) {
				min.z(z);
			}
			else if( z > max.z() ) {
				max.z(z);
			}
		}
	
		return AxisAlignedBox3f( min, max );
	},
	calcBoundingBoxTrans: function (transform) {
		if( this.mPositions.length === 0 )
			return AxisAlignedBox3f( Vec3f.zero(), Vec3f.zero() );

		var min = transform.transformPointAffine( new Vec3f( this.mPositions[0], this.mPositions[1], this.mPositions[2] ) );
		var max = new Vec3f( min );
		for( var i = 1; i < mPositions.length / 3; ++i ) {
			var v = transform.transformPointAffine( new Vec3f( mPositions[i*3+0], mPositions[i*3+1], mPositions[i*3+2] ) )
			
			if( v.x() < min.x() ) {
				min.x(v.x());
			}
			else if( v.x() > max.x() ) {
				max.x(v.x());
			}
			if( v.y() < min.y() ) {
				min.y(v.y());
			}
			else if( v.y() > max.y() ) {
				max.y(v.y());
			}
			if( v.z() < min.z() ) {
				min.z(v.z());
			}
			else if( v.z() > max.z() ) {
				max.z(v.z());
			}
		}
	
		return AxisAlignedBox3f( min, max );
	},
	// TODO: Figure out how to implement this
	read: function (dataSourceRef) {

	},
	// TODO: Figure out how to implement this
	write: function( dataTargetRef) {

	},
	// TODO: Figure out if I should make vec constructors take arrays and only the first 3 from a spot
	recalculateNormals: function () {
		if( this.mPositionsDims == 3 ) {
			this.mNormals = new Float32Array(this.mPositions.length);
	
			var n = this.getNumTriangles();
			for( var i = 0; i < n; ++i ) {
				var index0 = this.mIndices[i * 3];
				var index1 = this.mIndices[i * 3 + 1];
				var index2 = this.mIndices[i * 3 + 2];
		
				var v0 = new Vec3f( this.mPositions[index0*3+0], this.mPositions[index0*3+1], this.mPositions[index0*3+2] );
				var v1 = new Vec3f( this.mPositions[index1*3+0], this.mPositions[index1*3+1], this.mPositions[index1*3+2] );
				var v2 = new Vec3f( this.mPositions[index2*3+0], this.mPositions[index2*3+1], this.mPositions[index2*3+2] );
		
				var e0 = v1.sub(v0);
				var e1 = v2.sub(v0);
				var normal = e0.cross(e1).normalized();

				this.mNormals.set( normal.components, index0 );
				this.mNormals.set( normal.components, index1 );
				this.mNormals.set( normal.components, index2 );
			}
		}
	},
	recalculateTangents: function () {
		if( this.mPositionsDims === 3 && mTexCoords0Dims === 2 ) { 
	
			// requires valid normals and texture coordinates
			if(!(hasNormals() && hasTexCoords())) {
				return;
			}
		
			this.mTangents = new Float32Array( this.mPositions.length );
		
			var n = getNumTriangles();
			for( var i = 0; i < n; ++i ) {
				var index0 = this.mIndices[i * 3];
				var index1 = this.mIndices[i * 3 + 1];
				var index2 = this.mIndices[i * 3 + 2];
		
				 var v0 = new Vec3f( this.mPositions[index0*3+0], this.mPositions[index0*3+1], this.mPositions[index0*3+2] );
				 var v1 = new Vec3f( this.mPositions[index1*3+0], this.mPositions[index1*3+1], this.mPositions[index1*3+2] );
				 var v2 = new Vec3f( this.mPositions[index2*3+0], this.mPositions[index2*3+1], this.mPositions[index2*3+2] );
		
				var w0 = new Vec2f( this.mTexCoords0[index0*2+0], this.mTexCoords0[index0*2+1] );
				var w1 = new Vec2f( this.mTexCoords0[index1*2+0], this.mTexCoords0[index1*2+1] );
				var w2 = new Vec2f( this.mTexCoords0[index2*2+0], this.mTexCoords0[index2*2+1] );
		
				var x1 = v1.x() - v0.x();
				var x2 = v2.x() - v0.x();
				var y1 = v1.y() - v0.y();
				var y2 = v2.y() - v0.y();
				var z1 = v1.z() - v0.z();
				var z2 = v2.z() - v0.z();
		
				var s1 = w1.x() - w0.x();
				var s2 = w2.x() - w0.x();
				var t1 = w1.y() - w0.y();
				var t2 = w2.y() - w0.y();
		
				var r = 1.0 / (s1 * t2 - s2 * t1);
				var tangent = new Vec3f((t2 * x1 - t1 * x2) * r, (t2 * y1 - t1 * y2) * r, (t2 * z1 - t1 * z2) * r);
		

				this.mTangents.set( tangent.components, index0 );
				this.mTangents.set( tangent.components, index1 );
				this.mTangents.set( tangent.components, index2 );
			}
		
			n = getNumVertices();
			for( var i = 0; i < n; ++i ) {
				var normal = new Vec3f( this.mNormals[i*3+0], this.mNormals[i*3+1], this.mNormals[i*3+2] );
				var tangent = new Vec3f( this.mTangents[i*3+0], this.mTangents[i*3+1], this.mTangents[i*3+2] );
				var newTangent = (tangent.sub(normal.multEq(normal.dot(tangent)))).normalized();
				this.mTangents[i*3+0] = newTangent.components[0];
				this.mTangents[i*3+1] = newTangent.components[1];
				this.mTangents[i*3+2] = newTangent.components[2]; 
			}
		
			this.mTangentsDims = 3;
		}
	},
	getPrimitive: function () { return GEOM.Primitive.TRIANGLES; },
	getAttribDims: function (geomAttr) { 
		switch( geomAttr ) {
			case GEOM.Attrib.POSITION: return this.mPositionsDims;
			case GEOM.Attrib.COLOR: return this.mColorsDims;
			case GEOM.Attrib.TEX_COORD_0: return this.mTexCoords0Dims;
			case GEOM.Attrib.TEX_COORD_1: return this.mTexCoords1Dims;
			case GEOM.Attrib.TEX_COORD_2: return this.mTexCoords2Dims;
			case GEOM.Attrib.TEX_COORD_3: return this.mTexCoords3Dims;
			case GEOM.Attrib.NORMAL: return this.mNormalsDims;
			case GEOM.Attrib.TANGENT: return this.mTangentsDims;
			default:
				return 0;
		}
		
	},
	// TODO: do these two protected functions ALSO THIS IS RETURNING AN OBJECT WITH REQUESTED INFORMATION
	getAttribPointer: function( geomAttr ) {
		switch( geomAttr ) {
			case GEOM.Attrib.POSITION: return { resultPtr: this.mPositions, resultStrideBytes: 0, resultDims: this.mPositionsDims }; break;
			case GEOM.Attrib.COLOR: return { resultPtr: this.mColors, resultStrideBytes: 0, resultDims: this.mColorsDims }; break;
			case GEOM.Attrib.TEX_COORD_0: return { resultPtr: this.mTexCoords0, resultStrideBytes: 0, resultDims: this.mTexCoords0Dims }; break;
			case GEOM.Attrib.TEX_COORD_1: return { resultPtr: this.mTexCoords1, resultStrideBytes: 0, resultDims: this.mTexCoords1Dims }; break;
			case GEOM.Attrib.TEX_COORD_2: return { resultPtr: this.mTexCoords2, resultStrideBytes: 0, resultDims: this.mTexCoords2Dims }; break;
			case GEOM.Attrib.TEX_COORD_3: return { resultPtr: this.mTexCoords3, resultStrideBytes: 0, resultDims: this.mTexCoords3Dims }; break;
			case GEOM.Attrib.NORMAL: return { resultPtr: this.mNormals, resultStrideBytes: 0, resultDims: mNormalsDims }; break;
			case GEOM.Attrib.TANGENT: return { resultPtr: this.mTangents, resultStrideBytes: 0, resultDims: mTangentsDims }; break;
			default:
				return { resultPtr: null, resultStrideBytes: 0, resultDims: 0 };
		}
	},
	copyAttrib: function( geomAttr, dims, stride, srcData, numPositions ) {
		if( this.getAttribDims( geomAttr ) == 0 )
			return;
	
		switch( geomAttr ) {
			case GEOM.Attrib.POSITION:
				GEOM.copyData( dims, srcData, numPositions, this.mPositionsDims, 0, this.mPositions );
			break;
			case GEOM.Attrib.COLOR:
				GEOM.copyData( dims, srcData, numPositions, this.mColorsDims, 0, this.mColors );
			break;
			case GEOM.Attrib.TEX_COORD_0:
				GEOM.copyData( dims, srcData, numPositions, this.mTexCoords0Dims, 0, this.mTexCoords0 );
			break;
			case GEOM.Attrib.TEX_COORD_1:
				GEOM.copyData( dims, srcData, numPositions, this.mTexCoords1Dims, 0, this.mTexCoords1 );
			break;
			case GEOM.Attrib.TEX_COORD_2:
				GEOM.copyData( dims, srcData, numPositions, this.mTexCoords2Dims, 0, this.mTexCoords2 );
			break;
			case GEOM.Attrib.TEX_COORD_3:
				GEOM.copyData( dims, srcData, numPositions, this.mTexCoords3Dims, 0, this.mTexCoords3 );
			break;
			case GEOM.Attrib.NORMAL:
				GEOM.copyData( dims, srcData, numPositions, 3, 0, this.mNormals );
			break;
			case GEOM.Attrib.TANGENT:
				GEOM.copyData( dims, srcData, numPositions, 3, 0, this.mTangents );
			break;
			default:
				throw GEOM.ExcMissingAttrib();
		}
	},
};

// TODO: do these static functions 

TriMesh.create = function ( indices, colors, normals, positions, texCoords ){

};

	/*! Subdivide vectors of vertex data into a TriMesh \a division times. Division less
	 than 2 returns the original mesh. 
	static TriMesh		subdivide( std::vector<uint32_t> &indices, const std::vector<ci::ColorAf>& colors, 
								  const std::vector<Vec3f> &normals, const std::vector<Vec3f> &positions,
								  const std::vector<Vec2f> &texCoords,
								  uint32_t division = 2, bool normalize = false );

	//! Subdivide a TriMesh \a division times. Division less than 2 returns the original mesh.
	static TriMesh		subdivide( const TriMesh &triMesh, uint32_t division = 2, bool normalize = false );	

*/

TriMesh.Format = function (argument) {
	
};



///////////////////////////////////////////////////////////////////////////
// TriMeshGeomTarget Class, inherits from Geom target TODO: Implement GEOM.Target
///////////////////////////////////////////////////////////////////////////
function TriMeshGeomTarget( mesh ) {
	GEOM.Target.call(this);
	this.mMesh = mesh;
};

TriMeshGeomTarget.prototype = Object.create( GEOM.Target.prototype );
TriMeshGeomTarget.prototype.getPrimitive = function () {
	return GEOM.Primitive.TRIANGLES;
};
TriMeshGeomTarget.prototype.getAttribDims = function (geomAttrib) {
	return this.mMesh.getAttribDims(geomAttrib);
};
TriMeshGeomTarget.prototype.copyAttrib = function (geomAttrib, dims, strideBytes, srcArray, count) {
	this.mMesh.copyAttrib( geomAttrib, dims, strideBytes, srcArray, count );
}
TriMeshGeomTarget.prototype.copyIndices = function ( geomPrimitive, srcArray, numIndices, arrayType) {
	this.mMesh.mIndices = new Uint32Array( numIndices );
	this.copyIndexDataForceTriangles( geomPrimitive, srcArray, numIndices, this.mMesh.mIndices );
}
















