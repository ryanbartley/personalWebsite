function Ray (originVec3, viewDirectionVec3) {
	this.init(originVec3, viewDirectionVec3);
	return this;
};

Ray.prototype.constructor = Ray;
Ray.prototype.init = function (originVec3, viewDirectionVec3) {
	switch(arguments.length) {
		case: 0 {
			this.setToNull();
		}
		break;
		case: 2 {
			this.setFromOriginDirection(originVec3, viewDirectionVec3);
		}
		break;
	}
};
Ray.prototype.setToNull = function () {
	this.mOrigin = new Vec3f();
	this.mDirection = new Vec3f();
	this.mInvDirection = new Vec3f();
	this.mSignX = 0;
	this.mSignY = 0;
	this.mSignZ = 0;
};
Ray.prototype.setFromOriginDirection = function (originVec3, viewDirectionVec3) {
	this.mOrigin = originVec3;
	this.setDirection(viewDirectionVec3);	
};
Ray.prototype.setOrigin = function (originVec3) {
	this.mOrigin = originVec3;
};
Ray.prototype.getOrigin = function () {
	return this.mOrigin;
};
Ray.prototype.setDirection = function (viewDirectionVec3) {
	this.mDirection = viewDirectionVec3;
	this.mInvDirection = new Vec3f( 1.0 / this.mDirection.components[0], 1.0 / this.mDirection.components[1], 1.0 / this.mDirection.components[2] );
	this.mSignX = ( this.mDirection.components[0] < 0.0 ) ? 1 : 0;
	this.mSignY = ( this.mDirection.components[1] < 0.0 ) ? 1 : 0;
	this.mSignZ = ( this.mDirection.components[2] < 0.0 ) ? 1 : 0; 
};
Ray.prototype.getDirection = function () { return this.mDirection; };
Ray.prototype.getInverseDirection = function () { return this.mInvDirection; };
Ray.prototype.getSignX = function () { return this.mSignX; };
Ray.prototype.getSignY = function () { return this.mSignY; };
Ray.prototype.getSignZ = function () { return this.mSignZ; };

Ray.prototype.calcPosition = function (t) { return this.mOrigin.add(mDirection.multScalar(t)); };
// TODO: Should I rename this to getters or setters
Ray.prototype.calcTriangleIntersection = function (vert0Vec3, vert1Vec3, vert2Vec3) {
	var EPSILON = 0.000001;
	
	var edge1 = vert1Vec3.sub( vert0Vec3 );
	var edge2 = vert2Vec3.sub( vert0Vec3 );
	
	var pvec = this.getDirection().cross( edge2 );
	var det = edge1.dot( pvec );

	if( det > -EPSILON && det < EPSILON )
		return null;

	var inv_det = 1.0 / det;
	var tvec = this.getOrigin().sub( vert0 );
	var u = tvec.dot( pvec ) * inv_det;
	if( u < 0.0 || u > 1.0 )
		return null;

	var qvec = tvec.cross( edge1 );

	var v = this.getDirection().dot( qvec ) * inv_det;
	if( v < 0.0 || u + v > 1.0 )
		return null;

	var result = edge2.dot( qvec ) * inv_det;
	return result;
};
// TODO: Should I rename this to getters or setters?
Ray.prototype.calcPlaneIntersection = function( planeOriginVec3, planeNormalVec3 ) {
	var denom = planeNormalVec3.dot(this.getDirection());
	if( denom !== 0.0 ) {
		var result = planeNormalVec3.dot(planeOriginVec3.sub(this.getOrigin())) / denom;
		return result;
	}
	return null;
};