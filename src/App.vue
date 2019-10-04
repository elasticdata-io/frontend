<template>
	<v-app id="app">
		<user-menu></user-menu>
		<app-header></app-header>
		<div id="content">
			<router-view></router-view>
		</div>
		<snackbar></snackbar>
		<http-transport-layer></http-transport-layer>
	</v-app>
</template>

<script>
import HttpTransportLayer from './components/HttpTransportLayer.vue';
import Snackbar from './components/Snackbar';
import AppHeader from './components/AppHeader';
import UserMenu from './components/UserMenu';
import { SUBSCRIBE_PIPELINE_ALL, WEBSOCKET_CONNECT } from './store/actions';
import { USER } from './store/user/getters';
import { mapGetters } from 'vuex';

export default {
	components: { HttpTransportLayer, Snackbar, AppHeader, UserMenu },
	computed: {
		...mapGetters('user', {
			user: USER,
		}),
	},
	created() {
		const userId = this.user && this.user.id;
		if (userId) {
			this.$store.dispatch(WEBSOCKET_CONNECT, { userId });
			this.$store.dispatch(SUBSCRIBE_PIPELINE_ALL, { userId });
		}
	},
};
</script>
<style>
* {
	font-family: Ubuntu, sans-serif;
	/*font-family: 'PT Sans', Ubuntu, sans-serif;*/
}
</style>
