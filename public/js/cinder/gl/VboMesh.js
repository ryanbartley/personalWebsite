function VboMesh (format) {
	
};

VboMesh.prototype = function() {
	constructor: VboMesh,
};

VboMesh.Format = function () {
	this.elementVbo = null;
	this.positionVbo = null;
	this.colorVbo = null;
	this.normalVbo = null;
};

VboMesh.Format.prototype = function() {
	constructor: VboMesh.Format,

	setElementVbo: function (vbo) {
		this.elementVbo = vbo;
	},

	setPositionVbo: function (vbo) {
		this.positionVbo = vbo;
	},

	setColorVbo: function (vbo) {
		this.colorVbo = vbo;
	},

	setNormalVbo: function (vbo) {
		this.normalVbo = vbo;
	}
};