<template>
	<v-navigation-drawer
		v-if="visible"
		:value="SHOW_VERTICAL_MENU"
		class="user-vertical-menu grey lighten-4"
		fixed
		app
		:disable-route-watcher="true"
		:clipped="true"
		:touchless="true"
	>
		<v-list>
			<v-list-item>
				<v-list-item-content>
					<v-list-item-title>
						<avatar-icon :picture="user.picture"></avatar-icon>
						<span class="pl-2" v-if="!missingName"
							>{{ user.firstName }} {{ user.lastName }}</span
						>
						<span class="pl-2" v-if="missingName">{{ user.login }}</span>
					</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
			<v-divider></v-divider>
			<v-list-item :to="{ name: 'pipelines' }">
				<v-list-item-title>
					<v-icon>list</v-icon>
					<span class="pl-2">Павуки</span>
				</v-list-item-title>
			</v-list-item>
			<v-list-item :to="{ name: 'payment' }">
				<v-list-item-title>
					<v-icon>payment</v-icon>
					<span class="pl-2">Оплата</span>
				</v-list-item-title>
			</v-list-item>
			<v-list-item href="//docs.elasticdata.io" target="_blank">
				<v-list-item-title>
					<v-icon>help</v-icon>
					<span class="pl-2">Допомога</span>
				</v-list-item-title>
			</v-list-item>
			<v-list-item :to="{ name: 'account' }">
				<v-list-item-title>
					<v-icon>account_circle</v-icon>
					<span class="pl-2">Аккаунт</span>
				</v-list-item-title>
			</v-list-item>
		</v-list>
	</v-navigation-drawer>
</template>
<script>
import { mapGetters } from 'vuex';
import AvatarIcon from './AvatarIcon';
import { SHOW_VERTICAL_MENU } from '../store/getters';
import { LOGGED_IN, USER } from '../store/user/getters';

export default {
	components: {
		AvatarIcon,
	},
	computed: {
		...mapGetters({
			SHOW_VERTICAL_MENU: SHOW_VERTICAL_MENU,
		}),
		...mapGetters('user', {
			loggedIn: LOGGED_IN,
		}),
		...mapGetters('user', {
			user: USER,
		}),
		visible: function() {
			return this.loggedIn;
		},
		missingName: function() {
			return !this.firstName && !this.lastName;
		},
	},
	data: () => {
		return {
			expand: true,
		};
	},
	methods: {
		goTo(path) {
			this.$router.push(path);
		},
		activeClass(path) {
			return {
				active: this.$route.fullPath.startsWith(path),
			};
		},
	},
};
</script>
<style lang="less">
.user-vertical-menu {
	.menu-vertical {
		font-family: 'PT Sans', sans-serif;
	}

	.v-list {
		font-family: 'Ubuntu', sans-serif;

		.active > a.v-list__tile--link {
			background: #0000000a;
		}
	}

	.v-list--dense .v-list__tile {
		font-size: 14px;
		letter-spacing: 0.02em;
	}

	.user-role {
		position: relative;
		height: 24px;
		color: #004d9f;
		cursor: pointer;
		display: inline-block;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;

		span {
			position: relative;
			bottom: 3px;
			display: inline-block;
			height: 24px;
		}

		.v-icon {
			color: #004d9f;
		}
	}
}
</style>
