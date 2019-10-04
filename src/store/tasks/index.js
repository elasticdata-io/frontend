import Vue from 'vue';
import * as action from './actions';
import * as mutation from './mutations';
import { TASKS } from './getters';

const state = {
	tasks: [],
	loading: false,
};

const mutations = {
	[mutation.SET_TASKS_LOADING](state, loading) {
		Vue.set(state, 'loading', loading);
	},

	[mutation.SET_TASKS](state, tasks) {
		Vue.set(state, 'tasks', tasks);
	},

	[mutation.CLEAR_TASKS](state) {
		Vue.set(state, 'tasks', []);
	},
};

const actions = {
	[action.FETCH_TASKS]({ commit }, { pipelineId }) {
		commit(mutation.SET_TASKS_LOADING, true);
		return Vue.http.get(`/api/pipeline-task/list/${pipelineId}`).then(res => {
			commit(mutation.SET_TASKS, res.body || []);
			commit(mutation.SET_TASKS_LOADING, false);
		});
	},
};

const getters = {
	[TASKS]: state => state.tasks,
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
