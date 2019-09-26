<template>
	<v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app dark color="primary">
		<v-app-bar-nav-icon v-if="showUserToggleMenu" @click="toggleMenu()">
			<v-icon>menu</v-icon>
		</v-app-bar-nav-icon>
		<v-toolbar-title class="ml-0 pl-4">
			<a href="/" class="md-title" style="flex: 1 1 0%;">
				<img src="/logo-black.svg" width="125" alt="elastic data service" />
			</a>
		</v-toolbar-title>
		<div class="flex-grow-1"></div>
		<v-btn small text to="/logout" color="white">
			<v-icon>exit_to_app</v-icon>
			<span style="padding-left: 5px;">Exit</span>
		</v-btn>
	</v-app-bar>
</template>
<script>
import { mapGetters } from 'vuex';
import { IS_MOBILE_VIEW } from '../store/getters';
import { TOGGLE_SHOW_VERTICAL_MENU } from '../store/mutations';

export default {
	computed: {
		...mapGetters({
			IS_MOBILE_VIEW: IS_MOBILE_VIEW,
		}),
		showUserToggleMenu: function() {
			return true;
		},
	},
	methods: {
		toggleMenu() {
			this.$store.commit(TOGGLE_SHOW_VERTICAL_MENU);
		},
	},
};
</script>
