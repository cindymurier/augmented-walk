class goute {
	constructor(x, y, size) {
		this.center = { x: x, y: y };
		this.size = size;
		this.color = "#FF0000";
		//shrink
		this.shrink = false;
		this.shrinkBy = 1;
		//movement
		this.dx = 0;
		this.dy = 0;
	}

	display(ctx) {
		if (this.center.x + this.size < 0) {
			// no need to display
			return;
		}
		this.center.x += this.dx;
		this.center.y += this.dy;
		if (this.shrinking) {
			this.shrinkBy -= 0.1;
			this.size *= this.shrinkBy;
		}
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.center.x, this.center.y, this.size, 0, 2 * Math.PI);
		ctx.fill();
	}

	setPosition(x, y) {
		this.center.x = x;
		this.center.y = y;
	}

	setMovement(dx, dy) {
		this.dx = dx;
		this.dy = dy;
	}

	getSize() {
		return this.size;
	}

	setSize(size) {
		this.size = size;
	}

	disapear() {
		if (!this.shrinking) {
			this.shrinking = true;
			this.shrinkBy = 1;
		}
	}
}
