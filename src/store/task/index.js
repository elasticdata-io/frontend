import Vue from 'vue';
import * as action from './actions';
import * as mutation from './mutations';
import { TASK, TASK_COMMANDS_INFORMATION } from './getters';

const state = {
	task: {},
	taskCommandsInformation: {},
	loading: false,
};

const mutations = {
	[mutation.SET_TASK_LOADING](state, loading) {
		Vue.set(state, 'loading', loading);
	},

	[mutation.SET_TASK](state, task) {
		Vue.set(state, 'task', task);
	},

	[mutation.SET_TASK_COMMANDS_INFORMATION](state, commandsInformation) {
		Vue.set(state, 'commandsInformation', commandsInformation);
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
		const task = state.task || {};
		const link = task.commandsInformationLink;
		if (!link) {
			return;
		}
		return Vue.http.get(link).then(res => {
			const commandsInformation = res.body || {};
			commit(mutation.SET_TASK_COMMANDS_INFORMATION, commandsInformation);
		});
	},
};

const getters = {
	[TASK]: state => state.task,
	[TASK_COMMANDS_INFORMATION]: state => state.commandsInformation,
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
