import Vue from 'vue';
import * as action from './actions';
import * as mutation from './mutations';
import { PIPELINES, PIPELINES_LOADING } from './getters';

const state = {
	pipelines: [],
	loading: false,
};

const mutations = {
	[mutation.SET_LOADING](state, loading) {
		Vue.set(state, 'loading', loading);
	},

	[mutation.SET_PIPELINE_LOADING](state, { loading, pipeline }) {
		mutations[mutation.PIPELINE_CHANGE_ATTRIBUTE].call(null, state, {
			pipelineId: pipeline.id,
			attr: 'loading',
			value: loading,
		});
	},

	[mutation.PIPELINE_CHANGE](state, pipeline) {
		const p = state.pipelines.find(pt => pt.id === pipeline.id);
		const index = state.pipelines.indexOf(p);
		Vue.set(state.pipelines, index, pipeline);
	},

	[mutation.PIPELINE_CHANGE_ATTRIBUTE](state, { pipelineId, attr, value }) {
		const pipeline = state.pipelines.find(p => p.id === pipelineId);
		if (!pipeline) {
			return;
		}
		pipeline[attr] = value;
		const index = state.pipelines.indexOf(pipeline);
		Vue.set(state.pipelines, index, pipeline);
	},

	[mutation.PIPELINES_SET_FROM_ARRAY](state, pipelines) {
		Vue.set(state, 'pipelines', pipelines);
	},

	[mutation.REMOVE](state, id) {
		const pipeline = state.pipelines.find(pt => pt.id === id);
		const index = state.pipelines.indexOf(pipeline);
		state.pipelines.splice(index, 1);
	},

	[mutation.SET_NEW_PARSE_ROWS_COUNT](state, { pipelineId, newParseRowsCount }) {
		const pipeline = state.pipelines.find(p => p.id === pipelineId);
		if (!pipeline) {
			return;
		}
		pipeline.newParseRowsCount = newParseRowsCount;
		const index = state.pipelines.indexOf(pipeline);
		Vue.set(state.pipelines, index, pipeline);
	},
};

const actions = {
	// todo : change pipeline to pipelineId
	[action.RUN_PIPELINE]({ commit }, { pipeline }) {
		commit(mutation.SET_PIPELINE_LOADING, { loading: true, pipeline });
		Vue.http.get(`/api/pipeline/run/${pipeline.id}`).then(res => {
			commit(mutation.PIPELINE_CHANGE, res.body);
		});
	},

	[action.STOP_PIPELINE]({ commit }, { pipeline }) {
		commit(mutation.SET_PIPELINE_LOADING, { loading: true, pipeline });
		Vue.http.get(`/api/pipeline/stop/${pipeline.id}`).then(res => {
			commit(mutation.PIPELINE_CHANGE, res.body);
		});
	},

	[action.FETCH_PIPELINES]({ commit }) {
		commit(mutation.SET_LOADING, true);
		Vue.http.get(`/api/pipeline/list`).then(res => {
			commit(mutation.PIPELINES_SET_FROM_ARRAY, res.body);
			commit(mutation.SET_LOADING, false);
		});
	},

	[action.FETCH_DEPENDS]({ commit }, { pipelineId }) {
		commit(mutation.SET_LOADING, true);
		Vue.http.get(`/api/pipeline/list-depends/${pipelineId}`).then(res => {
			commit(mutation.PIPELINES_SET_FROM_ARRAY, res.body);
			commit(mutation.SET_LOADING, false);
		});
	},

	[action.REMOVE_PIPELINE]({ commit }, { id }) {
		commit(mutation.SET_LOADING, true);
		Vue.http.delete(`/api/pipeline/delete/${id}`).then(() => {
			commit('REMOVE', id);
			commit(mutation.SET_LOADING, false);
		});
	},

	[action.PIPELINE_CHANGED]({ commit, state }, { pipeline }) {
		const id = pipeline.id;
		const findPipeline = state.pipelines.find(p => p.id === id);
		if (!findPipeline) {
			return;
		}
		commit(mutation.PIPELINE_CHANGE, pipeline);
	},

	[action.UPDATE_NEW_PARSED_ROWS_COUNT]({ commit, state }, { pipelineId, newParseRowsCount }) {
		const findPipeline = state.pipelines.find(p => p.id === pipelineId);
		if (!findPipeline) {
			return;
		}
		commit(mutation.PIPELINE_CHANGE, {
			...findPipeline,
			newParseRowsCount: newParseRowsCount,
		});
	},

	[action.UPDATE_CURRENT_EXECUTE_COMMAND]({ commit, state }, { pipelineId, commandName }) {
		const findPipeline = state.pipelines.find(p => p.id === pipelineId);
		if (!findPipeline) {
			return;
		}
		commit(mutation.PIPELINE_CHANGE, {
			...findPipeline,
			currentExecuteCommand: commandName,
		});
	},

	[action.CLONE_PIPELINE]({ dispatch }, { id }) {
		Vue.http.post(`/api/pipeline/clone/${id}`).then(res => {
			if (res.status) {
				dispatch(action.FETCH_PIPELINES);
			}
		});
	},
};

const getters = {
	[PIPELINES]: state => state.pipelines,
	[PIPELINES_LOADING]: state => state.loading,
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
