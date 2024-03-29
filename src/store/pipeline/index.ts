import Vue from 'vue';
import * as action from './actions';
import * as mutation from './mutations';
import { CURRENT_PIPELINE, CURRENT_PIPELINE_LOADING, CURRENT_PIPELINE_LAST_DATA } from './getters';
import defaultPipelineCommands from '../defaultPipelineCommands';
import { FETCH_TASKS } from '../tasks/actions';
import { PipelineDsl } from '@/store/model/pipeline-dsl.model';
import { PipelineSettings } from '@/store/model/pipeline-settings-dsl.model';

type PipelineState = {
    pipeline: PipelineDsl,
    lastData: any[],
    loading: boolean,
};

const pipelineDefault = {
    settings: {} as PipelineSettings,
    commands: [],
    dataRules: [],
    version: '',
};

const state: PipelineState = {
	pipeline: pipelineDefault,
	lastData: [],
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

	[mutation.SET_PIPELINE_LAST_DATA](state, lastData) {
		Vue.set(state, 'lastData', lastData);
	},
};

const actions = {
	async [action.RUN_PIPELINE]({ commit, dispatch }, { pipelineId }) {
		commit(mutation.SET_PIPELINE_LOADING, true);
		const res = await Vue.http.post(`/api/pipeline/run-from-client/${pipelineId}`);
		commit(mutation.SET_PIPELINE_LOADING, false);
		dispatch(`tasks/${FETCH_TASKS}`, { pipelineId: pipelineId }, { root: true });
		return res.data;
	},

	[action.FETCH_PIPELINE]({ commit }, { id }) {
		commit(mutation.SET_PIPELINE_LOADING, true);
		Vue.http.get(`/api/pipeline/${id}`).then(res => {
			commit(mutation.SET_PIPELINE, res.body);
			commit(mutation.SET_PIPELINE_LOADING, false);
		});
	},

	[action.FETCH_PIPELINE_LAST_DATA]({ commit }, { id }) {
		Vue.http.get(`/api/pipeline/data/${id}`).then(res => {
			commit(mutation.SET_PIPELINE_LAST_DATA, res.body);
		});
	},

	async [action.SAVE_PIPELINE]({ commit, state }) {
		return new Promise((resolve, reject) => {
			commit(mutation.SET_PIPELINE_LOADING, true);
			const jsonCommands = JSON.parse(state.pipeline.jsonCommands || {});
			Vue.http
				.post(
					`/api/pipeline/save`,
					JSON.stringify({
						...state.pipeline,
						pipelineVersion: jsonCommands.version || '',
					})
				)
				.then(res => {
					setTimeout(() => {
						commit(mutation.SET_PIPELINE, res.body);
						commit(mutation.SET_PIPELINE_LOADING, false);
						resolve('Данні успішно збережено!');
					}, 500);
				})
				.catch(e => {
					commit(mutation.SET_PIPELINE_LOADING, false);
					const body = e.body || {};
					reject(body.message || e.bodyText || e.statusText);
				});
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

	[action.INIT_DEFAULT_PIPELINE_PROPERTIES]({ commit, state }, props) {
		const currentPipeline = state.pipeline;
		commit(mutation.SET_PIPELINE, {
			...props,
			jsonCommands: JSON.stringify(defaultPipelineCommands, null, 4),
			...currentPipeline,
		});
	},
};

const getters = {
	[CURRENT_PIPELINE_LOADING]: state => state.loading,
	[CURRENT_PIPELINE]: state => state.pipeline || pipelineDefault,
	[CURRENT_PIPELINE_LAST_DATA]: state => state.lastData,
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
