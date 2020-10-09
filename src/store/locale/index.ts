import Vue from 'vue';
import { LOCALE, LOCALES } from './getters';
import { SET_LOCALE } from './mutations';
import { INIT_LOCALE } from './actions';
import i18n from '../../i18n';
import * as moment from 'moment';

const locales = [
	{
		id: 'ru',
		title: 'Русский',
	},
	{
		id: 'uk',
		title: 'Українська',
	},
	{
		id: 'en',
		title: 'English',
	},
];

const state = {
	locales: locales,
	locale: {},
};

const mutations = {
	[SET_LOCALE](state, locale) {
		if (!locale) {
			return;
		}
		Vue.set(state, 'locale', locale);
		Vue.localStorage.set('locale', JSON.stringify(locale));
		i18n.locale = locale.id;
		moment.locale(locale.id);
	},
};

const actions = {
	[INIT_LOCALE]({ commit }) {
		const locale = Vue.localStorage.get('locale');
		const localeFromStore = (locale && JSON.parse(locale)) || locales.find(x => x.id === 'uk');
		if (localeFromStore) {
			commit(SET_LOCALE, localeFromStore);
		}
	},
};

const getters = {
	[LOCALE]: state => state.locale,
	[LOCALES]: state => state.locales,
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
