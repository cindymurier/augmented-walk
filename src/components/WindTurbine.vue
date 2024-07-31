<template>
	<div id="wind-turbine-ar">
		<a-scene embedded arjs>
			<a-marker preset="hiro" @click="placeModel">
				<a-entity
					v-if="modelPlaced"
					:gltf-model="modelUrl"
					:position="modelPosition"
					scale="0.5 0.5 0.5"
					:rotation="rotation"></a-entity>
			</a-marker>
			<a-entity camera></a-entity>
		</a-scene>
		<button @click="$router.push('/')">Return to Home</button>
	</div>
</template>

<script>
export default {
	data() {
		return {
			modelUrl: "/windTurbine.gltf", // URL relative du modèle dans le dossier public
			windSpeed: 0,
			rotation: "0 0 0",
			modelPlaced: false,
			modelPosition: "0 0 0",
		};
	},
	mounted() {
		this.getLocationAndWindData();
	},
	methods: {
		async getLocationAndWindData() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition((position) => {
					const lat = position.coords.latitude;
					const lon = position.coords.longitude;
					this.fetchWindData(lat, lon);
				});
			}
		},
		async fetchWindData(lat, lon) {
			const apiKey = "YOUR_API_KEY"; // Remplacez par votre clé API
			const response = await fetch(
				`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
			);
			const data = await response.json();
			console.log("Wind data:", data);
			if (data.wind) {
				this.windSpeed = data.wind.speed;
				this.animateTurbine();
			} else {
				console.error("Wind data is undefined:", data);
			}
		},
		animateTurbine() {
			const rotationSpeed = this.windSpeed * 10; // Ajustez le multiplicateur selon vos besoins
			this.rotation = `0 ${rotationSpeed} 0`;
			setInterval(() => {
				const currentRotation = parseFloat(this.rotation.split(" ")[1]);
				this.rotation = `0 ${currentRotation + rotationSpeed} 0`;
			}, 1000);
		},
		placeModel() {
			this.modelPlaced = true;
		},
	},
};
</script>

<style>
#wind-turbine-ar {
	text-align: center;
}
button {
	padding: 10px 20px;
	font-size: 16px;
	cursor: pointer;
	margin-top: 20px;
}
</style>
