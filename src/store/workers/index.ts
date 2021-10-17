import Vue from 'vue';
import { WORKERS_BY_USER } from './getters';
import { FETCH_USER_WORKERS } from './actions';
import { SET_USER_WORKERS } from './mutations';

export interface Worker {
    podKey: string;
    status: 'pending' | 'running' | 'waiting';
    cloudProvider: 'digitalocean';
    createdOn: Date;
    ip: string;
    cpu: string;
    memory: string;
}

const state: {workersByUser: Worker[]} = {
	workersByUser: [],
};

const mutations = {
	[SET_USER_WORKERS](state, workers) {
		Vue.set(state, 'workersByUser', workers);
	},
};

const actions = {
	[FETCH_USER_WORKERS]({ commit }) {
		Vue.http.get(`/cloud-manager/workers/591b716f6e87cc0789badadb`).then(res => {
			commit(SET_USER_WORKERS, res.body);
		});
	},
};

const getters = {
	[WORKERS_BY_USER]: state => {
		return state.workersByUser;
	},
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
