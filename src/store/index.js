import Vue from 'vue';
import Vuex from 'vuex';
import { SET_SNACK_MESSAGE, TOGGLE_SHOW_VERTICAL_MENU, SET_SHOW_VERTICAL_MENU } from './mutations';
import {
	IS_MOBILE_VIEW,
	IS_SM_ONLY,
	IS_XS_ONLY,
	SHOW_VERTICAL_MENU,
	SNACK_MESSAGE,
} from './getters';

import pipeline from './pipeline/';
import pipelines from './pipelines/';

Vue.use(Vuex);

export default new Vuex.Store({
	plugins: [],
	modules: {
		pipeline,
		pipelines,
	},
	state: {
		snackMessage: '',
		showVerticalMenu: false,
	},
	mutations: {
		[SET_SNACK_MESSAGE](state, message) {
			state.snackMessage = message;
		},

		[SET_SHOW_VERTICAL_MENU](state, show) {
			state.showVerticalMenu = show;
		},

		[TOGGLE_SHOW_VERTICAL_MENU](state) {
			state.showVerticalMenu = !state.showVerticalMenu;
		},
	},
	actions: {},
	getters: {
		[IS_XS_ONLY]: () => {
			return Vue.prototype.$vuetify.breakpoint.xsOnly;
		},
		[IS_SM_ONLY]: () => {
			return Vue.prototype.$vuetify.breakpoint.smOnly;
		},
		[IS_MOBILE_VIEW]: () => {
			return (
				Vue.prototype.$vuetify.breakpoint.xsOnly || Vue.prototype.$vuetify.breakpoint.smOnly
			);
		},
		[SHOW_VERTICAL_MENU]: state => state.showVerticalMenu,
		[SNACK_MESSAGE]: state => state.snackMessage,
	},
});
