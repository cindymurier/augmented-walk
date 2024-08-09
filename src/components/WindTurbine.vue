<template>
	<div id="ar-container">
		<a-scene
			vr-mode-ui="enabled: false"
			arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false"
			renderer="antialias: true; alpha: true">
			<a-camera
				gps-new-camera="gpsMinDistance: 5"
				rotation-reader
				rotation
				scale
				visible
				look-control
				wasd-control>
			</a-camera>
			<a-entity
				gps-new-entity-place="latitude: 46.992783; longitude: 6.929453"
				scale="1 1 1"
				rotation="0 0 0"
				look-at="[gps-new-camera]"
				gltf-model="/windTurbine.glb"
				rotate-this-with-the-compass-readings></a-entity>
		</a-scene>
	</div>
</template>

<script>
export default {
	name: "WindTurbine",
};
</script>

<style>
button {
	padding: 10px 20px;
	font-size: 16px;
	cursor: pointer;
}
</style>
