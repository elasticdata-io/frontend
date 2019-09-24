import Vue from 'vue';
import App from './App.vue';
import VueResource from 'vue-resource';
import VueLocalStorage from 'vue-localstorage';
import router from './router';
import store from './store';

import 'vuetify/dist/vuetify.min.css';
import vuetify from './vuetify';

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

new Vue({
	router,
	store,
	vuetify,
	render: h => h(App),
}).$mount('#app');
