import Vue from 'vue';
import Router from 'vue-router';
import Login from '../views/Login.vue';
import Pipelines from '../views/Pipelines.vue';

Vue.use(Router);

const router = new Router({
	routes: [
		{
			name: 'login',
			path: '/login',
			component: Login,
		},
		{
			path: '/',
			redirect: '/pipelines',
		},
		{
			name: 'pipelines',
			path: '/pipelines',
			component: Pipelines,
		},
	],
});

router.beforeEach((to, from, next) => {
	let token = Vue.localStorage.get('token');
	if (to.name === 'login' || to.name === 'exit') {
		next();
	}
	if (!token) {
		router.replace('/login');
		return;
	}
	next();
});

export default router;
