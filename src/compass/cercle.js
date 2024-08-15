let allCircles = [];

function displayCircles() {
	allCircles.forEach((circle) => {
		circle.display();
		circle.move();
	});
}

function createCircle(x, y, size) {
	const circle = new Circle(x, y, size);
	allCircles.push(circle);
	return circle;
}

class Circle {
	constructor(x, y, size) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.movement = { dx: 0, dy: 0 }; // Initialisation du mouvement
	}

	display() {
		fill(0, 255, 0, 127); // Vert avec 50% d'opacité
		stroke(0, 255, 0, 127); // Contour vert avec 50% d'opacité
		strokeWeight(2); // Largeur du contour
		ellipse(this.x, this.y, this.size * 2); // Dessine le cercle
	}

	move() {
		this.x += this.movement.dx;
		this.y += this.movement.dy;
	}

	setMovement(dx, dy) {
		this.movement.dx = dx;
		this.movement.dy = dy;
	}

	setPosition(x, y) {
		this.x = x;
		this.y = y;
	}

	setSize(size) {
		this.size = size;
	}

	getSize() {
		return this.size;
	}
}
