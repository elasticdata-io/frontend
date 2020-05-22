import { DATA_RULES } from './getters';

const state = {
	dataRules: [
		{
			cmd: 'only_number',
			summary: 'Залишити тільки цифри',
			route: { name: 'docs.data-rules.only_number' },
		},
		{
			cmd: 'trim',
			summary: 'Обрізати пусті символи по крям',
			route: { name: 'docs.data-rules.trim' },
		},
		{
			cmd: 'replace',
			summary: 'Знайти і замінити',
			route: { name: 'docs.data-rules.replace' },
		},
		{
			cmd: 'replace_regex',
			summary: 'Знайти і замінити по регулярному виразу',
			route: { name: 'docs.data-rules.replace_regex' },
		},
		{
			cmd: 'concat',
			summary: 'Обєднати декілька ключів',
			route: { name: 'docs.data-rules.concat' },
			disabled: true,
		},
		{
			cmd: 'extract',
			summary: 'Вибрати необхдний текст',
			route: { name: 'docs.data-rules.extract' },
			disabled: true,
		},
		{
			cmd: 'split',
			summary: 'Розбити текст на массив',
			route: { name: 'docs.data-rules.split' },
		},
		{
			cmd: 'unique',
			summary: 'Залишити лише унікальні записи у масиві',
			route: { name: 'docs.data-rules.unique' },
		},
		{
			cmd: 'join',
			summary: 'Сформувати строку з елементів массива',
			route: { name: 'docs.data-rules.join' },
		},
	],
};

const mutations = {};

const actions = {};

const getters = {
	[DATA_RULES]: state =>
		state.dataRules.sort((a, b) => {
			if (a.cmd > b.cmd) {
				return 1;
			}
			if (a.cmd < b.cmd) {
				return -1;
			}
			return 0;
		}),
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
