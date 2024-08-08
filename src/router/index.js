import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
import Compass from "../components/Compass.vue";
import WindTurbine from "../components/WindTurbine.vue";

const routes = [
	{ path: "/", name: "Home", component: Home },
	{ path: "/compass", name: "Compass", component: Compass },
	{ path: "/wind-turbine", name: "WindTurbine", component: WindTurbine },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
