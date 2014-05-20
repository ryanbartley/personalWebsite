function CINDER (canvasId, mApp, attributes) {

	var mContext = new CINDER.Context(canvasId, attributes);
	var mSize 	= new Vec2i( mContext.getCanvas().width, mContext.getCanvas().height );

	this.getGl = function () { return mContext.getGl(); };
	this.getContext = function () { return mContext; };
	this.getCanvas = function () { return mContext.getCanvas(); }
	this.getSize = function () { return mSize; };
	this.getWindowWidth = function () { return mSize.x; };
	this.getWindowHeight = function () { return mSize.y; };
	this.getAspectRatio = function () { return mSize.x() / mSize.y(); };
	this.getApp = function () { return mApp; };
	this._setUpSignals = function() {
		// TODO: add the rest of the events
		var canvas = this.getCanvas();
		if( mApp.mouseDown ) {
			canvas.addEventListener("mousedown", function (ev) {
				this.mouseDown = true;
				mApp.mouseDown(new MouseEvent(ev));
			}, false);
		}
		if( mApp.mouseUp ) {
			canvas.addEventListener("mouseup", function (ev) {
				this.mouseDown = false;
				mApp.mouseUp(new MouseEvent(ev));
			}, false);
		}
		if( mApp.mouseDrag ) {
			canvas.addEventListener("mousemove", function (ev) {
				if( this.mouseDown ) {
					mApp.mouseDrag(new MouseEvent(ev));
				}
			}, false);
		}
		if( mApp.keyDown ) {
			console.log("I am about to add")
			window.addEventListener("keydown", function(ev) {
				console.log(ev);
			}, false);
		}
	};

	window.cinder 	= this;
	var mApp		= new mApp();
	this.mouseDown 	= false;

	mContext.init();

	this._applicationSetup = function () {
		this._setUpSignals();

		mApp.setup();
	};

	this._work = function () {
		requestAnimationFrame(this._work.bind(this));
		
		mApp.update();
		
		mApp.draw();

	};

	this._applicationSetup();
	this._work();

	return this;
};

CINDER.Attributes = function () {
	this.alpha = true;
	this.depth = true;
	this.stencil = false;
	this.antialias = true;
	this.premultipliedAlpha = true;
	this.preserveDrawingBuffer = false;
	return this;	
};
CINDER.GetExtensionEarly = function(str) {
	//TODO: See if this will be a problem
	var tCanvas = document.createElement('canvas');
	var tgl = tCanvas.getContext("experimental-webgl");
	var ext = tgl.getExtension(str);
	if( !ext ) {

		// try the browser dependent versions
		var moz = "MOZ_" + str;
		ext = tgl.getExtension(moz);
		if( ext ) {
			return ext;
		} 

		// try webkit 
		var web = "WEBKIT_" + str;
		ext = tgl.getExtension(web);
		if( ext ) {
			return ext;
		}

		throw "ERROR: CINDER.GetExtensionEarly - Extension " + str + " not found"; 
	}
	else {
		return ext;
	}
};
CINDER.TYPES = {
		// Vector Delineations
		VEC2I: 0,
		VEC2F: 1,
		VEC3I: 2,
		VEC3F: 3,
		VEC4I: 4,
		VEC4F: 5,
		// Matrix Delineations
		MAT2F: 6,
		MAT3F: 7,
		MAT4F: 8,
		MAT2AF: 9,
		// Quaternion Delineations
		QUATF: 10,
		// Color Delineations
		C8U: 11,
		CF: 12,
		C8A: 13,
		CFA: 14,
		// GL TYPES
		FBO: 15,
		TEX: 16
};