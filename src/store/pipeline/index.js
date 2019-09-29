import Vue from 'vue';
import * as action from './actions';
import * as mutation from './mutations';
import { CURRENT_PIPELINE, CURRENT_PIPELINE_LOADING } from './getters';

const state = {
	pipeline: {},
	loading: false,
};

const mutations = {
	[mutation.SET_PIPELINE](state, pipeline) {
		Vue.set(state, 'pipeline', pipeline);
	},

	[mutation.SET_PIPELINE_ID](state, pipelineId) {
		Vue.set(state.pipeline, 'id', pipelineId);
	},

	[mutation.SET_PIPELINE_LOADING](state, loading) {
		Vue.set(state, 'loading', loading);
	},

	[mutation.PIPELINE_CHANGE_ATTRIBUTE](state, { attr, value }) {
		Vue.set(state.pipeline, attr, value);
	},
};

const actions = {
	[action.RUN_PIPELINE]({ commit }, { pipelineId }) {
		commit(mutation.SET_PIPELINE_LOADING, true);
		Vue.http.get(`/api/pipeline/run/${pipelineId}`).then(res => {
			commit(mutation.SET_PIPELINE, res.body);
			commit(mutation.SET_PIPELINE_LOADING, false);
		});
	},

	[action.STOP_PIPELINE]({ commit }, { pipelineId }) {
		commit(mutation.SET_PIPELINE_LOADING, true);
		Vue.http.get(`/api/pipeline/stop/${pipelineId}`).then(res => {
			commit(mutation.SET_PIPELINE, res.body);
			commit(mutation.SET_PIPELINE_LOADING, false);
		});
	},

	[action.FETCH_PIPELINE]({ commit }, { id }) {
		commit(mutation.SET_PIPELINE_LOADING, true);
		Vue.http.get(`/api/pipeline/${id}`).then(res => {
			commit(mutation.SET_PIPELINE, res.body);
			commit(mutation.SET_PIPELINE_LOADING, false);
		});
	},

	async [action.SAVE_PIPELINE]({ commit, state }) {
		return new Promise((resolve, reject) => {
			commit(mutation.SET_PIPELINE_LOADING, true);
			Vue.http
				.post(`/api/pipeline/save`, state.pipeline)
				.then(res => {
					setTimeout(() => {
						commit(mutation.SET_PIPELINE, res.body);
						commit(mutation.SET_PIPELINE_LOADING, false);
						resolve('Данні успішно збережено!');
					}, 500);
				})
				.catch(e => reject(e.bodyText || e.statusText));
		});
	},

	[action.CLEAR_PIPELINE]({ commit }) {
		commit(mutation.SET_PIPELINE, {});
		commit(mutation.SET_PIPELINE_LOADING, false);
	},
};

const getters = {
	[CURRENT_PIPELINE_LOADING]: state => state.loading,
	[CURRENT_PIPELINE]: state => state.pipeline,
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
