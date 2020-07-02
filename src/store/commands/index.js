import Vue from 'vue';
import { COMMAND_BY_CMD, COMMANDS } from './getters';
import { FETCH_COMMANDS_DOCUMENTATION } from './actions';
import { MERGE_COMMANDS } from './mutations';

const state = {
	commands: [
		{
			cmd: 'openurl',
			route: { name: 'docs.commands.custom', params: { cmd: 'openurl' } },
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
			description: 'Команда використовуєтся для завантаження веб сторінки (url адреси)',
		},
		{
			cmd: 'loop',
			examples: [
				{
					name: 'use loop index in CSS/XPATH selector',
					code: {
						version: '2.0',
						commands: [
							{
								cmd: 'openurl',
								link: 'https://sandbox.elasticdata.io/pagination/0',
							},
							{
								cmd: 'loop',
								commands: [
									{
										cmd: 'gettext',
										key: 'title',
										selector: '.card-title{$i}',
									},
								],
							},
						],
					},
					outputData: [
						{ title: 'Card title 1.1' },
						{ title: 'Card title 1.2' },
						{ title: 'Card title 1.3' },
					],
				},
				{
					name: 'use loop context in CSS/XPATH selector',
					code: {
						version: '2.0',
						commands: [
							{
								cmd: 'openurl',
								link: 'https://sandbox.elasticdata.io/pagination/0',
							},
							{
								cmd: 'loop',
								context: 'cards',
								commands: [
									{
										cmd: 'gettext',
										key: 'title',
										selector: '.card{$i} .card-title',
									},
								],
							},
						],
					},
					outputData: [
						{
							cards: [
								{ title: 'Card title 1.1' },
								{ title: 'Card title 1.2' },
								{ title: 'Card title 1.3' },
							],
						},
					],
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
					...{
						examples: [],
					},
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
