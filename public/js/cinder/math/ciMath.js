
MATH = {
 	sinx_over_x: function (x) {
		if( x * x < 1.19209290E-07 ) {
			return T( 1 );
		}
    	else {
    		return Math.sin( x ) / x;
    	}
    },

    toDegrees: function (x) { return x * 57.295779513082321; }, // ( x * 180 / PI )
    toRadians: function (x) { return x * 0.017453292519943295769; }, // ( x * PI / 180 )

    lerp: function (a, b, factor) { return a + ( b - a ) * factor; },
    lmap: function (val, inMin, inMax, outMin, outMax) { return outMin + (outMax - outMin) * ((val - inMin) / (inMax - inMin)); },
    bezierInterp: function (a, b, c, d, t) { 
        var t1 = 1.0 - t;
        return a*(t1*t1*t1) + b*(3*t*t1*t1) + c*(3*t*t*t1) + d*(t*t*t);
    },
    constrain: function (val, minVal, maxVal) {
        if(val < minVal) { return minVal; }
        else if( val > maxVal) { return maxVal; }
        else return maxVal;
    },
    log2floor: function (x) {
        var result = 0;
        while( x >>= 1 ) {
            ++result;
        }
        return result;
    },
    log2ceil: function (x) {
        var isNotPowerOf2 = (x & (x - 1));
        return ( isNotPowerOf2 ) ? ( MATH.log2floor( x ) + 1 ) : MATH.log2floor( x );
    },
    nextPowerOf2: function ( x ) {
        x |= (x >> 1);
        x |= (x >> 2);
        x |= (x >> 4);
        x |= (x >> 8);
        x |= (x >> 16);
        return (x+1);
    },
    EPSILON_VALUE: 4.37114e-05,
};