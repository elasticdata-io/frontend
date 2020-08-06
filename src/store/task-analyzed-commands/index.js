import Vue from 'vue';
import * as _ from 'underscore';
import * as action from './actions';
import * as mutation from './mutations';
import * as getter from './getters';

/**
 * @typedef {Object} LoopPageState
 * @property {String} loopContext
 * @property {Number} loopIndex
 * @property {String} loopUuid
 * @property {String} loopMaterializedUuid
 */

const state = {
	showOnlyWithError: false,
	taskAnalyzedCommands: [],
	/**
	 * @type {Object.<string, LoopPageState>}
	 */
	loops: {},
};

const getChildMaterializedUuidPathArray = (state, materializedUuidPath) => {
	const keys = Object.keys(state.loops).sort();
	const findKeyIndex = keys.indexOf(materializedUuidPath);
	if (findKeyIndex === -1) {
		return [];
	}
	return keys
		.slice(findKeyIndex + 1, keys.length)
		.filter(x => x.startsWith(`${materializedUuidPath}_`));
};

const getParentMaterializedUuid = (state, materializedUuidPath) => {
	const keys = Object.keys(state.loops)
		.filter(x => {
			return materializedUuidPath.startsWith(`${x}_`) || materializedUuidPath === x;
		})
		.sort();
	const findKeyIndex = keys.indexOf(materializedUuidPath);
	if (findKeyIndex === -1) {
		return [];
	}
	return keys[findKeyIndex - 1];
};

const findLoopByMaterializedUuid = (state, materializedUuid) => {
	const parentMaterializedUuid = getParentMaterializedUuid(state, materializedUuid);
	if (!parentMaterializedUuid) {
		return state.taskAnalyzedCommands.find(x => x.materializedUuidPath === materializedUuid);
	}
	const parentLoopPageState = state.loops[parentMaterializedUuid];
	const parentContext = `${parentLoopPageState.loopContext}.${parentLoopPageState.loopIndex}`;
	return state.taskAnalyzedCommands
		.filter(x => x.cmd === 'loop')
		.filter(x => x.materializedUuidPath === materializedUuid)
		.find(x => {
			const context = x.context ? `${x.dataContext}.${x.context}` : x.dataContext;
			return context.startsWith(parentContext);
		});
};

const mutations = {
	[mutation.SET_SHOW_ONLY_WITH_ERRORS](state, showOnlyWithError) {
		Vue.set(state, 'showOnlyWithError', showOnlyWithError);
	},

	[mutation.SET_LOOP_DISPLAY_INDEX](state, { uuid, materializedUuidPath, index }) {
		const loop = findLoopByMaterializedUuid(state, materializedUuidPath);
		const loopContext = loop.designTimeConfig.context
			? `${loop.dataContext}.${loop.designTimeConfig.context}`
			: loop.dataContext;
		const loopPageState = {
			loopContext: loopContext,
			loopIndex: index,
			loopMaterializedUuid: materializedUuidPath,
			loopUuid: uuid,
		};
		Vue.set(state.loops, materializedUuidPath, loopPageState);
	},

	[mutation.RESET_LOOP_DISPLAY_INDEX_FOR_CHILD](state, { materializedUuidPath }) {
		const childMaterializedUuidArray = getChildMaterializedUuidPathArray(
			state,
			materializedUuidPath
		);
		if (childMaterializedUuidArray.length === 0) {
			return;
		}
		childMaterializedUuidArray.forEach(materializedUuid => {
			const loops = state.loops;
			const newLoop = findLoopByMaterializedUuid(state, materializedUuid);
			const loopContext = newLoop.designTimeConfig.context
				? `${newLoop.dataContext}.${newLoop.designTimeConfig.context}`
				: newLoop.dataContext;
			loops[materializedUuid] = {
				loopContext: loopContext,
				loopIndex: 0,
				loopMaterializedUuid: newLoop.materializedUuidPath,
				loopUuid: newLoop.uuid,
			};
			Vue.set(state, 'loops', loops);
		});
	},

	[mutation.INITIALIZE_DEFAULT_LOOP_DISPLAY_INDEX](state, taskAnalyzedCommands) {
		const loops = {};
		let loopCommands = taskAnalyzedCommands.filter(x => x.cmd === 'loop');
		loopCommands = _.uniq(loopCommands, x => x.materializedUuidPath);
		loopCommands.forEach(loopCommand => {
			const loopContext = loopCommand.designTimeConfig.context
				? `${loopCommand.dataContext}.${loopCommand.designTimeConfig.context}`
				: loopCommand.dataContext;
			loops[loopCommand.materializedUuidPath] = {
				loopUuid: loopCommand.uuid,
				loopMaterializedUuid: loopCommand.materializedUuidPath,
				loopIndex: 0,
				loopContext: loopContext,
			};
		});
		Vue.set(state, 'loops', loops);
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
		const uuids = Object.values(state.loops).map(x => x.loopUuid);
		for (const uuid of uuids) {
			const loopPageState = Object.values(state.loops).find(x => x.loopUuid === uuid);
			const loopIndex = loopPageState.loopIndex;
			const loopCommand = state.taskAnalyzedCommands.find(x => x.uuid === uuid);
			if (!loopCommand) {
				continue;
			}
			const uuidPath = loopCommand.materializedUuidPath;
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
	[getter.LOOP_DISPLAY_INDEXES_BY_UUID]: state => {
		const loopIndexesByUuid = {};
		Object.values(state.loops).forEach(x => (loopIndexesByUuid[x.loopUuid] = x.loopIndex));
		return loopIndexesByUuid;
	},
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
