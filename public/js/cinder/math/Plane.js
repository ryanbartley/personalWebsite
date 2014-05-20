function Planef (d0, d1, d2, d3) {
	PlaneBase.call(this, Vec3f);

	switch(arguments.length) {
		case 0: {
			this.setToNull();
		}
		break;
		case 2: {
			this.setFromPointNormal(d0, d1);
		}
		break;
		case 3: {
			this.setFrom3Points(d0, d1, d2);
		}
		break;
		case 4: {
			this.setFromElements(d0, d1, d2, d3);
		}
		break;
	}

	return this;
}

Planef.prototype = Object.create( PlaneBase.prototype );
Planef.prototype.constructor = Planef;

function PlaneBase (vec3Type) {
	this.VEC3_TYPE = vec3Type;
};

PlaneBase.prototype.constructor = PlaneBase;
PlaneBase.prototype.setToNull = function () {
	this.mDistance = 0;
	this.mNormal = new this.VEC3_TYPE();	
};
PlaneBase.prototype.setFrom3Points = function(v1Vec3, v2Vec3, v3Vec3) {
	var normal = ( v2Vec3.sub(v1Vec3) ).cross( v3Vec3.sub(v1Vec3) );
	
	if( normal.lengthSquared() == 0 )
		 // error! invalid parameters
		throw "ERROR: PlaneBase.setFrom3Points - Length = 0";

	this.mNormal = normal.normalized();
	this.mDistance = this.mNormal.dot( v1Vec3 );
};
PlaneBase.prototype.setFromPointNormal = function (pointVec3, normalVec3) {
	if( normal.lengthSquared() == 0 )
		 // error! invalid parameters
		throw "ERROR: PlaneBase.setFromPointNormal - Length = 0";

	this.mNormal = normalVec3.normalized();
	this.mDistance = this.mNormal.dot( pointVec3 );
};
PlaneBase.prototype.setFromElements = function (a, b, c, d) {
	var normal = new this.VEC3_TYPE( a, b, c );

	var length = normal.length();
	if( length == 0 )
		 // error! invalid parameters
		throw "ERROR: PlaneBase.setFromElements - Length = 0";

	this.mNormal = normal.normalized();
	this.mDistance = d / length;
};
PlaneBase.prototype.getPoint = function () { return this.mNormal.multScalar(this.mDistance); };
PlaneBase.prototype.getNormal = function () { return this.mNormal; };
PlaneBase.prototype.getDistance = function () { return this.mDistance; };
PlaneBase.prototype.distance = function (pVec3) { 
	return (this.mNormal.dot(pVec3) - this.mDistance); 
};
PlaneBase.prototype.reflectPoint = function (pVec3) { 
	return this.mNormal.multScalar(this.distance(pVec3)*-2).add(pVec3); 
};
PlaneBase.prototype.reflectVector = function (vVec3) { 
	return this.mNormal.multScalar(this.mNormal.dot(vVec3)*2).sub(vVec3); 
};