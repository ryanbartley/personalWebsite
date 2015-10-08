function ShaderDef () {

	this.mTextureMapping = false;
	this.mColor = false;	
	
	return this;
};

ShaderDef.prototype.color = function() {
	this.mColor = true;
	return this;
};
ShaderDef.prototype.texture = function (texture) {
	// TODO: figure out what to do with texture
	this.mTextureMapping = true;
	return this;
}

ShaderDef.generateVertexShader = function (shaderDef) {
	var s = "";
	s +=		"uniform mat4	ciModelViewProjection;\n" +
				"\n" +
				"attribute vec4		ciPosition;\n" 
				;
			
	if( shaderDef.mTextureMapping ) {
		s +=	"attribute vec2		ciTexCoord0;\n" +
				"varying highp vec2	TexCoord;\n"
				;
	}
	if( shaderDef.mColor ) {
		s +=	"attribute vec4		ciColor;\n" +
				"varying vec4		Color;\n"
				;
	}

	s +=		"void main( void )\n" +
				"{\n" +
				"	gl_Position	= ciModelViewProjection * ciPosition;\n" 
				;
				
	if( shaderDef.mTextureMapping ) {	
		s +=	"	TexCoord = ciTexCoord0;\n"
				;
	}
	if( shaderDef.mColor ) {
		s +=	"	Color = ciColor;\n"
				;
	}
	
	s +=		"}\n";
	
	return s;
};

ShaderDef.generateFragmentShader = function (shaderDef) {
	var s = "";

	s +=		"precision highp float;\n"
				;

	if( shaderDef.mTextureMapping ) {	
		s +=	"uniform sampler2D	uTex0;\n" +
				"varying highp vec2	TexCoord;\n"
				;
	}
	if( shaderDef.mColor ) {
		s +=	"varying lowp vec4	Color;\n"
				;
	}

	s +=		"void main( void )\n" +
				"{\n"
				;
	
	if( shaderDef.mTextureMapping && shaderDef.mColor ) {
		s +=	"	gl_FragColor = texture2D( uTex0, TexCoord.st ) * Color;\n"
				;
	}
	else if( shaderDef.mTextureMapping ) {
		s +=	"	gl_FragColor = texture2D( uTex0, TexCoord.st );\n"
				;
	}
	else if( shaderDef.mColor ) {
		s +=	"	gl_FragColor = Color;\n"
				;
	}
	
	s +=		"}\n"
				;
	
	return s;
}

ShaderDef.buildShader = function (shaderDef) {
	return GlslProg.create( 
		new GlslProg.Format()
			.vertexStr( ShaderDef.generateVertexShader( shaderDef ) )
			.fragmentStr( ShaderDef.generateFragmentShader( shaderDef ) )
	);
}