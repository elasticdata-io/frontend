import Vue from 'vue';
import * as moment from 'moment';
import App from './App.vue';
import VueResource from 'vue-resource';
import VueLocalStorage from 'vue-localstorage';
import router from './router';
import store from './store';
import { messages } from './i18n';

import 'vuetify/dist/vuetify.min.css';
import vuetify from './vuetify';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);
Vue.use(VueResource);
Vue.use(VueLocalStorage);

Vue.config.productionTip = false;

Vue.http.options.emulateJSON = true;
Vue.http.interceptors.push(function(request, next) {
	request.headers.set('token', Vue.localStorage.get('token'));
	next(function(response) {
		if (response.status === 401) {
			location.href = '/#/login';
		}
	});
});

moment.locale('uk');

const i18n = new VueI18n({
	locale: 'uk', // set locale
	messages, // set locale messages
});

new Vue({
	router,
	store,
	vuetify,
	i18n,
	render: h => h(App),
}).$mount('#app');
