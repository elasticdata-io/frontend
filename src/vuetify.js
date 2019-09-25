// src/plugins/vuetify.js

import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/es5/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		themes: {
			light: {
				primary: '#002884',
				secondary: colors.red.darken1,
				action: '#3f51b5',
				accent: '#8c9eff',
				error: '#b71c1c',
			},
		},
	},
});
