<template>
	<div class="tasks-mini">
		<pipeline-task-logs
			v-if="selectedTaskId"
			@closed="selectedTaskId = null"
			:title="selectedPipelineTitle"
			:task-id="selectedTaskId"
		></pipeline-task-logs>
		<div class="subtitle-2">
			В роботі 0/4 воркерів
			<v-btn small depressed disabled>Збільшити кількість воркерів</v-btn>
		</div>
		<v-row>
			<v-col>Статус</v-col>
			<v-col>Тривалість</v-col>
			<v-col>Завершено</v-col>
			<v-col>Дії</v-col>
		</v-row>
		<v-divider></v-divider>
		<div
			class="task-row"
			:class="{ 'pink--text': task.failureReason }"
			v-for="task in tasks"
			:key="task.id"
		>
			<v-row align="center">
				<v-col class="text-justify">
					<task-run-status-button
						:task-id="task.id"
						:status="task.status"
						:failureReason="task.failureReason"
						:docs-count="task.newParseRowsCount"
						:current-execute-command="task.currentExecuteCommand"
						:current-execute-command-properties="task.currentExecuteCommandProperties"
						:miniIcon="true"
					></task-run-status-button>
				</v-col>
				<v-col class="text-justify">{{ duration(task) }}</v-col>
				<v-col class="text-justify">{{ fromNow(task.endOnUtc) }}</v-col>
				<v-col class="text-justify">
					<v-menu offset-y>
						<template v-slot:activator="{ on }">
							<v-btn depressed text v-on="on">
								<v-icon>more_vert</v-icon>
							</v-btn>
						</template>
						<v-list>
							<v-list-item
								:href="'/api/pipeline-task/data/' + task.id"
								target="_blank"
							>
								<v-list-item-title>
									<v-icon class="pr-2">get_app</v-icon>
									скачати json
								</v-list-item-title>
							</v-list-item>
							<v-list-item @click="viewLogs(task)">
								<v-list-item-title>
									<v-icon class="pr-2">bug_report</v-icon>
									переглянути логи
								</v-list-item-title>
							</v-list-item>
							<v-list-item v-if="isRunning(task.status)" @click="stopPipeline(task)">
								<v-list-item-title>
									<v-icon class="pr-2" color="secondary">stop</v-icon>
									зупинити
								</v-list-item-title>
							</v-list-item>
						</v-list>
					</v-menu>
				</v-col>
			</v-row>
			<v-progress-linear
				v-if="isWaiting(task.status)"
				height="2"
				color="red lighten-2"
				buffer-value="0"
				stream
			></v-progress-linear>
			<v-progress-linear
				v-if="isRunning(task.status)"
				height="2"
				indeterminate
				color="green"
			></v-progress-linear>
			<v-progress-linear
				v-if="isStopping(task.status)"
				height="2"
				indeterminate
				color="red"
			></v-progress-linear>
			<v-divider></v-divider>
		</div>
	</div>
</template>
<script>
import * as moment from 'moment';
import PipelineTaskLogs from './PipelineTaskLogs';
import TaskRunStatusButton from './TaskRunStatusButton';
import PipelineStatuses from '../constants/pipeline-statuses';
import { STOP_PIPELINE_TASK } from '../store/tasks/actions';

export default {
	components: { PipelineTaskLogs, TaskRunStatusButton },
	data() {
		return {
			taskIsRunning: PipelineStatuses.RUNNING.title,
			taskIsError: PipelineStatuses.ERROR.title,
			taskIsStopping: PipelineStatuses.STOPPING.title,
			taskIsStopped: PipelineStatuses.STOPPED.title,
			taskIsPending: PipelineStatuses.PENDING.title,
			taskIsCompleted: PipelineStatuses.COMPLETED.title,
			taskIsWaiting: PipelineStatuses.WAIT_OTHER_PIPELINE.title,
			selectedPipelineTitle: null,
			selectedTaskId: null,
			now: new Date(),
			interval: null,
		};
	},
	methods: {
		viewLogs(task) {
			this.selectedTaskId = task.id;
			this.selectedPipelineTitle = task.pipeline.key;
		},
		fromNow(date) {
			if (!date) {
				return '-';
			}
			return moment.utc(date).fromNow();
		},
		duration: function(task) {
			if (!task.startOnUtc) {
				return 'невідомо';
			}
			const startOn = moment.utc(task.startOnUtc);
			const endOn = moment.utc(task.endOnUtc || this.now);
			const diff = endOn.diff(startOn);
			if (diff < 0) {
				return '';
			}
			let format = 'mm:ss';
			const diffHour = diff / 1000 / 60 / 60;
			if (diffHour >= 1) {
				format = 'HH:mm:ss';
			}
			return moment.utc(diff).format(format);
		},
		reload() {
			this.$emit('reload');
		},
		isWaiting(status) {
			return status === this.taskIsPending || status === this.taskIsWaiting;
		},
		isRunning(status) {
			return status === this.taskIsRunning;
		},
		isStopping(status) {
			return status === this.taskIsStopping;
		},
		stopPipeline(task) {
			this.$store.dispatch(`tasks/${STOP_PIPELINE_TASK}`, {
				taskId: task.id,
			});
		},
	},
	props: {
		tasks: {
			type: Array,
			default: () => [],
			required: false,
		},
		disabled: {
			type: Boolean,
			default: false,
			required: false,
		},
	},
	created() {
		this.interval = setInterval(() => (this.now = new Date()), 1000);
	},
	destroyed() {
		clearInterval(this.interval);
	},
};
</script>
<style lang="less">
.tasks-mini {
	&.v-data-table td {
		font-size: 0.8em;
	}

	.task-row {
		font-size: 12px;
	}
}
</style>
