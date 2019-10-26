<template>
	<v-row>
		<v-col class="text-justify">
			<v-btn
				v-if="loading"
				v-bind="{ 'x-small': miniIcon, small: !miniIcon }"
				:disabled="true"
				depressed
				:loading="true"
				fab
			></v-btn>
			<div v-if="!loading" class="text-center">
				<div v-if="isRunnablePipeline(status)">
					<v-tooltip left v-if="status === pipelineIsError">
						<template v-slot:activator="{ on }">
							<v-icon small color="pink" v-on="on">
								error
							</v-icon>
						</template>
						<span>{{ failureReason }}</span>
					</v-tooltip>
				</div>
				<div v-if="!isRunnablePipeline(status)">
					<v-btn
						v-if="status === pipelineIsPending"
						v-bind="{ 'x-small': miniIcon, small: !miniIcon }"
						:disabled="disabled"
						fab
						depressed
						class="pa-1"
					>
						<v-progress-linear color="teal" buffer-value="0" stream></v-progress-linear>
					</v-btn>
					<v-btn
						v-bind="{ 'x-small': miniIcon, small: !miniIcon }"
						:disabled="disabled"
						v-if="status === pipelineIsStopping"
						fab
						depressed
						class="pa-1"
					>
						<v-progress-linear
							color="red lighten-2"
							buffer-value="0"
							stream
						></v-progress-linear>
					</v-btn>
					<v-btn
						v-bind="{ 'x-small': miniIcon, small: !miniIcon }"
						:disabled="disabled"
						v-if="status === pipelineIsRunning"
						fab
						depressed
						@click="stopPipeline()"
						:loading="pendingToServer"
					>
						<v-progress-circular
							:size="16"
							:width="2"
							indeterminate
							color="teal"
						></v-progress-circular>
					</v-btn>
					<v-btn
						v-bind="{ 'x-small': miniIcon, small: !miniIcon }"
						:disabled="true"
						v-if="status === pipelineStatusIsMissing"
						depressed
						fab
						:loading="pendingToServer"
					>
						<v-icon>not_interested</v-icon>
					</v-btn>
					<v-btn
						v-bind="{ 'x-small': miniIcon, small: !miniIcon }"
						:disabled="true"
						v-if="status === pipelineIsWaiting"
						depressed
						fab
						:loading="pendingToServer"
					>
						<v-progress-linear
							color="primary"
							buffer-value="0"
							stream
						></v-progress-linear>
					</v-btn>
				</div>
			</div>
			<div
				class="text-center"
				v-if="!loading && !currentExecuteCommand"
				:class="{
					'red--text': pipelineIsError === status,
					'pink--text': pipelineIsStopped === status,
				}"
			>
				{{ $t(`pipeline.status.${status}`) }}
			</div>
			<small v-if="isRunning && currentExecuteCommand" class="current-execute-command">
				{{ currentExecuteCommand }}
			</small>
			<small v-if="isRunning && newParseRowsCount" class="current-parsed-rows-count">
				{{ newParseRowsCount }} docs
			</small>
			<div class="current-execute-command-properties">
				<small>{{ currentExecuteCommandProperties }}</small>
			</div>
		</v-col>
	</v-row>
</template>
<script>
import PipelineStatuses from '../constants/pipeline-statuses';
import { RUN_PIPELINE, STOP_PIPELINE } from '../store/pipeline/actions';
import { STOP_PIPELINE_TASK } from '../store/tasks/actions';

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
	methods: {
		isRunning() {
			return this.status === PipelineStatuses.RUNNING.title;
		},
		isRunnablePipeline(status) {
			const pipelineStatus = status || '';
			const statuses = Object.values(PipelineStatuses);
			return statuses.filter(s => s.runnable && s.title === pipelineStatus).length > 0;
		},

		async stopPipeline() {
			this.pendingToServer = true;
			await this.$store.dispatch(`tasks/${STOP_PIPELINE_TASK}`, {
				taskId: this.taskId,
			});
			this.pendingToServer = false;
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
		newParseRowsCount: {
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
.current-execute-command {
	font-weight: bold;
	letter-spacing: 0.08em;
}
.current-execute-command-properties {
	text-align: left;
	line-height: 1em;
}
</style>
