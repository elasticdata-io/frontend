import Vue from 'vue';
import * as action from './actions';
import * as mutation from './mutations';
import { TASK_BY_ID, TASKS, LAST_TASK } from './getters';

const state = {
	tasks: [],
	loading: false,
};

const mutations = {
	[mutation.SET_TASKS_LOADING](state, loading) {
		Vue.set(state, 'loading', loading);
	},

	[mutation.REPLACE_TASK](state, task) {
		const index = state.tasks.findIndex(x => x.id === task.id);
		if (index < 0) {
			return;
		}
		Vue.set(state.tasks, index, task);
	},
	[mutation.SET_TASKS](state, tasks) {
		Vue.set(state, 'tasks', tasks);
	},

	[mutation.CLEAR_TASKS](state) {
		Vue.set(state, 'tasks', []);
	},
};

const actions = {
	[action.FETCH_TASKS]({ commit }, { pipelineId }) {
		commit(mutation.SET_TASKS_LOADING, true);
		return Vue.http.get(`/api/pipeline-task/list/${pipelineId}`).then(res => {
			commit(mutation.SET_TASKS, res.body || []);
			commit(mutation.SET_TASKS_LOADING, false);
		});
	},

	async [action.STOP_PIPELINE_TASK]({ dispatch }, { taskId }) {
		const res = await Vue.http.post(`/api/pipeline/stop/${taskId}`);
		const task = res.body;
		dispatch(action.FETCH_TASKS, { pipelineId: task.pipelineId });
	},

	async [action.TASK_CHANGED]({ commit }, { task }) {
		commit(mutation.REPLACE_TASK, task);
	},

	[action.UPDATE_NEW_PARSED_ROWS_COUNT]({ commit, state }, { taskId, newParseRowsCount }) {
		const taskIndex = state.tasks.findIndex(x => x.id === taskId);
		if (taskIndex < 0) {
			return;
		}
		const task = state.tasks[taskIndex];
		commit(mutation.REPLACE_TASK, {
			...task,
			newParseRowsCount: newParseRowsCount,
		});
	},

	[action.UPDATE_CURRENT_EXECUTE_COMMAND](
		{ commit, state },
		{ commandName, commandProperties, taskId }
	) {
		const taskIndex = state.tasks.findIndex(x => x.id === taskId);
		if (taskIndex < 0) {
			return;
		}
		const task = state.tasks[taskIndex];
		commit(mutation.REPLACE_TASK, {
			...task,
			currentExecuteCommand: commandName,
			currentExecuteCommandProperties: commandProperties,
		});
	},
};

const getters = {
	[TASK_BY_ID]: state => taskId => state.tasks.find(t => t.id === taskId),
	[TASKS]: state => state.tasks,
	[LAST_TASK]: state => {
		const tasks = state.tasks;
		return tasks.sort((a, b) => a.endOn > b.endOn).find(a => a);
	},
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
