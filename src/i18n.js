import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { ENGLISH_TRANSLATIONS } from './i18n/en';
import { RUSSIAN_TRANSLATIONS } from './i18n/ru';
import { UKRAINE_TRANSLATIONS } from './i18n/uk';

Vue.use(VueI18n);

const defaultLocale = 'uk';
const TRANSLATIONS = {
	en: ENGLISH_TRANSLATIONS,
	ru: RUSSIAN_TRANSLATIONS,
	uk: UKRAINE_TRANSLATIONS,
};

const i18n = new VueI18n({
	locale: defaultLocale,
	messages: TRANSLATIONS,
});

export default i18n;
