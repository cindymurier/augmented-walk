<template>
	<div id="ar-container">
		<template v-if="initialized">
			<a-scene
				vr-mode-ui="enabled: false"
				arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false;">
				<a-text
					value="This content will always face you."
					look-at="[gps-camera]"
					scale="120 120 120"
					gps-entity-place="latitude: 46.992732; longitude: 6.9293937;"></a-text>
				<a-camera gps-camera rotation-reader> </a-camera>
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
