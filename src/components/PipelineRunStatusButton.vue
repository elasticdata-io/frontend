<template>
	<v-row>
		<v-col class="text-justify">
			<v-progress-linear
				v-if="loading"
				color="red lighten-2"
				buffer-value="0"
				stream
			></v-progress-linear>
			<span v-if="!loading">
				<span v-if="isRunnablePipeline(status)">
					<v-btn
						v-bind="{ 'x-small': miniIcon, small: !miniIcon }"
						:disabled="disabled"
						depressed
						fab
						@click="runPipeline()"
					>
						<v-icon>play_arrow</v-icon>
					</v-btn>
				</span>
				<span v-if="!isRunnablePipeline(status)">
					<v-btn
						v-bind="{ 'x-small': miniIcon, small: !miniIcon }"
						:disabled="disabled"
						v-if="status === pipelineIsPending"
						text
					>
						<pulse-loader size="2px" color="#002884" />
					</v-btn>
					<v-btn
						v-bind="{ 'x-small': miniIcon, small: !miniIcon }"
						:disabled="disabled"
						v-if="status === pipelineIsStopping"
						text
					>
						<pulse-loader size="2px" color="#eb3875" />
					</v-btn>
					<v-btn
						v-bind="{ 'x-small': miniIcon, small: !miniIcon }"
						:disabled="disabled"
						v-if="status === pipelineIsRunning"
						text
						@click="stopPipeline()"
					>
						<clip-loader size="16px" color="#797979" />
					</v-btn>
					<v-btn
						v-bind="{ 'x-small': miniIcon, small: !miniIcon }"
						:disabled="disabled"
						v-if="status === pipelineStatusIsMissing"
						depressed
						fab
						@click="runPipeline()"
					>
						<v-icon>play_arrow</v-icon>
					</v-btn>
				</span>
			</span>
			<small v-if="!loading">
				{{ $t(`pipeline.status.${status}`) }}
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
	}),
	methods: {
		isRunnablePipeline(status) {
			const pipelineStatus = status || '';
			const statuses = Object.values(PipelineStatuses);
			return statuses.filter(s => s.runnable && s.title === pipelineStatus).length > 0;
		},

		runPipeline: function() {
			this.$store.dispatch(`pipeline/${RUN_PIPELINE}`, { pipelineId: this.pipelineId });
		},

		stopPipeline: function() {
			this.$store.dispatch(`pipeline/${STOP_PIPELINE}`, { pipelineId: this.pipelineId });
		},
	},
	props: {
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
