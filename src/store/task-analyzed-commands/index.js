import Vue from 'vue';
import * as action from './actions';
import * as mutation from './mutations';
import * as getter from './getters';

const state = {
	showOnlyWithError: false,
	loopIndexesByUuid: {},
	loopIndexesByMaterializedUuidPath: {},
	taskAnalyzedCommands: [],
};

const getChildMaterializedUuidPathList = (state, materializedUuidPath) => {
	const keys = Object.keys(state.loopIndexesByMaterializedUuidPath).sort();
	const findKeyIndex = keys.indexOf(materializedUuidPath);
	if (findKeyIndex === -1) {
		return [];
	}
	return keys.slice(findKeyIndex + 1, keys.length);
};

const mutations = {
	[mutation.SET_SHOW_ONLY_WITH_ERRORS](state, showOnlyWithError) {
		Vue.set(state, 'showOnlyWithError', showOnlyWithError);
	},

	[mutation.SET_LOOP_DISPLAY_INDEX](state, { uuid, materializedUuidPath, index }) {
		Vue.set(state.loopIndexesByUuid, uuid, index);
		Vue.set(state.loopIndexesByMaterializedUuidPath, materializedUuidPath, index);
	},

	[mutation.RESET_LOOP_DISPLAY_INDEX_FOR_CHILD](state, { materializedUuidPath }) {
		const uuidPathList = getChildMaterializedUuidPathList(state, materializedUuidPath);
		if (uuidPathList.length === 0) {
			return;
		}
		const uuidList = state.taskAnalyzedCommands
			.filter(x => uuidPathList.indexOf(x.materializedUuidPath) !== -1)
			.map(x => x.uuid);
		const loopIndexesByUuid = state.loopIndexesByUuid;
		uuidList.forEach(uuid => (loopIndexesByUuid[uuid] = 0));

		const loopIndexesByMaterializedUuidPath = state.loopIndexesByMaterializedUuidPath;
		uuidPathList.forEach(uuidPath => (loopIndexesByMaterializedUuidPath[uuidPath] = 0));

		Vue.set(state, 'loopIndexesByMaterializedUuidPath', loopIndexesByMaterializedUuidPath);
		Vue.set(state, 'loopIndexesByUuid', loopIndexesByUuid);
	},

	[mutation.INITIALIZE_DEFAULT_LOOP_DISPLAY_INDEX](state, taskAnalyzedCommands) {
		const loopIndexesByUuid = {};
		const loopIndexesByMaterializedUuidPath = {};
		for (const taskAnalyzedCommand of taskAnalyzedCommands) {
			const cmd = taskAnalyzedCommand.cmd;
			if (cmd !== 'loop') {
				continue;
			}
			const uuid = taskAnalyzedCommand.uuid;
			const materializedUuidPath = taskAnalyzedCommand.materializedUuidPath;
			loopIndexesByUuid[uuid] = 0;
			loopIndexesByMaterializedUuidPath[materializedUuidPath] = 0;
		}
		Vue.set(state, 'loopIndexesByUuid', loopIndexesByUuid);
		Vue.set(state, 'loopIndexesByMaterializedUuidPath', loopIndexesByMaterializedUuidPath);
	},

	[mutation.SET_TASK_ANALYZED_COMMANDS](state, taskAnalyzedCommands) {
		Vue.set(state, 'taskAnalyzedCommands', taskAnalyzedCommands);
	},
};

const actions = {
	async [action.CHANGE_LOOP_DISPLAY_INDEX]({ commit }, { uuid, materializedUuidPath, index }) {
		commit(mutation.SET_LOOP_DISPLAY_INDEX, { uuid, materializedUuidPath, index });
		commit(mutation.RESET_LOOP_DISPLAY_INDEX_FOR_CHILD, { materializedUuidPath });
	},

	async [action.INITIALIZE_TASK_ANALYZED_COMMANDS]({ commit }, taskAnalyzedCommands) {
		commit(mutation.SET_TASK_ANALYZED_COMMANDS, taskAnalyzedCommands);
		commit(mutation.INITIALIZE_DEFAULT_LOOP_DISPLAY_INDEX, taskAnalyzedCommands);
	},
};

const getters = {
	[getter.TASK_ANALYZED_COMMANDS]: state => {
		let taskAnalyzedCommands = state.taskAnalyzedCommands || [];
		if (state.showOnlyWithError) {
			return taskAnalyzedCommands.filter(x => x.status === 'error');
		}
		let loopIndexesByMaterializedUuidPath = state.loopIndexesByMaterializedUuidPath;
		const uuidPaths = Object.keys(loopIndexesByMaterializedUuidPath).sort();
		const loopCommands = taskAnalyzedCommands.filter(x => x.cmd === 'loop');
		for (const uuidPath of uuidPaths) {
			const loopIndex = loopIndexesByMaterializedUuidPath[uuidPath];
			const loopCommand = loopCommands.find(x => x.materializedUuidPath === uuidPath);
			const loopContext = loopCommand.designTimeConfig.context;
			const loopDataContext = loopCommand.dataContext;
			const loopFullContext = loopContext
				? `${loopDataContext}.${loopContext}.${loopIndex}`
				: `${loopDataContext}.${loopIndex}`;
			taskAnalyzedCommands = taskAnalyzedCommands.filter(command => {
				if (command.materializedUuidPath === uuidPath) {
					// todo: display only loop command with need context
					return true;
				}
				if (command.materializedUuidPath.startsWith(`${uuidPath}_`)) {
					const containContext = command.dataContext.startsWith(`${loopFullContext}.`);
					const equalContext = command.dataContext === loopFullContext;
					return containContext || equalContext;
				}
				return true;
			});
		}
		return taskAnalyzedCommands;
	},
	[getter.LOOP_DISPLAY_INDEXES_BY_UUID]: state => state.loopIndexesByUuid,
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
