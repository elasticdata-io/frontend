import Vue from 'vue';
import Router from 'vue-router';
import Login from '../views/Login.vue';
import Pipelines from '../views/Pipelines.vue';
import Pipeline from '../views/Pipeline.vue';
import PipelineAddRedirect from '../views/PipelineAddRedirect.vue';
import Exit from '../views/Exit.vue';
import Enter from '../views/Enter.vue';
import Admin from '../views/Admin.vue';
import PipelineDataView from '../views/PipelineDataView.vue';
import Task from '../views/Task.vue';
import TaskInteraction from '../views/TaskInteraction.vue';
import DocsView from '../views/DocsView.vue';
import CommandsDocs from '../components/docs/CommandsDocs.vue';
import DataRulesDocs from '../components/docs/DataRulesDocs.vue';
import SettingsDocs from '../components/docs/SettingsDocs.vue';
import OnlyNumber from '../components/docs/data-rule/OnlyNumber.vue';
import Trim from '../components/docs/data-rule/Trim.vue';
import Split from '../components/docs/data-rule/Split.vue';
import Replace from '../components/docs/data-rule/Replace.vue';
import ReplaceRegex from '../components/docs/data-rule/ReplaceRegex.vue';
import Unique from '../components/docs/data-rule/Unique.vue';
import Join from '../components/docs/data-rule/Join.vue';
import ExtractRegex from '../components/docs/data-rule/ExtractRegex.vue';
import CmdDoc from '../components/docs/cmd/CmdDoc.vue';
import CmdLoader from '../components/docs/cmd/CmdLoader.vue';
import CreateTaskInteraction from "@/views/CreateTaskInteraction.vue";

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
			name: 'create-task-interaction',
			path: '/create-task-interaction/:pipelineId',
			component: CreateTaskInteraction,
			props: true,
		},
		{
			name: 'task-interaction',
			path: '/task-interaction/:taskId',
			component: TaskInteraction,
			props: true,
		},
		{
			name: 'docs',
			path: '/docs',
			component: DocsView,
		},
		{
			name: 'docs.commands',
			path: '/docs/cmd',
			component: CommandsDocs,
		},
		{
			name: 'docs.commands.view',
			path: '/docs/cmd/:cmd',
			component: CmdDoc,
			props: true,
		},
		{
			name: 'docs.commands.custom',
			path: '/docs/cmd/custom/:cmd',
			component: CmdLoader,
			props: true,
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
			name: 'docs.data-rules.unique',
			path: '/docs/data-rules/unique',
			component: Unique,
		},
		{
			name: 'docs.data-rules.join',
			path: '/docs/data-rules/join',
			component: Join,
		},
		{
			name: 'docs.data-rules.extract_regex',
			path: '/docs/data-rules/extract_regex',
			component: ExtractRegex,
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
