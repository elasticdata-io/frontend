import Vue from 'vue';
import Router from 'vue-router';
import Login from '../views/Login.vue';

Vue.use(Router);

const router = new Router({
	routes: [
		{
			name: 'login',
			path: '/login',
			component: Login,
			meta: {
				breadcrumb: 'Login',
			},
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
