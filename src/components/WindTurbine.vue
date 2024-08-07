<template>
	<div id="ar-container">
		<template v-if="initialized">
			<a-scene
				vr-mode-ui="enabled: false"
				arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false;">
				<a-entity
					gps-new-entity-place="latitude: 46.7875967; longitude: 6.636881"
					scale="0.5 0.5 0.5"
					rotation="0 0 0"
					look-at="[gps-new-camera]"
					gltf-model="./public/windTurbine.glb"
					rotate-this-with-the-compass-readings></a-entity>
				<a-camera
					gps-new-camera="gpsMinDistance: 5"
					rotation-reader
					rotation
					scale
					visible
					look-control
					wasd-control></a-camera>
			</a-scene>
		</template>
		<!-- Button to return to the home page -->
		<button @click="$router.push('/')">Return to Home</button>
	</div>
</template>

<script>
export default {
	data() {
		return {
			initialized: false,
		};
	},
	mounted() {
		// Simulating initialization process
		this.initialized = true;
		console.log("AR scene initialized");
	},
};
</script>

<style>
#ar-container {
	width: 100%;
	height: 100vh;
	overflow: hidden;
}
button {
	padding: 10px 20px;
	font-size: 16px;
	cursor: pointer;
}
</style>
