import Vue from 'vue';
import * as action from './actions';
import * as mutation from './mutations';
import { LOGGED_IN, LOGIN, USER } from './getters';

const state = {
	user: {},
	loading: false,
	login: null,
	loggedIn: false,
	token: null,
};

const mutations = {
	[mutation.SET_USER_LOADING](state, loading) {
		Vue.set(state, 'loading', loading);
	},

	[mutation.SET_USER](state, user) {
		Vue.set(state, 'user', user);
	},

	[mutation.CLEAR_USER](state) {
		Vue.set(state, 'user', {});
	},

	[mutation.SET_LOGGED_IN](state, loggedIn) {
		Vue.set(state, 'loggedIn', loggedIn);
	},

	[mutation.CLEAR_TOKEN](state) {
		Vue.set(state, 'token', null);
		Vue.localStorage.remove('token');
	},

	[mutation.SET_TOKEN](state, token) {
		Vue.set(state, 'token', token);
		Vue.localStorage.set('token', token);
	},

	[mutation.SET_LOGIN](state, login) {
		Vue.set(state, 'login', login);
		Vue.localStorage.set('login', login);
	},
};

const actions = {
	[action.LOGIN]({ commit }, { login, token, userId }) {
		commit(mutation.SET_USER, { userId });
		commit(mutation.SET_LOGGED_IN, true);
		commit(mutation.SET_TOKEN, token);
		commit(mutation.SET_LOGIN, login);
	},

	async [action.LOGOUT]({ commit }) {
		await Vue.http.get(`/api/login/exit`);
		commit(mutation.CLEAR_TOKEN);
		commit(mutation.CLEAR_USER);
		commit(mutation.SET_LOGGED_IN, false);
		commit(mutation.SET_LOGIN, null);
	},

	async [action.FETCH_CURRENT_USER]({ commit }) {
		const response = await Vue.http.get(`/api/user/current`);
		const body = response.body;
		commit(mutation.SET_LOGIN, body.login);
		commit(mutation.SET_USER, body);
	},
};

const getters = {
	[USER]: state => state.user,
	[LOGGED_IN]: state => state.loggedIn,
	[LOGIN]: state => state.login,
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
