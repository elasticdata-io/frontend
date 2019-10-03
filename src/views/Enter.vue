<template>
	<div>Перенаправляємо...</div>
</template>
<script>
import { SET_LOGGED_IN, SET_TOKEN, SET_USER } from '../store/user/mutations';
import { FETCH_CURRENT_USER } from '../store/user/actions';
import { mapGetters } from 'vuex';
import { USER } from '../store/user/getters';
import { SUBSCRIBE_PIPELINE, WEBSOCKET_CONNECT } from '../store/actions';

export default {
	computed: {
		...mapGetters('user', {
			user: USER,
		}),
	},
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
		await this.$store.dispatch(`user/${FETCH_CURRENT_USER}`);
		const userId = this.user && this.user.id;
		if (userId) {
			this.$store.dispatch(WEBSOCKET_CONNECT, { userId });
			this.$store.dispatch(SUBSCRIBE_PIPELINE, { userId });
		}
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
