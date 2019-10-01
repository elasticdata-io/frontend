<template>
	<div></div>
</template>
<script>
import Vue from 'vue';
import { LOGOUT } from '../store/user/actions';

export default {
	methods: {
		async exit() {
			await this.$store.dispatch(`user/${LOGOUT}`);
			if (Vue.http && Vue.http.headers && Vue.http.headers.common) {
				delete Vue.http.headers.common['token'];
			}
			this.$router.push({ name: 'login' });
		},
	},
	created() {
		this.exit();
	},
};
</script>
