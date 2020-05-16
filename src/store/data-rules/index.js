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
	],
};

const mutations = {};

const actions = {};

const getters = {
	[DATA_RULES]: state => state.dataRules,
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
