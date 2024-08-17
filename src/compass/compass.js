let canvas;
let ctx;
// Pour avoir un événement toutes les secondes
let tickTime = 0;
let fakeNorth = 0;
let canvasRotation = 0;
let deviceOrientation = 0;
const goalCircle = new Circle(0, 0, 250); // Le cercle "but"
const circles = []; // Les cercles (4) qui bougent

const currentLocation = {
	longitude: 0,
	latitude: 0,
};

const destinations = [
	{
		name: "Eole",
		latitude: 46.506291,
		longitude: 6.625896,
		description:
			"<h1>Congratulations! </h1><br>You have found Eole, the first point of interest! ",
		discovered: false,
	},
	{
		name: "Gravière de l'Isle",
		latitude: 46.508367,
		longitude: 6.620456,
		description:
			"<h1>Congratulations! </h1><br>You have found the Gravière de l'Isle, the second point of interest! ",
		discovered: false,
	},
	{
		name: "Petit Train de Vidy",
		latitude: 46.513632,
		longitude: 6.607949,
		description:
			"<h1>Congratulations! </h1><br>You have found the Petit Train de Vidy, the third point of interest! ",
		discovered: false,
	},
	{
		name: "Pyramides de Vidy",
		latitude: 46.511662,
		longitude: 6.603314,
		description:
			"<h1>Congratulations! </h1><br>You have found the Pyramides de Vidy, the fourth point of interest! ",
		discovered: false,
	},
	{
		name: "International Olympic Committee",
		latitude: 46.5179,
		longitude: 6.59702,
		description:
			"<h1>Congratulations! </h1><br>You have found the International Olympic Committee, the fifth point of interest! ",
		discovered: false,
	},
	{
		name: "EPFL Pavilions",
		latitude: 46.518265,
		longitude: 6.565823,
		description:
			"<h1>Congratulations! </h1><br>You have found EPFL Pavilions, the last point of interest! ",
		discovered: false,
	},
];

// Fonction pour faire tourner le canevas
function rotateCanvas(angleDeg) {
	canvasRotation = angleDeg; // juste pour info
	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.rotate((angleDeg * Math.PI) / 180);
	ctx.translate(-canvas.width / 2, -canvas.height / 2);
}

// Fonction pour effacer le canevas
function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Réinitialise la destination à la première
function reset() {
	setDestination(destinations[0].name, false);
}

// Passe à la destination suivante
function next() {
	setDestination(currentDestination.name, true);
}

// Définit la destination actuelle
function setDestination(name, next = false) {
	let takeNext = false;
	for (let oneDest of destinations) {
		if (takeNext || oneDest.name == name) {
			if (next) {
				next = false;
				takeNext = true;
			} else {
				currentDestination = oneDest;
				window.localStorage.setItem(
					"currentDestination",
					JSON.stringify({ name: oneDest.name, discovered: false })
				);
				break;
			}
		}
	}

	// Pour y arriver en 60 secondes en cas de simulation
	this.stepToDestX =
		(currentDestination.longitude - currentLocation.longitude) / 60;
	this.stepToDestY =
		(currentDestination.latitude - currentLocation.latitude) / 60;

	goalCircle.setPosition(canvas.width / 2, -1000);
	positionCircles();
	destinationReached = false;
	document.getElementById("finished").classList.add("hidden");
}

// Commence à surveiller la position de l'utilisateur
function startWatchLocation() {
	if (this.watchId != null) {
		// Déjà en train de surveiller...
		return;
	}

	const options = {
		enableHighAccuracy: true,
		maximumAge: 30000,
		timeout: 27000,
	};

	this.watchId = navigator.geolocation.watchPosition(
		(position) => {
			console.log("Updating position");
			setCurrentLocation(position.coords);
		},
		null,
		options
	);
}

// Arrête la surveillance de la position de l'utilisateur
function stopWatchLocation() {
	if (this.watchId == null) {
		return;
	}
	navigator.geolocation.clearWatch(this.watchId);
	this.watchId = null;
}

// Gestion de l'arrivée à la destination
function arrive() {
	destinationReached = true;
	goalCircle.setPosition(canvas.width / 2, canvas.height / 2);

	circles.length = 0; // On vide le tableau des cercles
	window.localStorage.setItem(
		"currentDestination",
		JSON.stringify({ name: currentDestination.name, discovered: true })
	);
	document.getElementById("message").innerHTML = currentDestination.description;
	document.getElementById("finished").classList.remove("hidden");
}

// Met à jour la position actuelle
function setCurrentLocation(location) {
	currentLocation.latitude = location.latitude;
	currentLocation.longitude = location.longitude;

	let distance = Math.round(distanceToDestination(currentDestination));
	if (distance < 5) {
		// à 5 mètres du but, on est au but !
		currentLocation.latitude = currentDestination.latitude;
		currentLocation.longitude = currentDestination.longitude;
		arrive();
	} else if (distance < 40) {
		goalCircle.setPosition(
			ctx.canvas.width / 2,
			canvas.height / 2 - (distance * canvas.height) / 20
		);
	} else {
		goalCircle.setPosition(ctx.canvas.width / 2, -1000);
	}
}

// Écoute les changements d'orientation de l'appareil
function startDeviceOrientationListener() {
	window.addEventListener("deviceorientationabsolute", manageCompass, true); // Non précis
	//window.addEventListener("deviceorientation", manageCompass, true);

	function manageCompass(event) {
		if (event.webkitCompassHeading) {
			deviceOrientation = event.webkitCompassHeading + 180;
		} else {
			deviceOrientation = -(event.alpha + (event.beta * event.gamma) / 90);
			deviceOrientation -= Math.floor(deviceOrientation / 360) * 360; // Réduction à la plage [0,360]
		}
	}
}

// Définit le nord simulé
function setNorth() {
	fakeNorth = deviceOrientation;
}

/*
 * https://www.movable-type.co.uk/scripts/latlong.html
 * Calcul de la distance à la destination
 */
function distanceToDestination(dest) {
	const R = 6371e3; // mètres
	const lat1 = currentLocation.latitude;
	const lon1 = currentLocation.longitude;
	const lat2 = dest.latitude;
	const lon2 = dest.longitude;

	const φ1 = (lat1 * Math.PI) / 180; // φ, λ en radians
	const φ2 = (lat2 * Math.PI) / 180;
	const Δφ = ((lat2 - lat1) * Math.PI) / 180;
	const Δλ = ((lon2 - lon1) * Math.PI) / 180;

	const a =
		Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
		Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	const d = R * c; // en mètres
	return d;
}

/*
 *  https://www.movable-type.co.uk/scripts/latlong.html
 *  Calcul de l'angle à la destination
 */
function angleToDestination(dest) {
	let dL = dest.longitude - currentLocation.longitude;
	dL = (dL * Math.PI) / 180;

	let clat = currentLocation.latitude;
	let clon = currentLocation.longitude;
	let dlat = dest.latitude;
	let dlon = dest.longitude;

	clat = (clat * Math.PI) / 180;
	clon = (clon * Math.PI) / 180;
	dlat = (dlat * Math.PI) / 180;
	dlon = (dlon * Math.PI) / 180;

	var X = Math.cos(dlat) * Math.sin(dL);
	var Y =
		Math.cos(clat) * Math.sin(dlat) -
		Math.sin(clat) * Math.cos(dlat) * Math.cos(dL);
	var angle = (Math.atan2(X, Y) * 180) / Math.PI;
	return angle;
}

// Affiche des informations sur l'écran
function showInfos() {
	var html =
		"<span>Device orientation : " +
		Math.round(deviceOrientation - fakeNorth) +
		"° (corr : " +
		Math.round(fakeNorth) +
		"°) <br>";
	html +=
		"Current location : " +
		currentLocation.latitude +
		" " +
		currentLocation.longitude +
		"<br>";
	html += "Current destination : " + currentDestination.name + "<br>";
	html +=
		"Absolute angle to destination : " +
		Math.round(angleToDestination(currentDestination)) +
		"°<br>";
	html += "Canvas rotation : " + Math.round(canvasRotation) + "°<br>";
	html +=
		"Distance to destination : " +
		Math.round(distanceToDestination(currentDestination)) +
		"m<br> ";
	html += "<span>";

	document.getElementById("info").innerHTML = html;
}

// Initialisation du canevas
function initialize(canvasId) {
	inSimulation = false;
	destinationReached = false;
	tickTime = Date.now();
	canvas = document.getElementById(canvasId);
	ctx = canvas.getContext("2d");

	startWatchLocation();

	startDeviceOrientationListener();

	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;

	window.onresize = function () {
		ctx.canvas.width = window.innerWidth;
		ctx.canvas.height = window.innerHeight;
		for (var aCircle of circles) {
			aCircle.center.x = canvas.width / 2;
		}
	};

	let html = '<button onclick="setNorth();">Set North</button><br></br></br>';
	html +=
		'<button id="toggleSimulation"  onclick="toggleSimulation();">Start simulation</button><br><br>';
	html += '<button onclick="reset();">Reset</button><br></br></br></br>';
	html += "<h3><u>Destinations</u></h3>";
	destinations.forEach((oneDest) => {
		html +=
			"<button onclick=\"setDestination('" +
			oneDest.name +
			"');\">" +
			oneDest.name +
			"</button><br></br>";
	});
	document.getElementById("destinations").innerHTML = html;
	let lastDestination = null;
	try {
		lastDestination = JSON.parse(
			window.localStorage.getItem("currentDestination")
		);
	} catch (error) {}
	if (lastDestination != null && lastDestination.name != null) {
		setDestination(lastDestination.name, lastDestination.discovered);
	} else {
		setDestination(setDestination[0].name);
	}
}

// Active ou désactive la simulation
function toggleSimulation() {
	inSimulation = !inSimulation;
	let button = document.getElementById("toggleSimulation");
	if (inSimulation) {
		stopWatchLocation();

		this.stepToDestX =
			(currentDestination.longitude - currentLocation.longitude) / 60;
		this.stepToDestY =
			(currentDestination.latitude - currentLocation.latitude) / 60;

		button.innerHTML = "Stop simulation";
		button.classList.add("flashit");
	} else {
		startWatchLocation();
		button.innerHTML = "Start simulation";
		button.classList.remove("flashit");
	}
}

// Une horloge qui s'exécute toutes les secondes
function tick() {
	if (inSimulation && !destinationReached) {
		move();
	}
}

// Déplace la position actuelle vers la destination
function move() {
	let location = Object.assign({}, currentLocation); // clone
	location.longitude += this.stepToDestX;
	location.latitude += this.stepToDestY;
	setCurrentLocation(location);
}

// Positionne les cercles sur le canevas
function positionCircles() {
	// Supposons que 1/2 de la taille de l'appareil (tablette) équivaut à 20 mètres.
	let distanceForSize = Math.round(distanceToDestination(currentDestination));

	const nbVisibleCircles = 2;
	this.deviceDistanceCircle = canvas.height / 2 / nbVisibleCircles;
	/*
	 * Création des cercles qui bougent :
	 */
	circles.length = 0;
	for (let i = 1; i <= 4; i++) {
		let aCircle = new Circle(
			canvas.width / 2,
			canvas.height / 2 - i * this.deviceDistanceCircle,
			getCircleSize(distanceForSize)
		);
		aCircle.setMovement(0, 2);
		circles.push(aCircle);
	}
}

// Rafraîchit le canevas à chaque frame
function refresh() {
	if (Date.now() - tickTime > 1000) {
		// toutes les 1 secondes
		tickTime = Date.now();
		tick();
	}

	clearCanvas();

	showInfos();

	rotateCanvas(
		angleToDestination(currentDestination) - (deviceOrientation - fakeNorth)
	);

	ctx.beginPath();
	ctx.fillStyle = "rgba(255, 0, 0, 0.5)"; // Rouge avec 50% de transparence
	ctx.arc(canvas.width / 2, canvas.height / 2, 80, 0, 2 * Math.PI);
	ctx.fill();
	ctx.closePath();

	for (let aCircle of circles) {
		let distanceForSize = Math.round(distanceToDestination(currentDestination));
		if (aCircle.center.y > canvas.height / 2) {
			aCircle.setMovement(0, 0);
			aCircle.disapear();
		}

		if (aCircle.getSize() <= 1) {
			circles.shift();
			let aCircle = new Circle(
				canvas.width / 2,
				canvas.height / 2 - 4 * this.deviceDistanceCircle,
				getCircleSize(distanceForSize)
			);
			aCircle.setMovement(0, 2);
			circles.push(aCircle);
			continue;
		}
		// Ne pas afficher les cercles "sous" le cercle but
		if (aCircle.center.y > goalCircle.center.y + goalCircle.size) {
			aCircle.setSize(getCircleSize(distanceForSize));
			aCircle.display(ctx);
		}
	}

	goalCircle.display(ctx);

	// Réinitialise la matrice de transformation
	ctx.setTransform(1, 0, 0, 1, 0, 0);

	// Rond blanc au centre
	ctx.beginPath();
	ctx.fillStyle = "#FFFFFF";
	ctx.arc(canvas.width / 2, canvas.height / 2, 60, 0, 2 * Math.PI);
	ctx.fill();
	ctx.closePath();

	// Rond rouge au centre
	ctx.beginPath();
	ctx.fillStyle = "#FF0000";
	ctx.arc(canvas.width / 2, canvas.height / 2, 40, 0, 2 * Math.PI);
	ctx.fill();
	ctx.closePath();
}

// Calcule la taille du cercle en fonction de la distance à la destination
function getCircleSize(distanceToDest) {
	let size = 10;
	if (distanceToDest < 100) {
		size = 50;
	} else if (distanceToDest < 200) {
		size = 40;
	} else if (distanceToDest < 400) {
		size = 30;
	} else {
		size = 20;
	}
	return size;
}
