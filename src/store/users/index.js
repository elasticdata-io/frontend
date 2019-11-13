import Vue from 'vue';
import * as action from './actions';
import * as mutation from './mutations';
import * as getter from './getters';
import { SET_SNACK_MESSAGE } from '../mutations';
import { FETCH_CURRENT_USER, LOGIN } from '../user/actions';
import { SET_LOGGED_IN, SET_TOKEN, SET_USER } from '../user/mutations';
import { SUBSCRIBE_PIPELINE_ALL, WEBSOCKET_CONNECT } from '../actions';

const state = {
	users: [],
	loading: false,
};

const mutations = {
	[mutation.SET_USERS](state, users) {
		Vue.set(state, 'users', users);
	},
};

const actions = {
	async [action.FETCH_USERS]({ commit }) {
		const response = await Vue.http.get(`/api/users`);
		const users = response.body;
		commit(mutation.SET_USERS, users);
	},

	async [action.LOGIN_BY_USER]({ commit, dispatch }, { userId }) {
		const response = await Vue.http.get(`/api/user/token/${userId}`);
		const token = response.bodyText;
		if (!token) {
			commit(SET_SNACK_MESSAGE, `Цей користувач не має токенів`, { root: true });
			return;
		}
		commit(`user/${SET_TOKEN}`, token, { root: true });
		commit(`user/${SET_USER}`, { id: userId }, { root: true });
		commit(`user/${SET_LOGGED_IN}`, true, { root: true });
		await dispatch(`user/${FETCH_CURRENT_USER}`, null, { root: true });
		await dispatch(WEBSOCKET_CONNECT, { userId }, { root: true });
		await dispatch(SUBSCRIBE_PIPELINE_ALL, { userId }, { root: true });
	},
};

const getters = {
	[getter.USERS]: state => state.users,
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
