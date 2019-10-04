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
			<span v-if="!loading">
				<span v-if="isRunnablePipeline(status)">
					<v-btn
						v-bind="{ 'x-small': miniIcon, small: !miniIcon }"
						:disabled="disabled"
						depressed
						:loading="pendingToServer"
						fab
						@click="runPipeline()"
					>
						<v-icon>play_arrow</v-icon>
					</v-btn>
				</span>
				<span v-if="!isRunnablePipeline(status)">
					<v-btn
						v-if="status === pipelineIsPending"
						v-bind="{ 'x-small': miniIcon, small: !miniIcon }"
						:disabled="disabled"
						fab
						depressed
					>
						<v-progress-linear color="teal" buffer-value="0" stream></v-progress-linear>
					</v-btn>
					<v-btn
						v-bind="{ 'x-small': miniIcon, small: !miniIcon }"
						:disabled="disabled"
						v-if="status === pipelineIsStopping"
						fab
						depressed
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
						:disabled="disabled"
						v-if="status === pipelineStatusIsMissing"
						depressed
						fab
						@click="runPipeline()"
						:loading="pendingToServer"
					>
						<v-icon>play_arrow</v-icon>
					</v-btn>
				</span>
			</span>
			<small v-if="!loading && !currentExecuteCommand">
				{{ $t(`pipeline.status.${status}`) }}
			</small>
			<small v-if="isRunning && currentExecuteCommand" class="current-execute-command">
				{{ currentExecuteCommand }}
			</small>
		</v-col>
	</v-row>
</template>
<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import ClipLoader from 'vue-spinner/src/ClipLoader.vue';
import PipelineStatuses from '../constants/pipeline-statuses';
import { RUN_PIPELINE, STOP_PIPELINE } from '../store/pipeline/actions';

export default {
	components: {
		PulseLoader,
		ClipLoader,
	},
	data: () => ({
		pipelineIsRunning: PipelineStatuses.RUNNING.title,
		pipelineIsStopping: PipelineStatuses.STOPPING.title,
		pipelineIsPending: PipelineStatuses.PENDING.title,
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

		async runPipeline() {
			this.pendingToServer = true;
			await this.$store.dispatch(`pipeline/${RUN_PIPELINE}`, { pipelineId: this.pipelineId });
			this.pendingToServer = false;
		},

		async stopPipeline() {
			this.pendingToServer = true;
			await this.$store.dispatch(`pipeline/${STOP_PIPELINE}`, {
				pipelineId: this.pipelineId,
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
		status: {
			type: String,
			required: false,
			default: null,
		},
		pipelineId: {
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
</style>
