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
		<v-list dense>
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
			<template v-for="item in sections">
				<v-list-group
					v-if="item.children"
					:key="item.text"
					v-model="item.model"
					:prepend-icon="item.model ? item.icon : item['icon-alt']"
					append-icon=""
				>
					<template v-slot:activator>
						<v-list-item-content>
							<v-list-item-title>
								{{ $t(item.text) }}
							</v-list-item-title>
						</v-list-item-content>
					</template>
					<v-list-item
						v-for="(child, i) in item.children"
						:key="i"
						link
						:to="child.route"
						:href="child.href"
						:target="child.target"
					>
						<v-list-item-action v-if="child.icon">
							<v-icon>{{ child.icon }}</v-icon>
						</v-list-item-action>
						<v-list-item-content>
							<v-list-item-title>
								{{ $t(child.text) }}
							</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
					<v-divider></v-divider>
				</v-list-group>
				<v-list-item
					v-else
					:key="item.text"
					link
					:disabled="item.disabled"
					:to="item.route"
					:href="item.href"
					:target="item.target"
				>
					<v-list-item-action>
						<v-icon>{{ item.icon }}</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>
							{{ $t(item.text) }}
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</template>
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
		sections: function() {
			return this.items.concat(this.adminItems);
		},
		adminItems: function() {
			const user = this.user || {};
			if (user.isAdmin) {
				return [{ icon: 'security', text: 'Admin', route: { name: 'admin' } }];
			}
			return [];
		},
	},
	data: () => {
		return {
			expand: true,
			items: [
				{
					icon: 'list',
					text: 'USER_MENU.PIPELINES',
					route: { name: 'pipelines' },
				},
				{
					icon: 'expand_less',
					'icon-alt': 'expand_more',
					text: 'USER_MENU.HELP',
					model: false,
					children: [
						{
							icon: 'layers',
							text: 'DSL 2.0',
							route: { name: 'docs' },
						},
						{
							icon: 'local_offer',
							text: 'DSL 1.0',
							href: '//docs.elasticdata.io',
							target: '_blank',
						},
					],
				},
				{
					icon: 'equalizer',
					text: 'USER_MENU.ANALYTICS',
					route: { name: 'analytics' },
					disabled: true,
				},
				{
					icon: 'payment',
					text: 'USER_MENU.PAYMENT',
					route: { name: 'payment' },
					disabled: true,
				},
				{
					icon: 'account_circle',
					text: 'USER_MENU.ACCOUNT',
					route: { name: 'account' },
				},
			],
		};
	},
	methods: {
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
