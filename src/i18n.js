import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { ENGLISH_TRANSLATIONS } from './translations/en';
import { RUSSIAN_TRANSLATIONS } from './translations/ru';
import { UKRAINE_TRANSLATIONS } from './translations/uk';

Vue.use(VueI18n);

const locale = 'uk';
const TRANSLATIONS = {
	en: ENGLISH_TRANSLATIONS,
	ru: RUSSIAN_TRANSLATIONS,
	uk: UKRAINE_TRANSLATIONS,
};

const i18n = new VueI18n({
	locale: locale,
	messages: TRANSLATIONS,
});

export default i18n;
