import Vue from 'vue';
import * as action from './actions';
import * as mutation from './mutations';
import {
	TASK_BY_ID,
	TASKS,
	LAST_TASK,
	TASKS_AT_WORK,
	TASKS_BY_PIPELINE,
	TASKS_PENDING,
	TASKS_HAS_NEXT_PAGE,
} from './getters';
import PipelineStatuses from '../../constants/pipeline-statuses';

const COUNT = 15;

const state = {
	tasks: [],
	loading: false,
	hasNextPage: false,
	offset: 0,
	count: COUNT,
};

const mutations = {
	[mutation.SET_TASKS_LOADING](state, loading) {
		Vue.set(state, 'loading', loading);
	},

	[mutation.REPLACE_TASK](state, task) {
		let index = state.tasks.findIndex(x => x.id === task.id);
		if (index < 0) {
			index = state.tasks.length;
		}
		Vue.set(state.tasks, index, task);
	},
	[mutation.SET_TASKS](state, tasks) {
		Vue.set(state, 'tasks', tasks);
	},

	[mutation.CLEAR_TASKS](state) {
		Vue.set(state, 'tasks', []);
	},

	[mutation.SET_COUNT](state, count) {
		Vue.set(state, 'count', count);
	},

	[mutation.SET_HAS_NEXT_PAGE](state, hasNextPage) {
		Vue.set(state, 'hasNextPage', hasNextPage);
	},
};

const actions = {
	[action.FETCH_TASKS]({ commit, state }, { pipelineId, count }) {
		if (count) {
			commit(mutation.SET_COUNT, count);
		} else {
			commit(mutation.SET_COUNT, COUNT);
		}
		commit(mutation.SET_TASKS_LOADING, true);
		const offset = state.offset;
		const countRequest = state.count;
		if (this.fetch) {
			this.fetch.abort();
		}
		const before = request => (this.fetch = request);
		return Vue.http
			.get(`/api/pipeline-task/list/${pipelineId}/${offset}/${countRequest}`, { before })
			.then(res => {
				const tasks = res.body || [];
				commit(mutation.SET_TASKS, tasks);
				commit(mutation.SET_TASKS_LOADING, false);
				commit(mutation.SET_HAS_NEXT_PAGE, tasks.length === countRequest);
			});
	},

	[action.LOAD_MORE_TASKS]({ commit, dispatch }, { pipelineId }) {
		commit(mutation.SET_TASKS_LOADING, true);
		dispatch(action.FETCH_TASKS, { pipelineId, count: state.count + COUNT });
	},

	async [action.STOP_PIPELINE_TASK]({ dispatch }, { taskId }) {
		await Vue.http.post(`/api/task/stop/${taskId}`);
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
		{ commandName, commandProperties, taskId, uuid }
	) {
		const taskIndex = state.tasks.findIndex(x => x.id === taskId);
		if (taskIndex < 0) {
			return;
		}
		const task = state.tasks[taskIndex];
		commit(mutation.REPLACE_TASK, {
			...task,
			currentExecuteCommand: commandName,
			currentExecuteCommandUuid: uuid,
			currentExecuteCommandProperties: commandProperties,
		});
	},
};

const getters = {
	[TASK_BY_ID]: state => taskId => state.tasks.find(t => t.id === taskId),
	[TASKS]: state => state.tasks,
	[TASKS_HAS_NEXT_PAGE]: state => state.hasNextPage,
	[TASKS_BY_PIPELINE]: state => pipelineId =>
		state.tasks.filter(x => x.pipelineId === pipelineId),
	[LAST_TASK]: state => {
		const tasks = state.tasks;
		return tasks.sort((a, b) => a.endOnUtc > b.endOnUtc).find(a => a);
	},
	[TASKS_AT_WORK]: state => {
		const atWorker = status => {
			const taskStatus = status || '';
			const statuses = Object.values(PipelineStatuses) as any;
			return statuses.filter(s => s.worker && s.title === taskStatus).length > 0;
		};
		const tasks = state.tasks;
		return tasks.filter(x => atWorker(x.status));
	},
	[TASKS_PENDING]: state => {
		const pending = status => {
			const taskStatus = status || '';
			return PipelineStatuses.PENDING.title === taskStatus;
		};
		const tasks = state.tasks;
		return tasks.filter(x => pending(x.status));
	},
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
