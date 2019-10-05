<template>
	<v-dialog
		v-model="dialog"
		fullscreen
		hide-overlay
		scrollable
		transition="dialog-bottom-transition"
	>
		<v-card>
			<v-toolbar class="toolbar" dark color="grey darken-3">
				<v-toolbar-title>{{ title }}</v-toolbar-title>
				<div class="flex-grow-1"></div>
				<v-toolbar-items>
					<v-btn icon dark @click="dialog = false">
						<v-icon>close</v-icon>
					</v-btn>
				</v-toolbar-items>
			</v-toolbar>
			<v-card-text class="pt-6">
				<div v-if="!logsLoading" v-html="logs" class="logs"></div>
				<v-progress-linear
					v-if="logsLoading"
					indeterminate
					color="cyan"
				></v-progress-linear>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>
<script>
import { FETCH_TASK_LOGS } from '../store/logs/actions';
import { TASK_LOGS, TASK_LOGS_LOADING } from '../store/logs/getters';
import { mapGetters } from 'vuex';

export default {
	data: () => ({
		dialog: true,
	}),
	computed: {
		...mapGetters('logs', {
			logs: TASK_LOGS,
			logsLoading: TASK_LOGS_LOADING,
		}),
	},
	watch: {
		dialog: function(value) {
			if (!value) {
				this.$emit('closed');
			}
		},
	},
	created() {
		this.$store.dispatch(`logs/${FETCH_TASK_LOGS}`, { taskId: this.taskId });
	},
	methods: {},
	props: {
		taskId: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			default: '',
		},
	},
};
</script>
<style lang="less" scoped>
.toolbar {
	max-height: 64px;
}
.logs {
	font-family: Monaco, 'Ubuntu Mono', monospace;
	font-size: 11px;
	line-height: 18px;
	color: #444;
}
</style>
