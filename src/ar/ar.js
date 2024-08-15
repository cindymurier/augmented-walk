"use strict";

// getCoordinates()
// Demande au navigateur de détecter la position actuelle de l'utilisateur et retourne une Promise
const getCoordinates = () => {
	return new Promise((res, rej) =>
		navigator.geolocation.getCurrentPosition(res, rej)
	);
};

// getPosition()
// Résout la promesse de getCoordinates et retourne un objet {lat: x, long: y}
const getPosition = async () => {
	const position = await getCoordinates();
	return {
		lat: position.coords.latitude,
		long: position.coords.longitude,
	};
};

getPosition().then((coords) => console.log(coords.lat, coords.long));
