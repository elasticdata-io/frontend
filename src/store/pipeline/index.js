import Vue from 'vue';
import * as action from './actions';
import * as mutation from './mutations';
import { CURRENT_PIPELINE, CURRENT_PIPELINE_LOADING } from './getters';
import defaultPipelineCommands from '../defaultPipelineCommands';
import { PIPELINE_CHANGED } from '../pipelines/actions';

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
};

const actions = {
	async [action.RUN_PIPELINE]({ commit, dispatch }, { pipelineId }) {
		commit(mutation.SET_PIPELINE_LOADING, true);
		const res = await Vue.http.get(`/api/pipeline/run/${pipelineId}`);
		commit(mutation.SET_PIPELINE, res.body);
		commit(mutation.SET_PIPELINE_LOADING, false);
		dispatch(`pipelines/${PIPELINE_CHANGED}`, { pipeline: res.body }, { root: true });
	},

	async [action.STOP_PIPELINE]({ commit, dispatch }, { pipelineId }) {
		commit(mutation.SET_PIPELINE_LOADING, true);
		const res = await Vue.http.get(`/api/pipeline/stop/${pipelineId}`);
		commit(mutation.SET_PIPELINE, res.body);
		commit(mutation.SET_PIPELINE_LOADING, false);
		dispatch(`pipelines/${PIPELINE_CHANGED}`, { pipeline: res.body }, { root: true });
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

	[action.CURRENT_PIPELINE_CHANGED]({ commit, state }, { pipeline }) {
		if (state.pipeline.id === pipeline.id) {
			commit(mutation.SET_PIPELINE, pipeline);
		}
	},

	[action.INIT_DEFAULT_PIPELINE_PROPERTIES]({ commit, state }, { id }) {
		const currentPipeline = state.pipeline;
		commit(mutation.SET_PIPELINE, {
			id,
			jsonCommands: JSON.stringify(defaultPipelineCommands, null, 4),
			...currentPipeline,
		});
	},

	[action.UPDATE_NEW_PARSED_ROWS_COUNT]({ commit, state }, { newParseRowsCount }) {
		commit(mutation.SET_PIPELINE, {
			...state.pipeline,
			newParseRowsCount: newParseRowsCount,
		});
	},

	[action.UPDATE_CURRENT_EXECUTE_COMMAND](
		{ commit, state },
		{ commandName, commandProperties, pipelineId }
	) {
		if (pipelineId !== state.pipeline.id) {
			return;
		}
		commit(mutation.SET_PIPELINE, {
			...state.pipeline,
			currentExecuteCommand: commandName,
			currentExecuteCommandProperties: commandProperties,
		});
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
