<template>
	<v-layout>
		<v-flex class="text-justify">
			<span v-if="pipeline.loading">
				<v-btn>
					<pulse-loader size="2px" color="#002884" />
				</v-btn>
			</span>
			<span v-if="!pipeline.loading">
				<span v-if="isRunnablePipeline(pipeline)">
					<v-btn x-small depressed fab @click="runPipeline(pipeline)">
						<v-icon>play_arrow</v-icon>
					</v-btn>
				</span>
				<span v-if="!isRunnablePipeline(pipeline)">
					<v-btn v-if="pipeline.status.title === pipelineIsPending" x-small text>
						<pulse-loader size="2px" color="#002884" />
					</v-btn>
					<v-btn v-if="pipeline.status.title === pipelineIsStopping" x-small text>
						<pulse-loader size="2px" color="#eb3875" />
					</v-btn>
					<v-btn
						v-if="pipeline.status.title === pipelineIsRunning"
						x-small
						text
						@click="stopPipeline(pipeline)"
					>
						<clip-loader size="16px" color="#797979" />
					</v-btn>
					<v-btn
						v-if="pipeline.status.title === pipelineStatusIsMissing"
						x-small
						depressed
						fab
						@click="runPipeline(pipeline)"
					>
						<v-icon>play_arrow</v-icon>
					</v-btn>
				</span>
			</span>
			<small>
				{{ pipeline.status.title }}
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
		isRunnablePipeline(pipeline) {
			const status = pipeline.status.title || '';
			const statuses = Object.values(PipelineStatuses);
			return statuses.filter(s => s.runnable && s.title === status).length > 0;
		},

		runPipeline: function(pipeline) {
			const token = this.$localStorage.get('token');
			//this.$store.dispatch(`pipelines/${RUN_PIPELINE}`, {token, pipeline});
		},

		stopPipeline: function(pipeline) {
			const token = this.$localStorage.get('token');
			//this.$store.dispatch(`pipelines/${STOP_PIPELINE}`, {token, pipeline});
		},
	},
	props: {
		pipeline: {
			type: Object,
			required: true,
		},
	},
};
</script>
