<template>
	<div class="task-run-status">
		<v-row>
			<v-col class="text-center pb-0" xs="12" sm="12" md="12" lg="12" xl="12">
				<div v-if="docsCount" class="text-center">
					<span class="docs-count">{{ docsCount }}</span>
				</div>
				<div
					class="text-center"
					v-if="!showCommandName"
					:class="{
						'red--text': pipelineIsError === status,
						'pink--text': pipelineIsStopped === status,
					}"
				>
					{{ $t(`pipeline.status.${status}`) }}
				</div>
				<div class="text-center">
					<div v-if="showCommandName">
						<small
							v-if="isRunning && currentExecuteCommand"
							class="current-execute-command"
						>
							{{ currentExecuteCommand }}
						</small>
					</div>
					<div v-if="commandProps" class="text-center">
						<small class="current-execute-command-props">{{ commandProps }}</small>
					</div>
				</div>
			</v-col>
			<v-col class="text-center pt-0" xs="12" sm="12" md="12" lg="12" xl="12">
				<v-tooltip left v-if="status === pipelineIsError">
					<template v-slot:activator="{ on }">
						<v-icon small color="pink" v-on="on">
							error
						</v-icon>
					</template>
					<span>{{ failureReason }}</span>
				</v-tooltip>
			</v-col>
		</v-row>
	</div>
</template>
<script>
import PipelineStatuses from '../constants/pipeline-statuses';

export default {
	components: {},
	data: () => ({
		pipelineIsRunning: PipelineStatuses.RUNNING.title,
		pipelineIsError: PipelineStatuses.ERROR.title,
		pipelineIsStopping: PipelineStatuses.STOPPING.title,
		pipelineIsStopped: PipelineStatuses.STOPPED.title,
		pipelineIsPending: PipelineStatuses.PENDING.title,
		pipelineIsCompleted: PipelineStatuses.COMPLETED.title,
		pipelineIsWaiting: PipelineStatuses.WAIT_OTHER_PIPELINE.title,
		pipelineStatusIsMissing: null,
		pendingToServer: false,
	}),
	computed: {
		isRunning() {
			return this.status === PipelineStatuses.RUNNING.title;
		},
		showCommandName: function() {
			return this.isRunning && this.currentExecuteCommand;
		},
		commandProps: function() {
			if (!this.isRunning || !this.currentExecuteCommand) {
				return '';
			}
			return this.currentExecuteCommandProperties || '';
		},
	},
	methods: {
		isRunnablePipeline(status) {
			const pipelineStatus = status || '';
			const statuses = Object.values(PipelineStatuses);
			return statuses.filter(s => s.runnable && s.title === pipelineStatus).length > 0;
		},
	},
	props: {
		currentExecuteCommand: {
			type: String,
			required: false,
			default: null,
		},
		currentExecuteCommandProperties: {
			type: String,
			required: false,
			default: null,
		},
		docsCount: {
			type: Number,
			required: false,
			default: null,
		},
		status: {
			type: String,
			required: false,
			default: null,
		},
		failureReason: {
			type: String,
			required: false,
			default: null,
		},
		taskId: {
			type: String,
			required: false,
			default: '',
		},
		loading: {
			type: Boolean,
			required: false,
			default: false,
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false,
		},
		miniIcon: {
			type: Boolean,
			required: false,
			default: true,
		},
	},
};
</script>
<style lang="less">
.task-run-status {
	.docs-count {
		display: inline-block;
		background-color: #f5f5f5;
		color: rgba(0, 0, 0, 0.87);
		width: 22px;
		height: 22px;
		-webkit-border-radius: 11px;
		-moz-border-radius: 11px;
		border-radius: 11px;
		padding-top: 1px;
		font-size: 9px;
		font-weight: bold;
	}

	.current-execute-command-props {
		font-size: 8px;
		line-height: 8px;
		width: 50px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: inline-block;
	}
}
</style>
