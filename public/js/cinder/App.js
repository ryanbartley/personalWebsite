function App (CinderApp) {
		
};

App.prototype = {
	constructor: App,

	setup: function () {
		
	},

	shutdown: function () {
		
	},
	

	update: function () {
		
	},

	draw: function () {
		
	},

	
};

function MouseEvent (event) {
	this.mX = event.clientX;
	this.mY = event.clientY;
	this.mScreenX = event.screenX;
	this.mScreenY = event.screenY;
	this.mButton = event.button;
	this.mShiftDown = event.shiftKey;
	this.mAltDown = event.altKey;
	this.mCtrlDown = event.ctrlKey;
	this.mMetaDown = event.metaKey;
};

MouseEvent.prototype.constructor = MouseEvent;
MouseEvent.prototype.getPos = function () { return new Vec2i(this.mX, this.mY); };
MouseEvent.prototype.getX = function () { return this.mX; };
MouseEvent.prototype.getY = function () { return this.mY; };
MouseEvent.prototype.getScreenPos = function () { return new Vec2i(this.mScreenX, this.mScreenY); };
MouseEvent.prototype.getScreenX = function () { return this.mScreenX; };
MouseEvent.prototype.getScreenY = function () { return this.mScreenY; };
MouseEvent.prototype.isLeft = function () { return (this.mButton === 0); };
MouseEvent.prototype.isMiddle = function () { return (this.mButton === 1); };
MouseEvent.prototype.isRight = function () { return (this.mButton === 2); };
MouseEvent.prototype.isShiftDown = function () { return this.mShiftDown; };
MouseEvent.prototype.isAltDown = function () { return this.mAltKeyDown; };
MouseEvent.prototype.isCtrlDown = function () { return this.mCtrlDown; };
MouseEvent.prototype.isMetaDown = function () { return this.mMetaDown; };

function KeyEvent (event) {
	this.mCode = event.;
	this.mChar32 = ;
	this.mChar = ;
	this.mModifiers = ;
	this.mNativeKeyCode = ;
	this.mWindow = ;
	this.mShiftDown = event.shiftKey;
	this.mAltDown = event.altKey;
	this.mCtrlDown = event.ctrlKey;
	this.mMetaDown = event.metaKey;
};

KeyEvent.prototype.constructor = KeyEvent;

//! Returns the ASCII character associated with the event.
KeyEvent.prototype.getChar = function () { return mChar; }
//! Returns the UTF-32 character associated with the event.
KeyEvent.prototype.getCharUtf32 = function () { return mChar32; } 
//! Returns the key code associated with the event, which maps into the enum listed below
KeyEvent.prototype.getCode = function () { return mCode; }
//! Returns whether the Shift key was pressed during the event.
MouseEvent.prototype.isShiftDown = function () { return this.mShiftDown; };
//! Returns whether the Alt (or Option) key was pressed during the event.
MouseEvent.prototype.isAltDown = function () { return this.mAltKeyDown; };
//! Returns whether the Control key was pressed during the event.
MouseEvent.prototype.isCtrlDown = function () { return this.mCtrlDown; };
//! Returns whether the meta key was pressed during the event. Maps to the Windows key on Windows and the Command key on Mac OS X.
MouseEvent.prototype.isMetaDown = function () { return this.mMetaDown; };
//! Returns whether the accelerator key was pressed during the event. Maps to the Control key on Windows and the Command key on Mac OS X.
KeyEvent.prototype.isAccelDown = function () { return (mModifiers & ACCEL_DOWN) ? true : false; }	
//! Returns the platform-native key-code. Advanced users only.
KeyEvent.prototype.getNativeKeyCode = function () { return mNativeKeyCode; }


	//! Maps a platform-native key-code to the key code enum
	// static int		translateNativeKeyCode( int nativeKeyCode );


KeyEvent.KEY_UNKNOWN: 0;
KeyEvent.KEY_FIRST: 0;
KeyEvent.KEY_BACKSPACE: 8;
KeyEvent.KEY_TAB: 9;
KeyEvent.KEY_CLEAR: 12;
KeyEvent.KEY_RETURN: 13;
KeyEvent.KEY_PAUSE: 19;
KeyEvent.KEY_ESCAPE: 27;
KeyEvent.KEY_SPACE: 32;
KeyEvent.KEY_EXCLAIM: 33;
KeyEvent.KEY_QUOTEDBL: 34;
KeyEvent.KEY_HASH: 35;
KeyEvent.KEY_DOLLAR: 36;
KeyEvent.KEY_AMPERSAND: 38;
KeyEvent.KEY_QUOTE: 39;
KeyEvent.KEY_LEFTPAREN: 40;
KeyEvent.KEY_RIGHTPAREN: 41;
KeyEvent.KEY_ASTERISK: 42;
KeyEvent.KEY_PLUS: 43;
KeyEvent.KEY_COMMA: 44;
KeyEvent.KEY_MINUS: 45;
KeyEvent.KEY_PERIOD: 46;
KeyEvent.KEY_SLASH: 47;
KeyEvent.KEY_0: 48;
KeyEvent.KEY_1: 49;
KeyEvent.KEY_2: 50;
KeyEvent.KEY_3: 51;
KeyEvent.KEY_4: 52;
KeyEvent.KEY_5: 53;
KeyEvent.KEY_6: 54;
KeyEvent.KEY_7: 55;
KeyEvent.KEY_8: 56;
KeyEvent.KEY_9: 57;
KeyEvent.KEY_COLON: 58;
KeyEvent.KEY_SEMICOLON: 59;
KeyEvent.KEY_LESS: 60;
KeyEvent.KEY_EQUALS: 61;
KeyEvent.KEY_GREATER: 62;
KeyEvent.KEY_QUESTION: 63;
KeyEvent.KEY_AT: 64;

KeyEvent.KEY_LEFTBRACKET: 91;
KeyEvent.KEY_BACKSLASH: 92;
KeyEvent.KEY_RIGHTBRACKE: 93;
KeyEvent.KEY_CARET: 94;
KeyEvent.KEY_UNDERSCORE: 95;
KeyEvent.KEY_BACKQUOTE: 96;
KeyEvent.KEY_a: 97;
KeyEvent.KEY_b: 98;
KeyEvent.KEY_c: 99;
KeyEvent.KEY_d: 100;
KeyEvent.KEY_e: 101;
KeyEvent.KEY_f: 102;
KeyEvent.KEY_g: 103;
KeyEvent.KEY_h: 104;
KeyEvent.KEY_i: 105;
KeyEvent.KEY_j: 106;
KeyEvent.KEY_k: 107;
KeyEvent.KEY_l: 108;
KeyEvent.KEY_m: 109;
KeyEvent.KEY_n: 110;
KeyEvent.KEY_o: 111;
KeyEvent.KEY_p: 112;
KeyEvent.KEY_q: 113;
KeyEvent.KEY_r: 114;
KeyEvent.KEY_s: 115;
KeyEvent.KEY_t: 116;
KeyEvent.KEY_u: 117;
KeyEvent.KEY_v: 118;
KeyEvent.KEY_w: 119;
KeyEvent.KEY_x: 120;
KeyEvent.KEY_y: 121;
KeyEvent.KEY_z: 122;

KeyEvent.KEY_DELETE: 127;
KeyEvent.KEY_KP0: 256;
KeyEvent.KEY_KP1: 257;
KeyEvent.KEY_KP2: 258;
KeyEvent.KEY_KP3: 259;
KeyEvent.KEY_KP4: 260;
KeyEvent.KEY_KP5: 261;
KeyEvent.KEY_KP6: 262;
KeyEvent.KEY_KP7: 263;
KeyEvent.KEY_KP8: 264;
KeyEvent.KEY_KP9: 265;
KeyEvent.KEY_KP_PERIOD: 266;
KeyEvent.KEY_KP_DIVIDE: 267;
KeyEvent.KEY_KP_MULTIPLY: 268;
KeyEvent.KEY_KP_MINUS: 269;
KeyEvent.KEY_KP_PLUS: 270;
KeyEvent.KEY_KP_ENTER: 271;
KeyEvent.KEY_KP_EQUALS: 272;

KeyEvent.KEY_UP: 273;
KeyEvent.KEY_DOWN: 274;
KeyEvent.KEY_RIGHT: 275;
KeyEvent.KEY_LEFT: 276;
KeyEvent.KEY_INSERT: 277;
KeyEvent.KEY_HOME: 278;
KeyEvent.KEY_END: 279;
KeyEvent.KEY_PAGEUP: 280;
KeyEvent.KEY_PAGEDOWN: 281;

KeyEvent.KEY_F1: 282;
KeyEvent.KEY_F2: 283;
KeyEvent.KEY_F3: 284;
KeyEvent.KEY_F4: 285;
KeyEvent.KEY_F5: 286;
KeyEvent.KEY_F6: 287;
KeyEvent.KEY_F7: 288;
KeyEvent.KEY_F8: 289;
KeyEvent.KEY_F9: 290;
KeyEvent.KEY_F10: 291;
KeyEvent.KEY_F11: 292;
KeyEvent.KEY_F12: 293;
KeyEvent.KEY_F13: 294;
KeyEvent.KEY_F14: 295;
KeyEvent.KEY_F15: 296;

KeyEvent.KEY_NUMLOCK: 300;
KeyEvent.KEY_CAPSLOCK: 301;
KeyEvent.KEY_SCROLLOCK: 302;
KeyEvent.KEY_RSHIFT: 303;
KeyEvent.KEY_LSHIFT: 304;
KeyEvent.KEY_RCTRL: 305;
KeyEvent.KEY_LCTRL: 306;
KeyEvent.KEY_RALT: 307;
KeyEvent.KEY_LALT: 308;
KeyEvent.KEY_RMETA: 309;
KeyEvent.KEY_LMETA: 310;
KeyEvent.KEY_LSUPER: 311;		/* Left "Windows" key */
KeyEvent.KEY_RSUPER: 312;		/* Right "Windows" key */
KeyEvent.KEY_MODE: 313;		/* "Alt Gr" key */
KeyEvent.KEY_COMPOSE: 314;		/* Multi-key compose key */

KeyEvent.KEY_HELP: 315;
KeyEvent.KEY_PRINT: 316;
KeyEvent.KEY_SYSREQ: 317;
KeyEvent.KEY_BREAK: 318;
KeyEvent.KEY_MENU: 319;
KeyEvent.KEY_POWER: 320;		/* Power Macintosh power key */
KeyEvent.KEY_EURO: 321;		/* Some european keyboards */
KeyEvent.KEY_UNDO: 322;		/* Atari keyboard has Undo */