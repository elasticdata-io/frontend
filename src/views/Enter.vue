<template>
	<div>Перенаправляємо...</div>
</template>
<script>
import { SET_LOGGED_IN, SET_TOKEN, SET_USER } from '../store/user/mutations';

export default {
	methods: {
		redirectToMain() {
			this.$router.push('/');
		},
		setToken() {
			const query = this.$route.query || {};
			const token = query.token || null;
			this.$store.commit(`user/${SET_TOKEN}`, token);
		},
	},
	async created() {
		this.setToken();
		this.$store.commit(`user/${SET_USER}`, { id: this.userId });
		this.$store.commit(`user/${SET_LOGGED_IN}`, true);
		this.redirectToMain();
	},
	props: {
		userId: {
			type: String,
			required: true,
		},
	},
};
</script>
