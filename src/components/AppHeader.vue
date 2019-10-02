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
		<v-menu offset-y>
			<template v-slot:activator="{ on }">
				<v-btn v-if="login" v-on="on" small color="white" text>
					<span style="padding-left: 5px;">{{ login }}</span>
				</v-btn>
			</template>
			<v-list>
				<v-list-item :to="{ name: 'account' }">
					<v-list-item-title>
						<v-icon>perm_identity</v-icon>
						<span style="padding-left: 5px;">Аккаунт</span>
					</v-list-item-title>
				</v-list-item>
				<v-list-item :to="{ name: 'logout' }">
					<v-list-item-title>
						<v-icon>exit_to_app</v-icon>
						<span style="padding-left: 5px;">Вийти</span>
					</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-menu>
	</v-app-bar>
</template>
<script>
import { mapGetters } from 'vuex';
import { IS_MOBILE_VIEW } from '../store/getters';
import { TOGGLE_SHOW_VERTICAL_MENU } from '../store/mutations';
import { LOGGED_IN, LOGIN } from '../store/user/getters';

export default {
	computed: {
		...mapGetters({
			IS_MOBILE_VIEW: IS_MOBILE_VIEW,
		}),
		...mapGetters('user', {
			login: LOGIN,
			loggedIn: LOGGED_IN,
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
