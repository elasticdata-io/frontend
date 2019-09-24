import Vue from 'vue';
import Vuex from 'vuex';
import { SET_SNACK_MESSAGE } from './mutations';
import { IS_MOBILE_VIEW, IS_SM_ONLY, IS_XS_ONLY } from './getters';

Vue.use(Vuex);

export default new Vuex.Store({
	plugins: [],
	modules: {},
	state: {
		snackMessage: '',
	},
	mutations: {
		[SET_SNACK_MESSAGE](state, message) {
			state.snackMessage = message;
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
	},
});
