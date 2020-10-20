<template>
	<v-snackbar v-model="snackbar" :timeout="snackTimeout" :color="snackMessageColor">
		<span style="max-width: 800px; word-wrap: break-word;">
			{{ snackMessage }}
		</span>
		<v-btn small @click="close" class="ml-2">
			закрити
		</v-btn>
	</v-snackbar>
</template>
<script>
import { mapGetters } from 'vuex';
import { SET_SNACK_MESSAGE } from '../store/mutations';
import { SNACK_MESSAGE, SNACK_MESSAGE_COLOR, SNACK_TIMEOUT } from '../store/getters';

export default {
	computed: {
		...mapGetters({
			snackMessage: SNACK_MESSAGE,
			snackMessageColor: SNACK_MESSAGE_COLOR,
			snackTimeout: SNACK_TIMEOUT,
		}),
		snackbar: {
			get() {
				return Boolean(this.snackMessage);
			},
			set() {
				this.$store.commit(SET_SNACK_MESSAGE, { msg: '' });
			},
		},
	},
	methods: {
		close() {
			this.$store.commit(SET_SNACK_MESSAGE, { msg: '' });
		},
	},
};
</script>
