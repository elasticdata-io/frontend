<template>
	<v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app dark color="primary">
		<v-app-bar-nav-icon v-if="showUserToggleMenu" @click="toggleMenu()">
			<v-icon>menu</v-icon>
		</v-app-bar-nav-icon>
		<v-toolbar-title class="ml-0 pl-4">
			<a href="/" class="md-title" style="flex: 1 1 0%;">
				<img src="/logo-black.svg" width="125" alt="elastic data service" />
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<small class="app-version" v-on="on">{{ APP_VERSION }}</small>
					</template>
					<span>Востанє оновлено: {{ lastUpdated }}</span>
				</v-tooltip>
			</a>
		</v-toolbar-title>
		<div class="flex-grow-1"></div>
		<v-menu>
			<template v-slot:activator="{ on }">
				<v-btn v-on="on" light x-small depressed>
					{{ locale.id }}
				</v-btn>
			</template>

			<v-list>
				<v-list-item v-for="(item, i) in locales" :key="i" @click="changeLocale(item)">
					<v-list-item-title>{{ item.title }}</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-menu>
		<v-menu offset-y v-if="login">
			<template v-slot:activator="{ on }">
				<v-btn v-on="on" small color="white" text>
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
import moment from 'moment';
import { APP_LAST_UPDATED, APP_VERSION, IS_MOBILE_VIEW } from '../store/getters';
import { TOGGLE_SHOW_VERTICAL_MENU } from '../store/mutations';
import { LOGGED_IN, LOGIN } from '../store/user/getters';
import { SET_LOCALE } from '../store/locale/mutations';
import { LOCALE, LOCALES } from '../store/locale/getters';

export default {
	data: () => {
		return {};
	},
	computed: {
		...mapGetters({
			IS_MOBILE_VIEW: IS_MOBILE_VIEW,
			APP_VERSION: APP_VERSION,
			APP_LAST_UPDATED: APP_LAST_UPDATED,
		}),
		...mapGetters('user', {
			login: LOGIN,
			loggedIn: LOGGED_IN,
		}),
		...mapGetters('locale', {
			locales: LOCALES,
			locale: LOCALE,
		}),
		showUserToggleMenu: function() {
			return true;
		},
		lastUpdated: function() {
			if (!this.APP_LAST_UPDATED) {
				return;
			}
			return moment(this.APP_LAST_UPDATED).fromNow();
		},
	},
	methods: {
		toggleMenu() {
			this.$store.commit(TOGGLE_SHOW_VERTICAL_MENU);
		},
		changeLocale(locale) {
			this.$store.commit(`locale/${SET_LOCALE}`, locale);
			location.reload();
		},
	},
};
</script>
<style lang="less">
.app-version {
	color: white;
	font-size: 12px;
	font-weight: bold;
	padding-left: 8px;
	font-family: 'Ubuntu Mono', 'Ubuntu', sans-serif;
}
</style>
