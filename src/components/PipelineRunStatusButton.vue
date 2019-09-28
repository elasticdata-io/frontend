<template>
	<v-layout>
		<v-flex class="text-justify">
			<span v-if="loading">
				<v-btn :disabled="disabled">
					<pulse-loader size="2px" color="#002884" />
				</v-btn>
			</span>
			<span v-if="!loading">
				<span v-if="isRunnablePipeline(status)">
					<v-btn
						:disabled="disabled"
						x-small
						depressed
						fab
						@click="runPipeline(pipelineId)"
					>
						<v-icon>play_arrow</v-icon>
					</v-btn>
				</span>
				<span v-if="!isRunnablePipeline(status)">
					<v-btn
						:disabled="disabled"
						v-if="status.title === pipelineIsPending"
						x-small
						text
					>
						<pulse-loader size="2px" color="#002884" />
					</v-btn>
					<v-btn
						:disabled="disabled"
						v-if="status.title === pipelineIsStopping"
						x-small
						text
					>
						<pulse-loader size="2px" color="#eb3875" />
					</v-btn>
					<v-btn
						:disabled="disabled"
						v-if="status.title === pipelineIsRunning"
						x-small
						text
						@click="stopPipeline(pipelineId)"
					>
						<clip-loader size="16px" color="#797979" />
					</v-btn>
					<v-btn
						:disabled="disabled"
						v-if="status.title === pipelineStatusIsMissing"
						x-small
						depressed
						fab
						@click="runPipeline(pipelineId)"
					>
						<v-icon>play_arrow</v-icon>
					</v-btn>
				</span>
			</span>
			<small>
				{{ status.title }}
			</small>
		</v-flex>
	</v-layout>
</template>
<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import ClipLoader from 'vue-spinner/src/ClipLoader.vue';
import PipelineStatuses from '../constants/pipeline-statuses';

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
			const pipelineStatus = status.title || '';
			const statuses = Object.values(PipelineStatuses);
			return statuses.filter(s => s.runnable && s.title === pipelineStatus).length > 0;
		},

		runPipeline: function(pipelineId) {
			const token = this.$localStorage.get('token');
			//this.$store.dispatch(`pipelines/${RUN_PIPELINE}`, {token, pipeline});
		},

		stopPipeline: function(pipelineId) {
			const token = this.$localStorage.get('token');
			//this.$store.dispatch(`pipelines/${STOP_PIPELINE}`, {token, pipeline});
		},
	},
	props: {
		status: {
			type: Object,
			required: false,
			default: () => ({
				title: PipelineStatuses.NOT_RUNNING.title,
			}),
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
