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
import { stompConnect } from './store/websocket';
import { SUBSCRIBE_PIPELINE } from './store/actions';

export default {
	components: { HttpTransportLayer, Snackbar, AppHeader, UserMenu },
	created() {
		stompConnect();
		this.$store.dispatch(SUBSCRIBE_PIPELINE);
	},
};
</script>
<style>
* {
	font-family: Ubuntu, sans-serif;
	/*font-family: 'PT Sans', Ubuntu, sans-serif;*/
}
</style>
