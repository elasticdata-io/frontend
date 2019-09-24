// src/plugins/vuetify.js

import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/es5/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		primary: '#004d9f',
		secondary: colors.red.darken1,
		accent: '#8caed4',
		background: '#f5f5f5',
	},
});
