import Vue from 'vue';
import Router from 'vue-router';
import Login from '../views/Login.vue';
import Pipelines from '../views/Pipelines.vue';
import Pipeline from '../views/Pipeline.vue';
import PipelineAddRedirect from '../views/PipelineAddRedirect.vue';
import Exit from '../views/Exit';
import Enter from '../views/Enter';
import Admin from '../views/Admin';
import PipelineDataView from '../views/PipelineDataView';
import Task from '../views/Task';
import DocsView from '../views/DocsView';
import CommandsDocs from '../components/docs/CommandsDocs';
import DataRulesDocs from '../components/docs/DataRulesDocs';
import SettingsDocs from '../components/docs/SettingsDocs';
import OnlyNumber from '../components/docs/data-rule/OnlyNumber';
import Trim from '../components/docs/data-rule/Trim';
import Split from '../components/docs/data-rule/Split';
import Replace from '../components/docs/data-rule/Replace';
import ReplaceRegex from '../components/docs/data-rule/ReplaceRegex';

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
			name: 'pipeline.data-view',
			path: '/data/view/:id',
			component: PipelineDataView,
			props: route => {
				return {
					id: route.params.id,
				};
			},
		},
		{
			name: 'task',
			path: '/task/:taskId',
			component: Task,
			props: true,
		},
		{
			name: 'docs',
			path: '/docs',
			component: DocsView,
		},
		{
			name: 'docs.commands',
			path: '/docs/commands',
			component: CommandsDocs,
		},
		{
			name: 'docs.data-rules',
			path: '/docs/data-rules',
			component: DataRulesDocs,
		},
		{
			name: 'docs.data-rules.only_number',
			path: '/docs/data-rules/only_number',
			component: OnlyNumber,
		},
		{
			name: 'docs.data-rules.trim',
			path: '/docs/data-rules/trim',
			component: Trim,
		},
		{
			name: 'docs.data-rules.split',
			path: '/docs/data-rules/split',
			component: Split,
		},
		{
			name: 'docs.data-rules.replace',
			path: '/docs/data-rules/replace',
			component: Replace,
		},
		{
			name: 'docs.data-rules.replace_regex',
			path: '/docs/data-rules/replace_regex',
			component: ReplaceRegex,
		},
		{
			name: 'docs.settings',
			path: '/docs/settings',
			component: SettingsDocs,
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
			name: 'admin',
			path: '/admin',
			component: Admin,
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
