"use strict";

let whatchId = null;
let arCreated = false;

const currentLocation = {
	longitude: 0,
	latitude: 0,
};

function startWatchLocation() {
	if (whatchId != null) {
		// already watching ...
		return;
	}

	const options = {
		enableHighAccuracy: true,
		maximumAge: 30000,
		timeout: 27000,
	};

	whatchId = navigator.geolocation.watchPosition(
		(position) => {
			console.log("Updating position");
			currentLocation.latitude = position.coords.latitude;
			currentLocation.longitude = position.coords.longitude;

			createAR(); // once for all !

			console.log(`Latitude: ${currentLocation.latitude}`);
			console.log(`Longitude: ${currentLocation.longitude}`);
		},
		null,
		options
	);
}

function stopWatchLocation() {
	if (whatchId == null) {
		return;
	}
	navigator.geolocation.clearWatch(whatchId);
	whatchId = null;
}

function createAR() {
	if (arCreated) {
		stopWatchLocation();
		return;
	}
	arCreated = true;

	const entity = document.createElement("a-entity");

	entity.setAttribute("gps-new-entity-place", {
		latitude: currentLocation.latitude,
		longitude: currentLocation.longitude,
	});

	entity.setAttribute("scale", {
		x: 0.5,
		y: 0.5,
		z: 0.5,
	});

	entity.setAttribute("rotation", {
		x: 0,
		y: 0,
		z: 0,
	});

	entity.setAttribute("look-at", "[gps-new-camera]");
	entity.setAttribute("gltf-model", "/public/windTurbine1.glb");

	document.querySelector("a-scene").appendChild(entity);
}
