class Vector2{
	constructor(x, y){
		this.x = x || 0;
		this.y = y || 0;
	}

	add(x, y){
		this.x += x || 0;
		this.y += y || 0;

		return this;
	}
	substract(x, y){
		this.x -= x || 0;
		this.y -= y || 0;

		return this;
	}
	multiply(x, y){
		this.x *= x || 1;
		this.y *= y || 1;

		return this;
	}
	divide(x, y){
		this.x /= x || 1;
		this.y /= y || 1;

		return this;
	}

	distance(x, y){
		return Math.sqrt(
			Math.pow(this.x - (x||0), 2) +
			Math.pow(this.y - (y||0), 2)
		);
	}
	displacement(x, y){
		return new Vector2(this.x - (x||0), this.y-(y||0));
	}

	get rotation(){
		var r = Math.atan2(this.x, this.y);
		return r;
	}
	set rotation(radians){
		if (this.magnitude === 0){
			return this;
		}

		var x = Math.sin(radians || 0);
		var y = Math.cos(radians || 0);

		this.normal = new Vector2(x, y);

		return this;
	}

	get magnitude(){
		return Math.sqrt( Math.pow(this.x, 2) + Math.pow(this.y, 2) );
	}
	set magnitude(scalar){
		var n = this.normal;
		this.x = n.x * scalar || 1;
		this.y = n.y * scalar || 1;

		return this;
	}

	get normal(){
		return new Vector2(this.x/this.magnitude, this.y/this.magnitude);
	}
	set normal(vector2){
		var x = vector2.x || 0;
		var y = vector2.y || 0;

		var m = this.magnitude;
		this.x = (x || 0) * m;
		this.y = (y || 0) * m;

		return this;
	}
}

var deg2rad = Math.PI/180;
var rad2deg = 180/Math.PI;
