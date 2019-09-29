<template>
	<v-row>
		<v-col class="text-justify">
			<span v-if="loading">
				<v-btn :disabled="disabled">
					<pulse-loader size="2px" color="#002884" />
				</v-btn>
			</span>
			<span v-if="!loading">
				<span v-if="isRunnablePipeline(status)">
					<v-btn :disabled="disabled" x-small depressed fab @click="runPipeline()">
						<v-icon>play_arrow</v-icon>
					</v-btn>
				</span>
				<span v-if="!isRunnablePipeline(status)">
					<v-btn :disabled="disabled" v-if="status === pipelineIsPending" x-small text>
						<pulse-loader size="2px" color="#002884" />
					</v-btn>
					<v-btn :disabled="disabled" v-if="status === pipelineIsStopping" x-small text>
						<pulse-loader size="2px" color="#eb3875" />
					</v-btn>
					<v-btn
						:disabled="disabled"
						v-if="status === pipelineIsRunning"
						x-small
						text
						@click="stopPipeline()"
					>
						<clip-loader size="16px" color="#797979" />
					</v-btn>
					<v-btn
						:disabled="disabled"
						v-if="status === pipelineStatusIsMissing"
						x-small
						depressed
						fab
						@click="runPipeline()"
					>
						<v-icon>play_arrow</v-icon>
					</v-btn>
				</span>
			</span>
			<small>
				{{ status }}
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
			default: PipelineStatuses.NOT_RUNNING.title,
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
	},
};
</script>
