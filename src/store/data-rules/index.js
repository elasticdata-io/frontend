import { DATA_RULE_BY_CMD, DATA_RULES } from './getters';

const state = {
	dataRules: [
		{
			cmd: 'only_number',
			summary: 'Залишити тільки цифри',
			route: { name: 'docs.data-rules.only_number' },
			supportTypes: [String, Array],
		},
		{
			cmd: 'trim',
			summary: 'Обрізати пусті символи по крям',
			route: { name: 'docs.data-rules.trim' },
			supportTypes: [String, Array],
		},
		{
			cmd: 'replace',
			summary: 'Знайти і замінити',
			route: { name: 'docs.data-rules.replace' },
			supportTypes: [String, Array],
		},
		{
			cmd: 'replace_regex',
			summary: 'Знайти і замінити по регулярному виразу',
			route: { name: 'docs.data-rules.replace_regex' },
			supportTypes: [String, Array],
		},
		{
			cmd: 'concat',
			summary: 'Обєднати декілька ключів',
			route: { name: 'docs.data-rules.concat' },
			disabled: true,
		},
		{
			cmd: 'extract_regex',
			summary: 'Вибрати необхдний текст по регулярному виразу',
			route: { name: 'docs.data-rules.extract_regex' },
			supportTypes: [String, Array],
		},
		{
			cmd: 'split',
			summary: 'Розбити текст на массив',
			route: { name: 'docs.data-rules.split' },
			supportTypes: [String],
		},
		{
			cmd: 'unique',
			summary: 'Залишити лише унікальні записи у масиві',
			route: { name: 'docs.data-rules.unique' },
			supportTypes: [Array],
		},
		{
			cmd: 'join',
			summary: 'Сформувати строку з елементів массива',
			route: { name: 'docs.data-rules.join' },
			supportTypes: [Array],
		},
	],
};

const mutations = {};

const actions = {};

const getters = {
	[DATA_RULES]: state => {
		return state.dataRules.sort((a, b) => {
			if (a.cmd > b.cmd) {
				return 1;
			}
			if (a.cmd < b.cmd) {
				return -1;
			}
			return 0;
		});
	},
	[DATA_RULE_BY_CMD]: state => cmd => {
		return state.dataRules.find(x => x.cmd === cmd);
	},
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
