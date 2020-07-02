import Vue from 'vue';
import * as moment from 'moment';
import App from './App.vue';
import VueResource from 'vue-resource';
import VueLocalStorage from 'vue-localstorage';
import Vuelidate from 'vuelidate';
import router from './router';
import store from './store';

import 'vuetify/dist/vuetify.min.css';
import vuetify from './vuetify';
import VueI18n from 'vue-i18n';
import { SET_SNACK_MESSAGE } from './store/mutations';
import { ENGLISH_TRANSLATIONS } from './translations/en';
import { RUSSIAN_TRANSLATIONS } from './translations/ru';
import { UKRAINE_TRANSLATIONS } from './translations/uk';

Vue.use(VueI18n);
Vue.use(VueResource);
Vue.use(VueLocalStorage);
Vue.use(Vuelidate);

Vue.config.productionTip = false;

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

Vue.http.options.emulateJSON = true;
Vue.http.interceptors.push(function(request, next) {
	request.headers.set('token', Vue.localStorage.get('token'));
	request.headers.set('lang', i18n.locale);
	next(function(response) {
		if (response.status === 401) {
			router.push({ name: 'logout' });
		}
		if (response.status === 500) {
			const message =
				typeof response.body === 'string' ? response.body : response.body.message;
			store.commit(SET_SNACK_MESSAGE, {
				msg: `Упс... Виникла помилка на сервері: ${message}`,
			});
		}
	});
});

moment.locale(locale);

new Vue({
	router,
	store,
	vuetify,
	i18n,
	render: h => h(App),
}).$mount('#app');
