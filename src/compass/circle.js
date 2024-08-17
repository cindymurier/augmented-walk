class Circle {
	constructor(x, y, size) {
		this.center = { x: x, y: y }; // Centre du cercle avec ses coordonnées x et y
		this.size = size; // Taille (rayon) du cercle
		this.color = "#FF0000";
		//Facteur de rétrécissement (shrink)
		this.shrink = false;
		this.shrinkBy = 1;
		//Mouvement
		this.dx = 0;
		this.dy = 0;
	}

	// Affiche le cercle sur le canevas
	display(ctx) {
		// Si le cercle est complètement hors du canevas, ne pas l'afficher
		if (this.center.x + this.size < 0) {
			return;
		}
		// Mise à jour de la position du cercle en fonction de son mouvement
		this.center.x += this.dx;
		this.center.y += this.dy;
		// Si le cercle doit rétrécir, on réduit sa taille progressivement
		if (this.shrinking) {
			this.shrinkBy -= 0.1;
			this.size *= this.shrinkBy;
		}
		// Dessine le cercle sur le canevas
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.center.x, this.center.y, this.size, 0, 2 * Math.PI);
		ctx.fill();
	}

	// Définit la position du cercle
	setPosition(x, y) {
		this.center.x = x;
		this.center.y = y;
	}

	// Définit le mouvement du cercle (déplacement en x et y)
	setMovement(dx, dy) {
		this.dx = dx;
		this.dy = dy;
	}

	// Retourne la taille actuelle du cercle
	getSize() {
		return this.size;
	}

	// Modifie la taille du cercle
	setSize(size) {
		this.size = size;
	}

	// Active le rétrécissement du cercle
	disapear() {
		if (!this.shrinking) {
			this.shrinking = true;
			this.shrinkBy = 1;
		}
	}
}
