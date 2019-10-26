import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
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
import logs from './logs/';
import { subscribe, stompConnect } from './websocket';
import {
	SUBSCRIBE_PIPELINE_ALL,
	SUBSCRIBE_PIPELINE_CHANGED,
	SUBSCRIBE_PIPELINE_EXECUTE_COMMAND,
	SUBSCRIBE_PIPELINE_PARSED_LINES,
	WEBSOCKET_CONNECT,
} from './actions';
import {
	UPDATE_NEW_PARSED_ROWS_COUNT as PIPELINES_UPDATE_NEW_PARSED_ROWS_COUNT,
	UPDATE_CURRENT_EXECUTE_COMMAND as PIPELINES_UPDATE_CURRENT_EXECUTE_COMMAND,
} from './tasks/actions';

import { TASK_CHANGED } from './tasks/actions';

Vue.use(Vuex);

export default new Vuex.Store({
	plugins: [
		createPersistedState({
			paths: ['user', 'showVerticalMenu'],
		}),
	],
	modules: {
		pipeline,
		pipelines,
		tasks,
		user,
		logs,
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
		[WEBSOCKET_CONNECT]() {
			stompConnect();
		},
		[SUBSCRIBE_PIPELINE_ALL]({ dispatch }, { userId }) {
			dispatch(SUBSCRIBE_PIPELINE_CHANGED, { userId });
			dispatch(SUBSCRIBE_PIPELINE_PARSED_LINES, { userId });
			dispatch(SUBSCRIBE_PIPELINE_EXECUTE_COMMAND, { userId });
		},
		[SUBSCRIBE_PIPELINE_CHANGED]({ dispatch }, { userId }) {
			subscribe(`/task/change/${userId}`, res => {
				const task = JSON.parse(res.body);
				dispatch(`tasks/${TASK_CHANGED}`, { task });
			});
		},
		[SUBSCRIBE_PIPELINE_PARSED_LINES]({ dispatch }, { userId }) {
			subscribe(`/task/parsed-lines/${userId}`, res => {
				const data = JSON.parse(res.body);
				let taskId = data.pipelineTaskId;
				let newParseRowsCount = data.newParseRowsCount;
				dispatch(`tasks/${PIPELINES_UPDATE_NEW_PARSED_ROWS_COUNT}`, {
					taskId,
					newParseRowsCount,
				});
			});
		},
		[SUBSCRIBE_PIPELINE_EXECUTE_COMMAND]({ dispatch }, { userId }) {
			subscribe(`/task/command/execute/${userId}`, res => {
				const data = JSON.parse(res.body);
				let taskId = data.pipelineTaskId;
				let commandName = data.commandExecutingName;
				let commandProperties = data.commandExecutingProperties;
				dispatch(`tasks/${PIPELINES_UPDATE_CURRENT_EXECUTE_COMMAND}`, {
					taskId,
					commandName,
					commandProperties,
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
