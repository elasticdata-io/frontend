import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import {
	SET_SNACK_MESSAGE,
	TOGGLE_SHOW_VERTICAL_MENU,
	SET_SHOW_VERTICAL_MENU,
	SET_APP_VERSION,
	SET_APP_LAST_UPDATED,
} from './mutations';
import {
	IS_MOBILE_VIEW,
	IS_SM_ONLY,
	IS_XS_ONLY,
	SHOW_VERTICAL_MENU,
	SNACK_MESSAGE,
	SNACK_MESSAGE_COLOR,
	APP_VERSION,
	APP_LAST_UPDATED,
	SNACK_TIMEOUT,
} from './getters';

import pipeline from './pipeline/';
import pipelines from './pipelines/';
import tasks from './tasks/';
import task from './task/';
import user from './user/';
import users from './users/';
import logs from './logs/';
import dataRules from './data-rules';
import commands from './commands';
import workers from './workers';
import locale from './locale';
import taskAnalyzedCommands from './task-analyzed-commands';
import userInteraction, {UserInteraction} from './user-interaction';
import { subscribe, stompConnect } from './websocket';
import {
    FETCH_APP_LAST_UPDATED,
    FETCH_APP_VERSION, SUBSCRIBE_CHANGE_USER_INTERACTION,
    SUBSCRIBE_PIPELINE_ALL,
    SUBSCRIBE_TASK_CHANGED,
    SUBSCRIBE_PIPELINE_EXECUTE_COMMAND,
    SUBSCRIBE_PIPELINE_PARSED_LINES,
    WEBSOCKET_CONNECT,
} from './actions';
import {
	UPDATE_NEW_PARSED_ROWS_COUNT as PIPELINES_UPDATE_NEW_PARSED_ROWS_COUNT,
	UPDATE_CURRENT_EXECUTE_COMMAND as PIPELINES_UPDATE_CURRENT_EXECUTE_COMMAND,
} from './tasks/actions';

import { TASK_CHANGED } from './tasks/actions';
import {TASK_CHANGED_FROM_WS, TASK_UPDATE_CURRENT_EXECUTE_COMMAND_FROM_WS} from "@/store/task/actions";
import {UPSERT_USER_INTERACTION} from "@/store/user-interaction/actions";

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
		task,
		user,
		users,
		logs,
		dataRules,
		commands,
        workers,
		locale,
		taskAnalyzedCommands,
		userInteraction,
	},
	state: {
		snackTimeout: 10000,
		snackMessage: '',
		snackMessageColor: '',
		showVerticalMenu: false,
		appVersion: '?',
		appLastUpdated: '',
	},
	mutations: {
		[SET_SNACK_MESSAGE](state, { msg, color, timeout }) {
			state.snackMessage = msg;
			state.snackMessageColor = color;
			state.snackTimeout = timeout;
		},

		[SET_SHOW_VERTICAL_MENU](state, show) {
			state.showVerticalMenu = show;
		},

		[TOGGLE_SHOW_VERTICAL_MENU](state) {
			state.showVerticalMenu = !state.showVerticalMenu;
		},

		[SET_APP_VERSION](state, appVersion) {
			state.appVersion = appVersion;
		},

		[SET_APP_LAST_UPDATED](state, appLastUpdated) {
			state.appLastUpdated = appLastUpdated;
		},
	},
	actions: {
		[WEBSOCKET_CONNECT]() {
			stompConnect();
		},
		[SUBSCRIBE_PIPELINE_ALL]({ dispatch }, { userId }) {
			dispatch(SUBSCRIBE_TASK_CHANGED, { userId });
			dispatch(SUBSCRIBE_PIPELINE_PARSED_LINES, { userId });
			dispatch(SUBSCRIBE_PIPELINE_EXECUTE_COMMAND, { userId });
			dispatch(SUBSCRIBE_CHANGE_USER_INTERACTION, { userId });
		},
		[SUBSCRIBE_TASK_CHANGED]({ dispatch }, { userId }) {
			subscribe(`/task/change/${userId}`, res => {
				const task = JSON.parse(res.body);
				dispatch(`tasks/${TASK_CHANGED}`, { task });
				dispatch(`task/${TASK_CHANGED_FROM_WS}`, { task });
			}, null);
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
			}, null);
		},
		[SUBSCRIBE_PIPELINE_EXECUTE_COMMAND]({ dispatch }, { userId }) {
			subscribe(`/task/command/execute/${userId}`, res => {
				const data = JSON.parse(res.body);
				let taskId = data.taskId;
				let pipelineId = data.pipelineId;
				let commandName = data.cmd;
				let userId = data.userId;
				let designTimeConfig = data.designTimeConfig;
				let uuid = data.uuid;
				dispatch(`tasks/${PIPELINES_UPDATE_CURRENT_EXECUTE_COMMAND}`, {
					userId,
					pipelineId,
					taskId,
					commandName,
                    designTimeConfig,
					uuid,
				});
                dispatch(`task/${TASK_UPDATE_CURRENT_EXECUTE_COMMAND_FROM_WS}`, {
                    userId,
                    pipelineId,
                    taskId,
                    commandName,
                    designTimeConfig,
                    uuid,
                });
			}, null);
		},
		[FETCH_APP_VERSION]({ commit }) {
			return Vue.http.get(`/api/system/version`).then(res => {
				const appVersion = res.body || res.bodyText || [];
				commit(SET_APP_VERSION, appVersion);
			});
		},
		[FETCH_APP_LAST_UPDATED]({ commit }) {
			return Vue.http.get(`/api/system/last-updated`).then(res => {
				const appLastUpdated = res.body || res.bodyText || [];
				commit(SET_APP_LAST_UPDATED, appLastUpdated);
			});
		},
        async [SUBSCRIBE_CHANGE_USER_INTERACTION]({ dispatch }, { userId }) {
            subscribe(`/task/interaction/${userId}`, res => {
                const data = JSON.parse(res.body) as UserInteraction;
                console.log(data)
                dispatch(`userInteraction/${UPSERT_USER_INTERACTION}`, data);
            }, this);
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
		[SNACK_TIMEOUT]: state => state.snackTimeout,
		[SNACK_MESSAGE_COLOR]: state => state.snackMessageColor,
		[APP_VERSION]: state => state.appVersion,
		[APP_LAST_UPDATED]: state => state.appLastUpdated,
	},
});
