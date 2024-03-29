<template>
	<div class="tasks-mini">
		<pipeline-task-logs
			v-if="selectedTaskId"
			@closed="selectedTaskId = null"
			:title="selectedPipelineTitle"
			:task-id="selectedTaskId"
		></pipeline-task-logs>
		<div v-if="false" class="subtitle-2">
			Запущено {{ tasksAtWork && tasksAtWork.length }}/{{
				tasksPending.length + tasksAtWork.length
			}}
			задач
			<v-btn small depressed disabled>Збільшити кількість воркерів</v-btn>
		</div>
		<v-row align="center">
			<v-col xs="3" sm="3" md="3" lg="3" xl="3">
				<small>Статус</small>
			</v-col>
			<v-col>
				<small>Тривалість</small>
			</v-col>
			<v-col>
				<small>Завершено</small>
			</v-col>
			<v-col xs="2" sm="2" md="2" lg="2" xl="2">
				<small>Дії</small>
			</v-col>
		</v-row>
		<v-divider></v-divider>
		<div
			class="task-row"
			:class="{
				'pink--text': task.failureReason,
				'interaction-mode-blink': isNotFinished(task.status) && task.hasUserInteraction,
			}"
			v-for="task in tasks"
			:key="task.id"
		>
			<v-row align="center">
				<v-col class="text-left" xs="3" sm="3" md="3" lg="3" xl="3">
					<task-run-status-button
						:task-id="task.id"
						:status="task.status"
						:failureReason="task.failureReason"
						:docs-count="task.newParseRowsCount"
						:current-execute-command="task.currentExecuteCommand"
						:current-execute-command-uuid="task.currentExecuteCommandUuid"
						:current-execute-command-properties="task.currentExecuteCommandProperties"
						:miniIcon="true"
					></task-run-status-button>
				</v-col>
				<v-col class="text-center" xs="3" sm="3" md="3" lg="3" xl="3">
					<small>{{ startedOn(task.startOnUtc) }}</small>
					<v-divider></v-divider>
					{{ duration(task) }}
				</v-col>
				<v-col class="text-right" xs="3" sm="3" md="3" lg="3" xl="3">{{
					fromNow(task.endOnUtc)
				}}</v-col>
				<v-col class="text-left" xs="2" sm="2" md="2" lg="2" xl="2">
					<v-menu offset-y>
						<template v-slot:activator="{ on }">
							<v-badge
								v-if="isNotFinished(task.status) && task.hasUserInteraction"
								bordered
								color="error"
								icon="bug_report"
								overlap
							>
								<v-btn depressed text v-on="on">
									<v-icon>more_vert</v-icon>
								</v-btn>
							</v-badge>
							<v-btn v-else depressed text v-on="on">
								<v-icon>more_vert</v-icon>
							</v-btn>
						</template>
						<v-list>
							<v-list-item
								:href="task.docsUrl"
								:disabled="!task.docsUrl"
								target="_blank"
							>
								<v-list-item-title>
									<v-icon :disabled="!task.docsUrl" class="pr-2">get_app</v-icon>
									скачати json
								</v-list-item-title>
							</v-list-item>
							<v-list-item
								v-if="isNotFinished(task.status)"
								@click="stopPipeline(task)"
							>
								<v-list-item-title>
									<v-icon class="pr-2" color="secondary">stop</v-icon>
									зупинити
								</v-list-item-title>
							</v-list-item>
							<v-list-item
								v-if="showTaskDetailsLink(task)"
								:to="{ name: 'task', params: { taskId: task.id } }"
							>
								<v-list-item-title>
									<v-icon class="pr-2">assignment</v-icon>
									детально
								</v-list-item-title>
							</v-list-item>
							<v-list-item
								class="interaction-mode"
								v-if="isNotFinished(task.status) && task.hasUserInteraction"
								:to="{ name: 'task-interaction', params: { taskId: task.id } }"
							>
								<v-list-item-title>
									<v-icon class="pr-2">bug_report</v-icon>
									інтерактивний режим
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
				v-if="isRunningOrQueue(task.status)"
				height="1"
				indeterminate
				color="light-blue"
			></v-progress-linear>
			<v-progress-linear
				v-if="isStopping(task.status)"
				height="2"
				indeterminate
				color="red"
			></v-progress-linear>
			<v-divider></v-divider>
		</div>
		<v-divider></v-divider>
		<v-btn v-if="hasNextPage" block depressed @click="loadMore">Показати ще</v-btn>
	</div>
</template>
<script>
import * as moment from 'moment';
import PipelineTaskLogs from './PipelineTaskLogs';
import TaskRunStatusButton from './TaskRunStatusButton';
import PipelineStatuses from '../constants/pipeline-statuses';
import { FETCH_TASKS, LOAD_MORE_TASKS, STOP_PIPELINE_TASK } from '../store/tasks/actions';
import { mapGetters } from 'vuex';
import {
	TASKS_AT_WORK,
	TASKS_BY_PIPELINE,
	TASKS_HAS_NEXT_PAGE,
	TASKS_PENDING,
} from '../store/tasks/getters';

export default {
	components: { PipelineTaskLogs, TaskRunStatusButton },
	data() {
		return {
			taskIsRunning: PipelineStatuses.RUNNING.title,
			taskIsNeedRun: PipelineStatuses.NEED_RUN.title,
			taskIsQueue: PipelineStatuses.QUEUE.title,
			taskIsError: PipelineStatuses.ERROR.title,
			taskIsStopping: PipelineStatuses.STOPPING.title,
			taskIsStopped: PipelineStatuses.STOPPED.title,
			taskIsPending: PipelineStatuses.PENDING.title,
			taskIsCompleted: PipelineStatuses.COMPLETED.title,
			taskIsWaiting: PipelineStatuses.WAIT_OTHER_PIPELINE.title,
			taskIsNeedOther: PipelineStatuses.NEED_OTHER_PIPELINE.title,
			selectedPipelineTitle: null,
			selectedTaskId: null,
			now: new Date(),
			interval: null,
		};
	},
	computed: {
		...mapGetters('tasks', {
			tasksAtWork: TASKS_AT_WORK,
			tasksPending: TASKS_PENDING,
			tasksByPipeline: TASKS_BY_PIPELINE,
			hasNextPage: TASKS_HAS_NEXT_PAGE,
		}),
		tasks: function() {
			return this.tasksByPipeline(this.pipelineId);
		},
	},
	methods: {
		showTaskDetailsLink: function(task) {
			return this.isFinished(task.status);
		},
		startedOn(time) {
			const startOn = moment.utc(time);
			const format = 'HH:mm:ss';
			return startOn.format(format);
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
			return (
				status === this.taskIsPending ||
				status === this.taskIsWaiting ||
				status === this.taskIsNeedRun ||
				status === this.taskIsNeedOther
			);
		},
		isNotFinished(status) {
			return (
				status !== this.taskIsError &&
				status !== this.taskIsCompleted &&
				status !== this.taskIsStopped
			);
		},
		isFinished(status) {
			return !this.isNotFinished(status);
		},
		isRunning(status) {
			return status === this.taskIsRunning;
		},
		isRunningOrQueue(status) {
			return status === this.taskIsRunning || status === this.taskIsQueue;
		},
		isStopping(status) {
			return status === this.taskIsStopping;
		},
		stopPipeline(task) {
			this.$store.dispatch(`tasks/${STOP_PIPELINE_TASK}`, {
				taskId: task.id,
			});
		},
		loadTasks() {
			this.$store.dispatch(`tasks/${FETCH_TASKS}`, { pipelineId: this.pipelineId });
		},
		loadMore() {
			this.$store.dispatch(`tasks/${LOAD_MORE_TASKS}`, { pipelineId: this.pipelineId });
		},
	},
	props: {
		disabled: {
			type: Boolean,
			default: false,
			required: false,
		},
		pipelineId: {
			type: String,
			default: '',
			required: false,
		},
		pipelineKey: {
			type: String,
			default: '',
			required: false,
		},
	},
	created() {
		this.interval = setInterval(() => (this.now = new Date()), 1000);
		this.loadTasks();
	},
	destroyed() {
		clearInterval(this.interval);
	},
};
</script>
<style lang="less">
@interactionModeColor: rgba(255, 150, 186, 0.3);

.tasks-mini {
	&.v-data-table td {
		font-size: 0.8em;
	}

	.task-row {
		font-size: 12px;
	}

	.interaction-mode-blink {
		animation: blinkingBackground 3s infinite;
	}

	@keyframes blinkingBackground {
		0% {
			background-color: @interactionModeColor;
		}
		100% {
			background-color: #ffffff;
		}
	}
}
.interaction-mode {
	background-color: @interactionModeColor;
}
</style>
