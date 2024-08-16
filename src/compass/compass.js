let canvas;
let ctx;
//pour avoir un événement toute les secondes
let tickTime = 0;
let fake_north = 0;
let canvas_rotation = 0;
let deviceOrientation = 0;
const goalGoute = new goute(0, 0, 250); // La goute "but"
const goutes = []; // Les quesques goutes (4) qui bougent

const currentLocation = {
	longitude: 0,
	latitude: 0,
};

const destinations = [
	{
		name: "Test",
		latitude: 46.992877,
		longitude: 6.929195,
		description:
			"<h1>Congratulations! </h1><br>You have found Eole, the first point of interest! ",
		decouvert: false,
	},
	{
		name: "Eole",
		latitude: 46.506291,
		longitude: 6.625896,
		description:
			"<h1>Congratulations! </h1><br>You have found Eole, the first point of interest! ",
		decouvert: false,
	},
	{
		name: "Gravière de l'Isle",
		latitude: 46.508367,
		longitude: 6.620456,
		description:
			"<h1>Congratulations! </h1><br>You have found the Gravière de l'Isle, the second point of interest! ",
		decouvert: false,
	},
	{
		name: "Petit Train de Vidy",
		latitude: 46.513632,
		longitude: 6.607949,
		description:
			"<h1>Congratulations! </h1><br>You have found the Petit Train de Vidy, the third point of interest! ",
		decouvert: false,
	},
	{
		name: "Pyramides de Vidy",
		latitude: 46.511662,
		longitude: 6.603314,
		description:
			"<h1>Congratulations! </h1><br>You have found the Pyramides de Vidy, the fourth point of interest! ",
		decouvert: false,
	},
	{
		name: "International Olympic Committee",
		latitude: 46.5179,
		longitude: 6.59702,
		description:
			"<h1>Congratulations! </h1><br>You have found the International Olympic Committee, the fifth point of interest! ",
		decouvert: false,
	},
	{
		name: "EPFL Pavilions>",
		latitude: 46.518265,
		longitude: 6.565823,
		description:
			"<h1>Congratulations! </h1><br>You have found EPFL Pavilions, the last point of interest! ",
		decouvert: false,
	},
];

//avoir uniquement l'écran qui bouge
function rotateCanvas(angleDeg) {
	canvas_rotation = angleDeg; // juste pour info
	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.rotate((angleDeg * Math.PI) / 180);
	ctx.translate(-canvas.width / 2, -canvas.height / 2);
}

function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function reset() {
	setDestination(destinations[0].name, false);
}

function next() {
	setDestination(currentDestination.name, true);
}

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
					JSON.stringify({ name: oneDest.name, decouvert: false })
				);
				break;
			}
		}
	}

	// To get there in 60 seconds in case of simulation
	this.stepToDestX =
		(currentDestination.longitude - currentLocation.longitude) / 60;
	this.stepToDestY =
		(currentDestination.latitude - currentLocation.latitude) / 60;

	goalGoute.setPosition(canvas.width / 2, -1000);
	positionGoutes();
	butAtteint = false;
	document.getElementById("finished").classList.add("hidden");
}

function startWatchLocation() {
	if (this.whatchId != null) {
		// already watching ...
		return;
	}

	const options = {
		enableHighAccuracy: true,
		maximumAge: 30000,
		timeout: 27000,
	};

	this.whatchId = navigator.geolocation.watchPosition(
		(position) => {
			console.log("Updating position");
			setCurrentLocation(position.coords);
		},
		null,
		options
	);
}

function stopWatchLocation() {
	if (this.whatchId == null) {
		return;
	}
	navigator.geolocation.clearWatch(this.whatchId);
	this.whatchId = null;
}

function arrivee() {
	butAtteint = true;
	goalGoute.setPosition(canvas.width / 2, canvas.height / 2);

	goutes.length = 0; // On vide le tableau des goutes
	window.localStorage.setItem(
		"currentDestination",
		JSON.stringify({ name: currentDestination.name, decouvert: true })
	);
	document.getElementById("message").innerHTML = currentDestination.description;
	document.getElementById("finished").classList.remove("hidden");
}

function setCurrentLocation(location) {
	currentLocation.latitude = location.latitude;
	currentLocation.longitude = location.longitude;

	let distance = Math.round(distanceToDest(currentDestination));
	if (distance < 5) {
		// a 5 metres du but, on est au but !
		currentLocation.latitude = currentDestination.latitude;
		currentLocation.longitude = currentDestination.longitude;
		arrivee();
	} else if (distance < 40) {
		goalGoute.setPosition(
			ctx.canvas.width / 2,
			canvas.height / 2 - (distance * canvas.height) / 20
		);
	} else {
		goalGoute.setPosition(ctx.canvas.width / 2, -1000);
	}
}

function startDeviceOrientationListener() {
	window.addEventListener("deviceorientationabsolute", manageCompass, true); // Not accurate
	//window.addEventListener("deviceorientation", manageCompass, true);

	function manageCompass(event) {
		if (event.webkitCompassHeading) {
			deviceOrientation = event.webkitCompassHeading + 180;
		} else {
			deviceOrientation = -(event.alpha + (event.beta * event.gamma) / 90);
			deviceOrientation -= Math.floor(deviceOrientation / 360) * 360; // Wrap to range [0,360]
		}
	}
}

function setNorth() {
	fake_north = deviceOrientation;
}

/*
 * https://www.movable-type.co.uk/scripts/latlong.html
 */
function distanceToDest(dest) {
	const R = 6371e3; // metres
	const lat1 = currentLocation.latitude;
	const lon1 = currentLocation.longitude;
	const lat2 = dest.latitude;
	const lon2 = dest.longitude;

	const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
	const φ2 = (lat2 * Math.PI) / 180;
	const Δφ = ((lat2 - lat1) * Math.PI) / 180;
	const Δλ = ((lon2 - lon1) * Math.PI) / 180;

	const a =
		Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
		Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	const d = R * c; // in metres
	return d;
}

/*
 *  https://www.movable-type.co.uk/scripts/latlong.html
 *  see also : https://www.igismap.com/formula-to-find-bearing-or-heading-angle-between-two-points-latitude-longitude/
 */
function angleToDest(dest) {
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

function showInfos() {
	var html =
		"<span>Device orientation : " +
		Math.round(deviceOrientation - fake_north) +
		"° (corr : " +
		Math.round(fake_north) +
		"°) <br>";
	html +=
		"Current location : " +
		currentLocation.latitude +
		" " +
		currentLocation.longitude +
		"<br>";
	html += "Current destination : " + currentDestination.name + "<br>";
	html +=
		"Absolute angle to dest : " +
		Math.round(angleToDest(currentDestination)) +
		"°<br>";
	html += "Canvas rotation : " + Math.round(canvas_rotation) + "°<br>";
	html +=
		"Distance to destination : " +
		Math.round(distanceToDest(currentDestination)) +
		"m<br> ";
	html += "<span>";

	document.getElementById("info").innerHTML = html;
}

function initialize(canvasId) {
	inSimulation = false;
	butAtteint = false;
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
		for (var uneGoute of goutes) {
			uneGoute.center.x = canvas.width / 2;
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
	let lastDestionation = null;
	try {
		lastDestionation = JSON.parse(
			window.localStorage.getItem("currentDestination")
		);
	} catch (error) {}
	if (lastDestionation != null && lastDestionation.name != null) {
		setDestination(lastDestionation.name, lastDestionation.decouvert);
	} else {
		setDestination("Police du Lac");
	}
}

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

// A clock for every seconds
function tick() {
	if (inSimulation && !butAtteint) {
		move();
	}
}

function move() {
	let location = Object.assign({}, currentLocation); // clone
	location.longitude += this.stepToDestX;
	location.latitude += this.stepToDestY;
	setCurrentLocation(location);
}

function positionGoutes() {
	// Let's assume 1/2 the size of the device (tablet) is 20 meters.
	let distancePourTaille = Math.round(distanceToDest(currentDestination));

	const nbGouteVisible = 2;
	this.deviceDistanceGoute = canvas.height / 2 / nbGouteVisible;
	/*
	 * Créations des goutes qui bougent :
	 */
	goutes.length = 0;
	for (let i = 1; i <= 4; i++) {
		let uneGoute = new goute(
			canvas.width / 2,
			canvas.height / 2 - i * this.deviceDistanceGoute,
			getGouteSize(distancePourTaille)
		);
		uneGoute.setMovement(0, 2);
		goutes.push(uneGoute);
	}
}

function refresh() {
	if (Date.now() - tickTime > 1000) {
		// every 1 seconds
		tickTime = Date.now();
		tick();
	}

	clearCanvas();

	showInfos();

	rotateCanvas(
		angleToDest(currentDestination) - (deviceOrientation - fake_north)
	);

	ctx.beginPath();
	ctx.fillStyle = "rgba(255, 0, 0, 0.5)"; // Rouge avec 50% de transparence
	ctx.arc(canvas.width / 2, canvas.height / 2, 80, 0, 2 * Math.PI);
	ctx.fill();
	ctx.closePath();

	for (let uneGoute of goutes) {
		let distancePourTaille = Math.round(distanceToDest(currentDestination));
		if (uneGoute.center.y > canvas.height / 2) {
			uneGoute.setMovement(0, 0);
			uneGoute.disapear();
		}

		if (uneGoute.getSize() <= 1) {
			goutes.shift();
			let uneGoute = new goute(
				canvas.width / 2,
				canvas.height / 2 - 4 * this.deviceDistanceGoute,
				getGouteSize(distancePourTaille)
			);
			uneGoute.setMovement(0, 2);
			goutes.push(uneGoute);
			continue;
		}
		// Ne pas afficher les goutes "sous" la goal goute
		if (uneGoute.center.y > goalGoute.center.y + goalGoute.size) {
			uneGoute.setSize(getGouteSize(distancePourTaille));
			uneGoute.display(ctx);
		}
	}

	goalGoute.display(ctx);

	// Reset transformation matrix to the identity matrix
	ctx.setTransform(1, 0, 0, 1, 0, 0);

	//rond blanc au centre
	ctx.beginPath();
	ctx.fillStyle = "#FFFFFF";
	ctx.arc(canvas.width / 2, canvas.height / 2, 60, 0, 2 * Math.PI);
	ctx.fill();
	ctx.closePath();

	//rond rouge au centre
	ctx.beginPath();
	ctx.fillStyle = "#FF0000";
	ctx.arc(canvas.width / 2, canvas.height / 2, 40, 0, 2 * Math.PI);
	ctx.fill();
	ctx.closePath();
}

function getGouteSize(distanceToDest) {
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
