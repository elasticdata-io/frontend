import Vue from 'vue';
import { COMMAND_BY_CMD, COMMANDS } from './getters';
import { FETCH_COMMANDS_DOCUMENTATION } from './actions';
import { MERGE_COMMANDS } from './mutations';

const state = {
	commands: [
		{
			cmd: 'openurl',
			route: { name: 'docs.commands.openurl' },
			examples: [
				{
					name: 'static link',
					code: {
						version: '2.0',
						commands: [
							{
								cmd: 'openurl',
								link: 'https://sandbox.elasticdata.io',
							},
							{
								cmd: 'getscreenshot',
							},
						],
					},
					outputData: [],
				},
				{
					name: 'dynamic link',
					code: {
						version: '2.0',
						commands: [
							{
								cmd: 'openurl',
								link: {
									cmd: 'js',
									script: `'https://' + 'sandbox.elasticdata.io'`,
								},
							},
							{
								cmd: 'getscreenshot',
							},
						],
					},
					outputData: [],
				},
			],
		},
	],
};

const mutations = {
	[MERGE_COMMANDS](state, commandsDocs) {
		commandsDocs.forEach((commandDoc, index) => {
			const findCommand = state.commands.find(x => x.cmd === commandDoc.cmd);
			if (findCommand) {
				commandsDocs[index] = {
					...commandDoc,
					...findCommand,
				};
			}
		});
		Vue.set(state, 'commands', commandsDocs);
	},
};

const actions = {
	[FETCH_COMMANDS_DOCUMENTATION]({ commit }) {
		Vue.http.get(`/worker/doc/commands/v2`).then(res => {
			commit(MERGE_COMMANDS, res.body);
		});
	},
};

const getters = {
	[COMMANDS]: state => {
		return state.commands.sort((a, b) => {
			if (a.cmd > b.cmd) {
				return 1;
			}
			if (a.cmd < b.cmd) {
				return -1;
			}
			return 0;
		});
	},
	[COMMAND_BY_CMD]: state => cmd => {
		return state.commands.find(x => x.cmd === cmd);
	},
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
