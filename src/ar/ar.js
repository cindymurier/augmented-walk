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
		return;
	}
	arCreated = true;
	let html = "<a-scene embedded vr-mode-ui='enabled: false'";
	html += "arjs='sourceType: webcam; videoTexture: true; debugUIEnabled: false'";
	html += "renderer='antialias: true; alpha: true'>";

	html +=
		"<a-camera gps-new-camera='gpsMinDistance: 5' rotation-reader rotation scale visible look-control";
	html += "wasd-control> </a-camera>";

	html +=
		'<a-entity gps-new-entity-place="latitude: ' +
		currentLocation.latitude +
		"; longitude: " +
		currentLocation.longitude +
		'" scale="0.5 0.5 0.5" rotation="0 0 0"';
	html +=
		'look-at="[gps-new-camera]" gltf-model="./public/windTurbine.glb" rotate-this-with-the-compass-readings></a-entity>';

	html += "</a-scene> */";

	document.getElementById("ar").innerHTML = html;
}
