const DEBUG = false;
let allGoutes = [];

function displayGoutes(canvas, clearFirst) {
	var ctx = canvas.getContext("2d");

	if (clearFirst) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	allGoutes.forEach((uneGoute) => {
		uneGoute.display(ctx);
	});
}

function createGoute(x, y, size) {
	var uneGoute = new goute(x, y, size);
	allGoutes.push(uneGoute);
	return uneGoute;
}

class goute {
	constructor(x, y, size) {
		this.size = size;
		this.center = {};
		this.points = [];
		this.center.x = x;
		this.center.y = y;
		this.nodes = 7;
		this.shrinking = false;
		if (DEBUG) {
			this.nodes = 3;
		}
		this.controlDist = 20;
		this.speed = 20;
		if (DEBUG) {
			this.speed = 300;
		}

		this.movement = {
			dx: 0,
			dy: 0,
		};

		for (let i = 0; i < this.nodes; i++) {
			let rad = this.rnd(size * 0.5, size * 1.5);
			let rad2 = this.rnd(size * 0.5, size * 1.5);
			let step = (rad2 - rad) / this.rnd(this.speed / 2, this.speed);

			this.points[i] = {
				x: 0,
				y: 0,
				cx: 0,
				cy: 0,
				cx1: 0,
				cy1: 0,
				rad: rad,
				rad2: rad2,
				step: step,
			};
		}
	}

	rnd(from, to) {
		return Math.random() * (to - from) + from;
	}

	/*
	 * https://www.alloprof.qc.ca/fr/eleves/bv/mathematiques/la-distance-d-un-point-a-une-droite-dans-un-plan-m1315
	 */
	getPointsControl(C, P, di) {
		var dx = P.x - C.x;
		var dy = P.y - C.y;

		if (dy == 0) {
			// horizontale
			return {
				x1: P.x,
				y1: P.y + di * Math.sign(dx),
				x2: P.x,
				y2: P.y - di * Math.sign(dx),
			};
		} else if (dx == 0) {
			// verticale
			return {
				x1: P.x - di * Math.sign(dy),
				y1: P.y,
				x2: P.x + di * Math.sign(dy),
				y2: P.y,
			};
		}
		var m = dy / dx;
		var b = C.y - m * C.x;
		var mp = -1 / m;
		var bp = P.y - mp * P.x;

		var x1 = (di * Math.sqrt(m * m + 1) + bp - b) / (m - mp);
		var y1 = mp * x1 + bp;

		var x2 = (di * Math.sqrt(m * m + 1) - bp + b) / (mp - m);
		var y2 = mp * x2 + bp;

		if (dx < 0) {
			return {
				x1: x1,
				y1: y1,
				x2: x2,
				y2: y2,
			};
		} else {
			return {
				x1: x2,
				y1: y2,
				x2: x1,
				y2: y1,
			};
		}
	}

	display(ctx) {
		let rotAngle = 0;
		let dist = (this.size * Math.PI) / this.nodes / 2;

		if (this.shrinking) {
			this.shrinkBy -= 0.1;
			this.size *= this.shrinkBy;
			if (this.size < 1) {
				this.size = 0;
			}
		}

		for (let i = 0; i < this.nodes; i++) {
			this.points[i].rad += this.points[i].step;
			if (
				(this.points[i].step > 0 && this.points[i].rad > this.points[i].rad2) ||
				(this.points[i].step < 0 && this.points[i].rad < this.points[i].rad2)
			) {
				this.points[i].rad2 = this.rnd(this.size * 0.5, this.size * 1.5);
				this.points[i].step =
					(this.points[i].rad2 - this.points[i].rad) /
					this.rnd(this.speed / 2, this.speed);
			}
			let rad = this.points[i].rad;
			if (this.shrinking) {
				rad *= this.shrinkBy;
				if (rad < 1) {
					rad = 1;
				}
			}
			this.points[i].x = this.center.x + Math.cos(rotAngle) * rad;
			this.points[i].y = this.center.y + Math.sin(rotAngle) * rad;
			var pc = this.getPointsControl(this.center, this.points[i], dist);

			this.points[i].cx1 = pc.x1;
			this.points[i].cy1 = pc.y1;
			this.points[i].cx2 = pc.x2;
			this.points[i].cy2 = pc.y2;

			rotAngle += (2 * Math.PI) / this.nodes;
		}

		//nofill();
		if (DEBUG) {
			ctx.beginPath();
			for (let i = 0; i < this.nodes; i++) {
				let next = i + 1;
				if (next == this.nodes) {
					next = 0;
				}
				//noFill();
				//stroke(255, 255, 255);
				//strokeWeight(2);
				ctx.moveTo(this.points[i].x, this.points[i].y);
				ctx.bezierCurveTo(
					this.points[i].cx1,
					this.points[i].cy1,
					this.points[next].cx2,
					this.points[next].cy2,
					this.points[next].x,
					this.points[next].y
				);
				ctx.stroke();
				ctx.closePath();

				ctx.beginPath();
				ctx.fillStyle = "#000000";
				ctx.arc(this.points[i].x, this.points[i].y, 5, 0, 2 * Math.PI);
				ctx.fill();
				ctx.closePath();

				//noStroke();
				//    fill(color(255, 0, 0))
				ctx.beginPath();
				ctx.fillStyle = "#00FF00";
				ctx.arc(this.points[i].cx1, this.points[i].cy1, 5, 0, 2 * Math.PI);
				ctx.fill();
				ctx.closePath();

				ctx.beginPath();
				ctx.fillStyle = "#FF0000";
				ctx.arc(this.points[i].cx2, this.points[i].cy2, 5, 0, 2 * Math.PI);
				ctx.fill();

				ctx.closePath();
				ctx.beginPath();
				ctx.moveTo(this.points[i].cx1, this.points[i].cy1);
				ctx.lineTo(this.points[i].cx2, this.points[i].cy2);
				ctx.closePath();

				ctx.beginPath();
				ctx.moveTo(this.center.x, this.center.y);
				ctx.lineTo(this.points[i].x, this.points[i].y);
				ctx.closePath();
			}
			ctx.stroke();
		} else {
			ctx.fillStyle = "#00FF00";
			ctx.strokeStyle = "rgb(0 255 0 / 50%)";
			ctx.fillStyle = "rgb(0 255 0 / 50%)";
			ctx.shadowOffsetX = this.size / 30;
			ctx.shadowOffsetY = -this.size / 20;
			ctx.shadowBlur = this.size / 10;
			ctx.shadowColor = "black";

			ctx.beginPath();

			ctx.moveTo(this.points[0].x, this.points[0].y);

			for (let i = 0; i < this.nodes; i++) {
				let next = i + 1;
				if (next == this.nodes) {
					next = 0;
				}
				ctx.bezierCurveTo(
					this.points[i].cx1,
					this.points[i].cy1,
					this.points[next].cx2,
					this.points[next].cy2,
					this.points[next].x,
					this.points[next].y
				);
			}

			ctx.closePath();
			ctx.save();
			ctx.fill();

			ctx.clip();
			ctx.shadowColor = "white";
			ctx.shadowBlur = 10;
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.shadowBlur = 3;
			ctx.lineWidth = 1;
			ctx.stroke();

			ctx.restore();
		}

		if (!DEBUG) {
			this.center.x += this.movement.dx;
			this.center.y += this.movement.dy;
		}
	}

	schrink() {
		if (!this.shrinking) {
			this.shrinking = true;
			this.shrinkBy = 1; // 5 step to disappear
		}
	}

	setMovement(dx, dy) {
		this.movement.dx = dx;
		this.movement.dy = dy;
	}

	setPosition(x, y) {
		this.center.x = x;
		this.center.y = y;
	}

	setSize(size) {
		this.size = size;
	}

	getSize() {
		return this.size;
	}
}
