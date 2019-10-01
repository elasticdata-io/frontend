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
import tasks from './tasks/';
import user from './user/';
import { subscribe } from './websocket';
import { SUBSCRIBE_PIPELINE } from './actions';
import { PIPELINE_CHANGED } from './pipelines/actions';
import { CURRENT_PIPELINE_CHANGED } from './pipeline/actions';

Vue.use(Vuex);

export default new Vuex.Store({
	plugins: [],
	modules: {
		pipeline,
		pipelines,
		tasks,
		user,
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
	actions: {
		[SUBSCRIBE_PIPELINE]({ commit, dispatch }) {
			const userId = Vue.localStorage.get('userId');
			subscribe(`/pipeline/change/${userId}`, function(res) {
				const pipeline = JSON.parse(res.body);
				dispatch(`pipelines/${PIPELINE_CHANGED}`, { pipeline });
				dispatch(`pipeline/${CURRENT_PIPELINE_CHANGED}`, { pipeline });
			});
			subscribe(`/pipeline/parsed-lines/${userId}`, function(res) {
				// const data = JSON.parse(res.body);
				// let pipelineId = data.pipelineId;
				// let newParseRowsCount = data.newParseRowsCount;
				// commit('PIPELINE_CHANGE_ATTRIBUTE', {
				// 	pipelineId,
				// 	attr: 'newParseRowsCount',
				// 	value: newParseRowsCount,
				// });
			});
			subscribe(`/pipeline/command/execute/${userId}`, function(res) {
				// const data = JSON.parse(res.body);
				// let pipelineId = data.pipelineId;
				// let commandExecutingName = data.commandExecutingName;
				// commit('PIPELINE_CHANGE_ATTRIBUTE', {
				// 	pipelineId,
				// 	attr: 'commandExecutingName',
				// 	value: commandExecutingName,
				// });
			});
		},
	},
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
