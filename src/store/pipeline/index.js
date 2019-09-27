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

	[mutation.SET_PIPELINE_LOADING](state, loading) {
		this.loading = loading;
	},

	[mutation.PIPELINE_CHANGE_ATTRIBUTE](state, { attr, value }) {
		Vue.set(state.pipeline, attr, value);
	},
};

const actions = {
	[action.RUN_PIPELINE]({ commit }, { pipeline }) {
		commit(mutation.SET_PIPELINE_LOADING, true);
		Vue.http.get(`/api/pipeline/run/${pipeline.id}`).then(res => {
			commit(mutation.SET_PIPELINE, res.body);
			commit(mutation.SET_PIPELINE_LOADING, false);
		});
	},

	[action.STOP_PIPELINE]({ commit }, { pipeline }) {
		commit(mutation.SET_PIPELINE_LOADING, true);
		Vue.http.get(`/api/pipeline/stop/${pipeline.id}`).then(res => {
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
		commit(mutation.SET_PIPELINE_LOADING, true);
		const res = await Vue.http.post(`/api/pipeline/save`, state.pipeline);
		commit(mutation.SET_PIPELINE, res.body);
		commit(mutation.SET_PIPELINE_LOADING, false);
	},

	[action.CLEAR_PIPELINE]({ commit }) {
		commit(mutation.SET_PIPELINE, {});
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
