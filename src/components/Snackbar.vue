<template>
	<v-snackbar v-if="snackMessage" v-model="snackMessage" :timeout="10000">
		<span style="max-width: 500px;word-wrap: break-word">
			{{ snackMessage }}
		</span>
		<v-btn small style="color: #333333" @click="close">
			close
		</v-btn>
	</v-snackbar>
</template>
<script>
import { mapState } from 'vuex';
import { SET_SNACK_MESSAGE } from '../store/mutations';

export default {
	computed: {
		...mapState({
			snackMessage: 'snackMessage',
		}),
	},
	methods: {
		close() {
			this.$store.commit(SET_SNACK_MESSAGE, null);
		},
	},
};
</script>
