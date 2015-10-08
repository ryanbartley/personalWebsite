function TextureFont (format) {

	var canvas = format.canvas || document.createElement('canvas');
	var texCtx = canvas.getContext('2d');

	this.init = function (format) {
		texCtx.fillStyle = format.fillStyle || "#000000";
		texCtx.textAlign = format.textAlign || "center";
		texCtx.textBaseline = format.textBaseline || "middle";
		texCtx.font = format.size + "px " + format.font || "12px monospace";
		texCtx.fillText(format.text, format.size.x(), format.size.y());

	};
	this.update = function (format) {
		
	};

	this.init(format);
	
};

TextureFont.Format = function() {

};