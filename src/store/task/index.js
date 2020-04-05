import Vue from 'vue';
import * as action from './actions';
import * as mutation from './mutations';
import { TASK } from './getters';

const state = {
	task: {},
	loading: false,
};

const mutations = {
	[mutation.SET_TASK_LOADING](state, loading) {
		Vue.set(state, 'loading', loading);
	},

	[mutation.SET_TASK](state, task) {
		Vue.set(state, 'task', task);
	},

	[mutation.CLEAR_TASK](state) {
		Vue.set(state, 'task', {});
	},
};

const actions = {
	[action.FETCH_TASK]({ commit }, taskId) {
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
};

const getters = {
	[TASK]: state => state.task,
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
