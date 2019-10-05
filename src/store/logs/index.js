import Vue from 'vue';
import * as action from './actions';
import * as mutation from './mutations';
import { TASK_LOGS, TASK_LOGS_LOADING } from './getters';

const state = {
	logs: '',
	loading: false,
};

const mutations = {
	[mutation.SET_TASK_LOGS_LOADING](state, loading) {
		Vue.set(state, 'loading', loading);
	},

	[mutation.SET_TASK_LOGS](state, logs) {
		Vue.set(state, 'logs', logs);
	},

	[mutation.CLEAR_TASK_LOGS](state) {
		Vue.set(state, 'logs', '');
	},
};

const actions = {
	[action.FETCH_TASK_LOGS]({ commit }, { taskId }) {
		commit(mutation.CLEAR_TASK_LOGS);
		commit(mutation.SET_TASK_LOGS_LOADING, true);
		return Vue.http.get(`/api/pipeline/log/${taskId}`).then(res => {
			const logs = res.bodyText || '';
			let logsFormatted = logs.replace(/([^\n]+)\n/g, '<span>$1</span>');
			logsFormatted = logsFormatted.replace(
				/#screenshot-([^#]+)#/g,
				`<a target="_blank" href="http://applogs.elasticdata.io/${taskId}/screenshots/$1" class="screenshot">img</a>`
			);
			commit(mutation.SET_TASK_LOGS, logsFormatted);
			commit(mutation.SET_TASK_LOGS_LOADING, false);
		});
	},
};

const getters = {
	[TASK_LOGS]: state => state.logs,
	[TASK_LOGS_LOADING]: state => state.loading,
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
