<template>
	<div>
		<h1>AR Experience</h1>
		<canvas id="ar-canvas" />
	</div>
</template>

<script>
export default {
	mounted() {
		// Initialize the AR scene
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		const renderer = new THREE.WebGLRenderer({
			canvas: document.getElementById("ar-canvas"),
			antialias: true,
		});

		// Add a simple cube to the scene
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube);

		// Render the scene
		function animate() {
			requestAnimationFrame(animate);
			renderer.render(scene, camera);
		}
		animate();
	},
};
</script>
