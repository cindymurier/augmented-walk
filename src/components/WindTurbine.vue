<template>
	<div id="ar-container">
		<a-scene
			vr-mode-ui="enabled: false"
			arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false"
			renderer="antialias: true; alpha: true">
			<a-entity
				v-if="userPosition"
				:gps-new-entity-place="`latitude: ${userPosition.latitude}; longitude: ${userPosition.longitude}`"
				scale="0.5 0.5 0.5"
				rotation="0 0 0"
				look-at="[gps-new-camera]"
				gltf-model="/windTurbine.glb"
				rotate-this-with-the-compass-readings></a-entity>
			<a-camera gps-new-camera="gpsMinDistance: 5" rotation-reader></a-camera>
		</a-scene>
	</div>
</template>

<script>
import { ref } from "vue";

export default {
	name: "WindTurbine",
	setup() {
		const userPosition = ref(null);

		const getUserLocation = () => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						userPosition.value = {
							latitude: position.coords.latitude,
							longitude: position.coords.longitude,
						};
					},
					(error) => {
						console.error("Error getting location: ", error);
					},
					{
						enableHighAccuracy: true,
						timeout: 5000,
						maximumAge: 0,
					}
				);
			} else {
				console.error("Geolocation is not supported by this browser.");
			}
		};

		getUserLocation();

		return { userPosition };
	},
};
</script>

<style>
#ar-container {
	position: relative;
	width: 100%;
	height: 100vh;
}
button {
	padding: 10px 20px;
	font-size: 16px;
	cursor: pointer;
}
</style>
