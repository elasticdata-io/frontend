<template>
	<v-card-text class="pt-1">
		<v-row>
			<v-col class="pt-0">
				<v-row>
					<v-col>
						<p class="caption">
							Для збору і зберігання унікальних записів потрібно налаштувати правила
							накопичування данних.
						</p>
						<v-btn depressed small @click="setupRules"
							>Налаштувати правила накопичування</v-btn
						>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</v-card-text>
</template>
<script>
import copy from 'copy-to-clipboard';
import { SET_SNACK_MESSAGE } from '../store/mutations';

export default {
	computed: {
		jsonLink: function() {
			const port = location.port ? `:${location.port}` : '';
			return `${location.protocol}//${location.hostname}${port}/api/pipeline/data/${
				this.pipelineId
			}`;
		},
		csvLink: function() {
			return `${location.protocol}//${location.hostname}:${
				location.port
			}/api/pipeline/data/csv/${this.pipelineId}`;
		},
	},
	methods: {
		copyJsonLink() {
			copy(this.jsonLink);
			this.$store.commit(SET_SNACK_MESSAGE, { msg: `Посилання скопійовано в буфер обміну` });
		},
		copyCsvLink() {
			copy(this.csvLink);
			this.$store.commit(SET_SNACK_MESSAGE, { msg: `Посилання скопійовано в буфер обміну` });
		},
		setupRules() {
			const location = `/pipeline/accumulate-data/${this.pipelineId}/setup`;
			this.$router.push(location);
		},
	},
	props: {
		pipelineId: {
			type: String,
			default: '',
		},
	},
};
</script>
