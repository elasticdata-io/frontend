import Vue from 'vue';
import * as action from './actions';
import * as mutation from './mutations';
import { TASK, TASK_COMMANDS_INFORMATION, TASK_DATA } from './getters';

const state = {
	task: {},
	taskData: [],
	taskCommandsInformation: {},
	loading: false,
};

const mutations = {
	[mutation.SET_TASK_LOADING](state, loading) {
		Vue.set(state, 'loading', loading);
	},

	[mutation.SET_TASK_DATA](state, taskData) {
		Vue.set(state, 'taskData', taskData);
	},

	[mutation.SET_TASK](state, task) {
		Vue.set(state, 'task', task);
	},

	[mutation.SET_TASK_COMMANDS_INFORMATION](state, commandsInformation) {
		Vue.set(state, 'commandsInformation', commandsInformation);
	},

	[mutation.CLEAR_TASK_DATA](state) {
		Vue.set(state, 'taskData', []);
	},

	[mutation.CLEAR_TASK](state) {
		Vue.set(state, 'task', {});
	},

	[mutation.CLEAR_TASK_COMMANDS_INFORMATION](state) {
		Vue.set(state, 'commandsInformation', {});
	},
};

const actions = {
	async [action.FETCH_TASK]({ commit }, taskId) {
		commit(mutation.SET_TASK_LOADING, true);
		if (this.fetch) {
			this.fetch.abort();
		}
		const before = request => (this.fetch = request);
		return Vue.http.get(`/api/task/${taskId}`, { before }).then(res => {
			const task = res.body || [];
			commit(mutation.SET_TASK, task);
			commit(mutation.SET_TASK_LOADING, false);
		});
	},

	async [action.FETCH_TASK_COMMANDS_INFORMATION]({ commit, state }) {
		commit(mutation.CLEAR_TASK_COMMANDS_INFORMATION);
		const task = state.task || {};
		const link =
			'https://storage.elasticdata.io/591b716f6e87cc0789badadb/40d1a0ff-ecb3-48ab-9e6e-9515aa58ad8b..json?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=elasticdataio%2F20200803%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20200803T091739Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=ed9e60a923e6db2c5836e477955cc9408bc45e0ac760c31723bef7959fa21bbd' ||
			task.commandsInformationLink;
		if (!link) {
			return;
		}
		return Vue.http.get(link).then(res => {
			const commandsInformation = res.body || {};
			commit(mutation.SET_TASK_COMMANDS_INFORMATION, commandsInformation);
		});
	},

	async [action.FETCH_TASK_DATA]({ commit, state }) {
		commit(mutation.CLEAR_TASK_DATA);
		const task = state.task || {};
		const docsUrl = task.docsUrl;
		if (!docsUrl) {
			return;
		}
		return Vue.http.get(docsUrl).then(res => {
			const docs = res.body || {};
			commit(mutation.SET_TASK_DATA, docs);
		});
	},
};

const getters = {
	[TASK]: state => state.task,
	[TASK_COMMANDS_INFORMATION]: state => state.commandsInformation,
	[TASK_DATA]: state => state.taskData,
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
