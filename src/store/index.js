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
import Push from 'push.js';
import { subscribe } from './websocket';
import { SUBSCRIBE_PIPELINE } from './actions';

Vue.use(Vuex);

export default new Vuex.Store({
	plugins: [],
	modules: {
		pipeline,
		pipelines,
		tasks,
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
		[SUBSCRIBE_PIPELINE]({ commit }) {
			const userId = Vue.localStorage.get('userId');
			debugger;
			subscribe(`/pipeline/change/${userId}`, function(res) {
				debugger;
				const pipeline = JSON.parse(res.body);
				commit('PIPELINE_CHANGE', pipeline);
				const status = pipeline.status.title;
				const icon = `/img/status/${status}.png`;
				Push.create('Info', {
					body: `pipeline has been ${status}`,
					icon: icon,
					timeout: 3500,
				});
			});
			subscribe(`/pipeline/parsed-lines/${userId}`, function(res) {
				debugger;
				const data = JSON.parse(res.body);
				let pipelineId = data.pipelineId;
				let newParseRowsCount = data.newParseRowsCount;
				commit('PIPELINE_CHANGE_ATTRIBUTE', {
					pipelineId,
					attr: 'newParseRowsCount',
					value: newParseRowsCount,
				});
			});
			subscribe(`/pipeline/command/execute/${userId}`, function(res) {
				debugger;
				const data = JSON.parse(res.body);
				let pipelineId = data.pipelineId;
				let commandExecutingName = data.commandExecutingName;
				commit('PIPELINE_CHANGE_ATTRIBUTE', {
					pipelineId,
					attr: 'commandExecutingName',
					value: commandExecutingName,
				});
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
