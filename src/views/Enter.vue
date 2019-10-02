<template>
	<div>Перенаправляємо...</div>
</template>
<script>
import { SET_LOGGED_IN, SET_TOKEN, SET_USER } from '../store/user/mutations';
import { FETCH_CURRENT_USER } from '../store/user/actions';

export default {
	methods: {
		redirectToMain() {
			this.$router.push('/');
		},
		getToken() {
			const query = this.$route.query || {};
			const token = query.token || null;
			return token;
		},
	},
	async created() {
		const token = this.getToken();
		this.$store.commit(`user/${SET_TOKEN}`, token);
		this.$store.commit(`user/${SET_USER}`, { id: this.userId });
		this.$store.commit(`user/${SET_LOGGED_IN}`, true);
		this.$store.dispatch(`user/${FETCH_CURRENT_USER}`);
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
