function OrigDim(d0, d1, d2, d3) {
	switch(arguments.length) {
		case 0: this.setToNull(); break;
		case 1: this.setFromOrigDim(d0); break;
		case 2: this.setFromVec2I(d0, d1); break;
		case 4: this.setFromElements(d0, d1, d2, d3); break;
	}

	return this;
};

OrigDim.prototype.setFromElements = function(origX, origY, dimX, dimY) {
	this.components = new Uint32Array([origX, origY, dimX, dimY]);
};
OrigDim.prototype.setFromVec2I = function(origin, dimension) {
	this.components = new Uint32Array([origin.x(), origin.y(), dimension.x(), dimension.y()]);
};
OrigDim.prototype.setFromOrigDim = function(origDim) {
	this.components = new Uint32Array(origDim.components);
};
OrigDim.prototype.setToNull = function() {
	this.components = new Uint32Array(4);
};