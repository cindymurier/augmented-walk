<template>
	<h1>Home</h1>
	<div>
		<button @click="$router.push('/compass')">Show Compass</button>
		<button @click="$router.push('/wind-turbine')">Show Wind Turbine AR</button>
	</div>
</template>

<script>
export default {
	name: "Home",
};
</script>

<style>
button {
	padding: 10px 20px;
	font-size: 16px;
	cursor: pointer;
	margin: 10px;
}
</style>
