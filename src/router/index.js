import Vue from 'vue';
import Router from 'vue-router';
import Login from '../views/Login.vue';
import Pipelines from '../views/Pipelines.vue';
import Pipeline from '../views/Pipeline.vue';
import PipelineAddRedirect from '../views/PipelineAddRedirect.vue';
import Exit from '../views/Exit';
import Enter from '../views/Enter';
import PipelineTaskLogs from '../components/PipelineTaskLogs';

Vue.use(Router);

const router = new Router({
	//mode: 'history',
	//base: process.env.BASE_URL,
	routes: [
		{
			name: 'login',
			path: '/login',
			component: Login,
		},
		{
			name: 'logout',
			path: '/logout',
			component: Exit,
		},
		{
			name: 'enter',
			path: '/enter/:userId',
			props: true,
			component: Enter,
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
		{
			name: 'pipeline.add',
			path: '/pipeline/add',
			component: PipelineAddRedirect,
		},
		{
			name: 'pipeline.edit',
			path: '/pipeline/:state/:id',
			component: Pipeline,
			props: route => {
				const state = route.params.state || 'edit';
				return {
					state: state,
					id: route.params.id,
				};
			},
		},
		{
			name: 'help',
			path: '/help',
		},
		{
			name: 'payment',
			path: '/payment',
		},
		{
			name: 'account',
			path: '/account',
		},
		{
			name: 'analytics',
			path: '/analytics',
		},
		{
			name: 'default',
			path: '*',
			redirect: '/',
		},
	],
});

router.beforeEach((to, from, next) => {
	if (to.name === 'login' || to.name === 'logout') {
		next();
	}
	next();
});

export default router;
