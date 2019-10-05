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
				<v-btn icon dark @click="dialog = false">
					<v-icon>keyboard_backspace</v-icon>
				</v-btn>
				<v-toolbar-title
					>павук: "{{ title }}", запуск - "{{ task.startOn }} -
					{{ task.endOn }}"</v-toolbar-title
				>
				<div class="flex-grow-1"></div>
				<v-toolbar-items>
					<v-btn icon dark @click="dialog = false">
						<v-icon>close</v-icon>
					</v-btn>
				</v-toolbar-items>
			</v-toolbar>
			<v-card-text class="pt-6 black">
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
import { TASK_BY_ID } from '../store/tasks/getters';

export default {
	data: () => ({
		dialog: true,
	}),
	computed: {
		...mapGetters('logs', {
			logs: TASK_LOGS,
			logsLoading: TASK_LOGS_LOADING,
		}),
		...mapGetters('tasks', {
			taskById: TASK_BY_ID,
		}),
		task: function() {
			return this.taskById(this.taskId);
		},
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
<style lang="less">
.toolbar {
	max-height: 64px;
}

.logs {
	letter-spacing: -0.02em;
	padding: 19px 19px 19px 27px;
	background: #000;
	color: #ccc;

	span {
		display: block;
		width: 100%;
		padding-top: 0.5em;
		padding-left: 15px;
		position: relative;
		font: 13px/16px Monaco, Menlo, Consolas, Monaco, Lucida Console, Liberation Mono,
			DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
		font-weight: bold;

		&::selection {
			background-color: #ff5252;
			color: #fff;
		}

		&:before {
			content: '.';
			position: absolute;
			top: 50%;
			left: 0;
			transform: translateY(-50%);
		}
	}
}
</style>
