<template>
	<div class="task-run-status">
		<v-row>
			<v-col class="text-center pb-0" xs="12" sm="12" md="12" lg="12" xl="12">
				<div
					class="text-center"
					v-if="!showCommandName"
					:class="{
						'red--text': pipelineIsError === status,
						'pink--text': pipelineIsStopped === status,
					}"
				>
					{{ $t(`PIPELINE.STATUS.${status}`) }}
				</div>
				<div class="text-center" v-if="showCommandName">
					<div v-if="docsCount" class="text-center docs-count-wrap">
						<span class="docs-count">{{ docsCount }}</span>
					</div>
					<div class="current-execute-command">
						<small v-if="isRunning && currentExecuteCommand">
							<v-icon small :color="`#${executeCommandColor}`"
								>fiber_manual_record</v-icon
							>
							{{ currentExecuteCommand }}
						</small>
					</div>
					<div v-if="commandProps" class="current-execute-command-props text-center">
						<small class="">{{ commandProps }}</small>
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
					<span>{{ failureReasonFormatted }}</span>
				</v-tooltip>
			</v-col>
		</v-row>
	</div>
</template>
<script>
import PipelineStatuses from '../constants/pipeline-statuses';
import { StringColorUtil } from '@/lib/string.color.util';

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
			const string = this.currentExecuteCommandProperties || '';
			if (string.length > 20) {
				return `${string.slice(0, 20)}...`;
			}
			return string;
		},
		failureReasonFormatted: function() {
			const failureReason = this.failureReason || '';
			if (failureReason.length > 200) {
				return `${failureReason.substr(0, 200)}...`;
			}
			return failureReason;
		},
		executeCommandColor: function() {
			return StringColorUtil.toRgb(this.currentExecuteCommandUuid);
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
		currentExecuteCommandUuid: {
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
	.docs-count-wrap {
		padding-bottom: 3px;

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
	}

	.current-execute-command {
		line-height: 12px;
	}

	.current-execute-command-props {
		font-size: 10px;
		line-height: 10px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: inline-block;
		position: relative;
		top: -2px;
	}
}
</style>
