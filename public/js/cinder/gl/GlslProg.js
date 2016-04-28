function GlslProg (format) {
	
	this.mId 				= cinder.getGl().createProgram();
	this.mUniformLocations 	= {};
	this.mAttribLocations	= {};
	this.mActiveAttribTypes = {};
	this.mActiveUniformTypes= {};
	this.mAttribSemantics 	= {};
	this.mUniformSemantics  = {};
	this.mActiveAttribTypesCached = false;
	this.mUniformNameToSemanticMap = this.sDefaultUniformNameToSemanticMap;
	this.mAttribNameToSemanticMap = this.sDefaultAttribNameToSemanticMap;
	this.init(format);

	return this;
}

GlslProg.prototype.constructor = GlslProg;
GlslProg.prototype.getId 				= function () { return this.mId; };
GlslProg.prototype.getUniLocObj	= function () { return this.mUniformLocations; };
GlslProg.prototype.getAttribLocObj = function () { return this.mAttribLocations; };
GlslProg.prototype.setUniformLocations 	= function (uniLoc) { this.mUniformLocations };

GlslProg.prototype.bind = function () { cinder.getContext().bindGlslProg(this); },
GlslProg.prototype.bindImpl = function () { cinder.getGl().useProgram(this.mId); },
GlslProg.prototype.unbind = function () { cinder.getContext().bindGlslProg(null); },
GlslProg.prototype.delete = function () { cinder.getGl().deleteProgram(this.getId()); }, 

GlslProg.prototype.init = function (format) { 
	if( format.vertex ) {
		this.loadShader( format.vertex, cinder.getGl().VERTEX_SHADER );
	}
	if( format.fragment ) {
		this.loadShader( format.fragment, cinder.getGl().FRAGMENT_SHADER );
	}

	// copy the Format's attribute-semantic map
	var attribSemantics = format.getAttribSemantics();
	for( var attribSemantic in attribSemantics ) {
		this.mAttribNameToSemanticMap[attribSemantic] = attribSemantics[attribSemantic];
	}

	// copy the Format's uniform-semantic map
	var uniformSemantics = format.getUniformSemantics();
	for( var uniformSemantic in uniformSemantics ) {
		mUniformNameToSemanticMap[uniformSemantic] = uniformSemantics[uniformSemantic];
	}

	// THESE sections take all attribute locations which have been specified (either by their semantic or their names)
	// and ultimately maps them via glBindAttribLocation, which must be done ahead of linking
	var attribLocations = format.getAttribNameLocations();
	
	// map the locations-specified semantics to their respective attribute name locations
	var attribSemanticLocations = format.getAttribSemanticLocations();
	for( var semanticLoc in attribSemanticLocations ) {
		var attribName;
		// first find if we have an attribute associated with a given semantic
		for( var attribSemantic in this.mAttribNameToSemanticMap ) {
			if( this.mAttribNameToSemanticMap[attribSemantic] === semanticLoc ) {
				attribName = attribSemantic;
				break;
			}
		}
		
		// if we found an appropriate attribute-semantic pair, set attribLocations[attrib name] to be the semantic location
		if( attribName )
			attribLocations[attribName] = getAttribSemanticLocations[semanticLoc];
	}

	for( var name in attribLocations ) {
		cinder.getGl().bindAttribLocation( this.getId(), format.attribLocations[name], name);
	}

	cinder.getGl().linkProgram( this.getId() );
};
GlslProg.prototype.loadShader = function (str, shaderType) {
	var shader = cinder.getGl().createShader(shaderType);
	cinder.getGl().shaderSource(shader, str);
	cinder.getGl().compileShader( shader );

	if( ! cinder.getGl().getShaderParameter( shader, cinder.getGl().COMPILE_STATUS) ) {
		alert( cinder.getGl().getShaderInfoLog( shader ) );
		throw "Error compiling GlslProg";
	}
	cinder.getGl().attachShader( this.getId(), shader );
};
GlslProg.prototype.sDefaultUniformNameToSemanticMap = {
	"ciModelView" 			: gl.UNIFORM_MODELVIEW,
	"ciModelViewProjection" : gl.UNIFORM_MODELVIEWPROJECTION,
	"ciProjection"			: gl.UNIFORM_PROJECTION,
	"ciNormalMatrix"		: gl.UNIFORM_NORMAL_MATRIX
}
GlslProg.prototype.sDefaultAttribNameToSemanticMap = {
	"ciPosition"   : GEOM.Attrib.POSITION,
	"ciNormal"     : GEOM.Attrib.NORMAL,
	"ciTangent"    : GEOM.Attrib.TANGENT,
	"ciTexCoord0"  : GEOM.Attrib.TEX_COORD_0,
	"ciTexCoord1"  : GEOM.Attrib.TEX_COORD_1,
	"ciTexCoord2"  : GEOM.Attrib.TEX_COORD_2,
	"ciTexCoord3"  : GEOM.Attrib.TEX_COORD_3,
	"ciColor"      : GEOM.Attrib.COLOR,
	"ciBoneIndex"  : GEOM.Attrib.BONE_INDEX,
	"ciBoneWeight" : GEOM.Attrib.BONE_WEIGHT
};
GlslProg.prototype.getActiveUniformTypes = function () {
	if( ! this.mActiveUniformTypesCached ) {
		var cGl = cinder.getGl();
		var numActiveUniforms = cGl.getProgramParameter( this.mId, cGl.ACTIVE_UNIFORMS );
		
		for( var i = 0; i < numActiveUniforms; ++i ) {
			var object = cGl.getActiveUniform( this.mId, i );
			this.mActiveUniformTypes[object.name] = object.type;
		}
		this.mActiveUniformTypesCached = true;
	}

	return this.mActiveUniformTypes;
};
GlslProg.prototype.getActiveAttribTypes = function () {
	if( ! this.mActiveAttribTypesCached ) {
		var cGl = cinder.getGl();
		var numActiveAttrs = cGl.getProgramParameter( this.mId, cGl.ACTIVE_ATTRIBUTES );
		
		for( var i = 0; i < numActiveAttrs; ++i ) {
			var object = cGl.getActiveAttrib( this.mId, i );
			this.mActiveAttribTypes[object.name] = object.type;
		}
		this.mActiveAttribTypesCached = true;
	}
	console.log("mActiveAttribTypes", this.mActiveAttribTypes);
	return this.mActiveAttribTypes;
};
GlslProg.prototype.getUniformSemantics = function () {
	if( ! this.mUniformSemanticsCached ) {
		var activeUniformTypes = this.getActiveUniformTypes();
		for( var activeUnifIt in activeUniformTypes ) {
			// first find this active uniform by name in the mUniformNameToSemanticMap
			var semantic = this.mUniformNameToSemanticMap[activeUnifIt];
			if( semantic !== undefined ) {
				// found this semantic, add it mUniformSemantics
				this.mUniformSemantics[activeUnifIt] = semantic;
			}
		}
	
		this.mUniformSemanticsCached = true;
	}
	return this.mUniformSemantics;
}
GlslProg.prototype.getAttribSemantics = function () {
	if( ! this.mAttribSemanticsCached ) {
		var activeAttrTypes = this.getActiveAttribTypes();
		for( var activeAttrIt in activeAttrTypes ) {
			// first find this active attribute by name in the mAttrNameToSemanticMap
			var semantic = this.mAttribNameToSemanticMap[activeAttrIt];
			if( semantic !== undefined ) {
				// found this semantic, add it mAttrSemantics
				this.mAttribSemantics[activeAttrIt] = semantic;
			}
		}
	
		this.mAttribSemanticsCached = true;
	}
	return this.mAttribSemantics;
};
GlslProg.prototype.getAttribSemanticLocation = function( geomAttrib ) {
	var semantics = this.getAttribSemantics();
	for( var semIt in semantics ) {
		if( semantics[semIt] === geomAttrib ) {
			return this.getAttribLocation( semIt );
		}
	}
	
	return -1;
};
GlslProg.prototype.uniform = function (name, uniform) {
	this.bind();

	var uniformLoc = this.getUniformLocation(name);
	if( uniform.type ) {
		switch( uniform.type ) {
			case CINDER.TYPES.VEC2I: {
				cinder.getGl().uniform2iv( uniformLoc, uniform.components );
			}
			break;
			case CINDER.TYPES.VEC2F: {
				cinder.getGl().uniform2fv( uniformLoc, uniform.components );
			}
			break;
			case CINDER.TYPES.VEC3I: {
				cinder.getGl().uniform3iv( uniformLoc, uniform.components );
			}
			break;
			case CINDER.TYPES.VEC3F: {
				cinder.getGl().uniform3fv( uniformLoc, uniform.components );
			}
			break;
			case CINDER.TYPES.VEC4I: {
				cinder.getGl().uniform4iv( uniformLoc, uniform.components );
			}
			break;
			case CINDER.TYPES.VEC4F: {
				cinder.getGl().uniform4iv( uniformLoc, uniform.components );
			}
			break;
			case CINDER.TYPES.MAT2F: {
				cinder.getGl().uniformMatrix2fv( uniformLoc, false, uniform.components);
			}
			break;
			case CINDER.TYPES.MAT3F: {
				cinder.getGl().uniformMatrix3fv( uniformLoc, false, uniform.components);
			}
			break;
			case CINDER.TYPES.MAT4F: {
				cinder.getGl().uniformMatrix4fv( uniformLoc, false, uniform.components);
			}
			break;
			case CINDER.TYPES.C8U: {
				cinder.getGl().uniform3iv( uniformLoc, uniform.components );
			}
			break;
			case CINDER.TYPES.CF: {
				cinder.getGl().uniform3fv( uniformLoc, uniform.components );
			}
			break;
			case CINDER.TYPES.CFA: {
				cinder.getGl().uniform4fv( uniformLoc, uniform.components );
			}
			break;
			case CINDER.TYPES.C8U: {
				cinder.getGl().uniform3iv( uniformLoc, uniform.components );
			}
			break;
			case CINDER.TYPES.C8A: {
				cinder.getGl().uniform3iv( uniformLoc, uniform.components );
			}
			break;
			default: 
				throw "ERROR: GlslProg.Uniform - I don't know that type";
		}
	}
	else {
		// TODO: Figure this out
		if( typeof uniform === "number" ) {
			cinder.getGl().uniform1i( uniformLoc, uniform );
		}
	}
};
GlslProg.prototype.getUniformLocation = function (name) {
	if( this.getUniLocObj()[name] === undefined ) {
		return this.getUniLocObj()[name] = cinder.getGl().getUniformLocation( this.getId(), name );
	}
	else {
		return this.getUniLocObj()[name];
	}
};
GlslProg.prototype.getAttribLocation = function (name) {
	if( this.getAttribLocObj()[name] !== undefined ) {
		return this.getAttribLocObj()[name];
	}
	else {
		return this.getAttribLocObj()[name] = cinder.getGl().getAttribLocation( this.getId(), name );
	}
};


GlslProg.create = function (format) {
	return new GlslProg(format);
};

GlslProg.Format = function () {
	this.vertex = null;
	this.fragment = null;
	this.mAttribLocMap = {};
	this.mAttribNameLocMap = {};
	this.mAttribSemanticLocMap = {};
	this.mUniformSemanticMap = {};
	this.mAttribSemanticMap = {};
	return this;
};

GlslProg.Format.prototype.vertexStr = function (str) {
	this.vertex = str;
	return this;
};
GlslProg.Format.prototype.fragmentStr = function (str) {
	this.fragment = str;
	return this;
};
GlslProg.Format.prototype.vertexId = function (vertexId) {
	var vertContent = document.getElementById( vertexId ).textContent;
	this.vertex = vertContent;
	return this;
};
GlslProg.Format.prototype.fragmentId = function (fragmentId) {
	var vertContent = document.getElementById( fragmentId ).textContent;
	this.fragment = vertContent;
	return this;
};
GlslProg.Format.prototype.attrib = function (geomAttrib, name) {
	mAttribSemanticMap[name] = geomAttrib;
	return this;
};
GlslProg.Format.prototype.uniform = function (uniformSemantic, name) {
	mUniformSemanticMap[name] = uniformSemantic;
	return this;
};
GlslProg.Format.prototype.attribLocation = function (attribName, location) {

};
GlslProg.Format.prototype.getAttribSemantics = function () {
	return this.mAttribSemanticMap;
};
GlslProg.Format.prototype.getUniformSemantics = function () {
	return this.mUniformSemanticMap;
};
GlslProg.Format.prototype.getAttribNameLocations = function () {
	return this.mAttribNameLocMap;
};
GlslProg.Format.prototype.getAttribSemanticLocations = function () {
	return this.mAttribSemanticLocMap;
};


