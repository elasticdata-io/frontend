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
