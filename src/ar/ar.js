"use strict";

let watchId = null;
let arCreated = false;

// Latitude et Longitude actuelle de l'utilisateur
const currentLocation = {
	longitude: 0,
	latitude: 0,
};

// Démarre la surveillance de la position géographique
function startWatchLocation() {
	if (watchId != null) {
		// Si la surveillance est déjà en cours, ne rien faire
		return;
	}

	const options = {
		enableHighAccuracy: true,
		maximumAge: 30000,
		timeout: 27000,
	};

	watchId = navigator.geolocation.watchPosition(
		(position) => {
			console.log("Updating position");
			currentLocation.latitude = position.coords.latitude;
			currentLocation.longitude = position.coords.longitude;

			createAR(); // Crée l'élément AR une seule fois

			console.log(`Latitude: ${currentLocation.latitude}`);
			console.log(`Longitude: ${currentLocation.longitude}`);
		},
		null, // Gestion des erreurs
		options
	);
}

// Arrête la surveillance de la position géographique
function stopWatchLocation() {
	if (watchId == null) {
		// Si la surveillance n'est pas en cours, ne rien faire
		return;
	}
	navigator.geolocation.clearWatch(watchId);
	watchId = null;
}

// Ajouter le modèle 3D
function createAR() {
	if (arCreated) {
		stopWatchLocation();
		return;
	}
	arCreated = true;

	const entity = document.createElement("a-entity");

	entity.setAttribute("gps-new-entity-place", {
		latitude: currentLocation.latitude + 0.00001,
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
	entity.setAttribute("gltf-model", "/public/windTurbine2.glb");

	// Ajoute l'entité AR à la scène
	document.querySelector("a-scene").appendChild(entity);
}
