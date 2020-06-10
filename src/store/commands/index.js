import { COMMAND_BY_CMD, COMMANDS } from './getters';

const state = {
	commands: [
		{
			cmd: 'openurl',
			summary: 'Залишити тільки цифри',
			route: { name: 'docs.commands.openurl' },
			properties: [],
			examples: [
				{
					code: {
						version: '2.0',
						commands: [
							{
								cmd: 'openurl',
								link: 'https://sandbox.elasticdata.io',
							},
						],
					},
					outputData: [],
				},
			],
		},
	],
};

const mutations = {};

const actions = {};

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
