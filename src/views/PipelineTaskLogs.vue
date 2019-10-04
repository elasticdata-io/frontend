<template>
	<v-content>
		<v-container class="fill-height" fluid>
			<v-row align="center" justify="center">
				<v-col sm="12">
					<v-card>
						<v-card-text>
							<div v-html="logs" class="logs"></div>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-content>
</template>
<script>
import { FETCH_TASK_LOGS } from '../store/logs/actions';
import { TASK_LOGS } from '../store/logs/getters';
import { mapGetters } from 'vuex';

export default {
	computed: {
		...mapGetters('logs', {
			logs: TASK_LOGS,
		}),
	},
	created() {
		this.$store.dispatch(`logs/${FETCH_TASK_LOGS}`, { taskId: this.taskId });
	},
	props: {
		taskId: {
			type: String,
			required: true,
		},
	},
};
</script>
<style lang="less" scoped>
.logs {
	font-family: Monaco, 'Ubuntu Mono', monospace;
	font-size: 11px;
	line-height: 18px;
	color: #444;
}
</style>
