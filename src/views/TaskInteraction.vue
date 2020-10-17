<template>
	<v-content class="fill-height" fluid>
		<v-container>
			<v-row align="center" justify="center">
				<v-col md="12">
					<template>
						<v-btn block depressed>
							<task-run-status-button
								:task-id="task.id"
								:status="task.status"
								:failureReason="task.failureReason"
								:docs-count="task.newParseRowsCount"
								:current-execute-command="currentExecuteCommand.commandName"
								:current-execute-command-uuid="currentExecuteCommand.uuid"
								:miniIcon="true"
							></task-run-status-button>
						</v-btn>
						<v-progress-linear
							v-if="isWaiting(task.status)"
							height="2"
							color="red lighten-2"
							buffer-value="0"
							stream
						></v-progress-linear>
						<v-progress-linear
							v-if="isRunningOrQueue(task.status)"
							height="2"
							indeterminate
							color="light-blue"
						></v-progress-linear>
						<v-progress-linear
							v-if="isStopping(task.status)"
							height="2"
							indeterminate
							color="red"
						></v-progress-linear>
					</template>
					<template v-if="userInteractions && !isNotFinished(task.status)">
						<v-row dense>
							<v-col
								v-for="userInteraction in userInteractions"
								:key="userInteraction.id"
								:cols="3"
							>
								<v-card>
									<v-img
										:src="userInteraction.jpegScreenshotLink"
										class="white--text align-end"
										gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
										height="300px"
									>
										<v-card-title
											v-text="userInteraction.currentUrl"
										></v-card-title>
									</v-img>
									<v-card-actions>
										<v-spacer></v-spacer>
										<v-btn
											depressed
											color="primary"
											@click="drawDocument(userInteraction)"
										>
											<v-icon class="mr-2">bug_report</v-icon>
											Виконати дію
										</v-btn>
									</v-card-actions>
								</v-card>
							</v-col>
						</v-row>
					</template>
					<div id="to-element"></div>
				</v-col>
			</v-row>
		</v-container>
	</v-content>
</template>
<script lang="ts">
import { documentUnpack } from 'web-page-teleport';
import { FETCH_USER_INTERACTIONS } from '@/store/user-interaction/actions';
import { mapGetters } from 'vuex';
import { USER_INTERACTIONS } from '@/store/user-interaction/getters';
// eslint-disable-next-line no-unused-vars
import { UserInteraction } from '@/store/user-interaction';
import { TASK, TASK_CURRENT_EXECUTE_COMMAND } from '@/store/task/getters';
import { FETCH_TASK } from '@/store/task/actions';
import TaskRunStatusButton from '@/components/TaskRunStatusButton.vue';
import PipelineStatuses from '@/constants/pipeline-statuses';

export default {
	name: 'TaskInteraction',
	components: {
		TaskRunStatusButton,
	},
	computed: {
		...mapGetters('userInteraction', {
			USER_INTERACTIONS: USER_INTERACTIONS,
		}),
		...mapGetters('task', {
			TASK: TASK,
			TASK_CURRENT_EXECUTE_COMMAND: TASK_CURRENT_EXECUTE_COMMAND,
		}),
		userInteractions(): UserInteraction[] {
			return this.USER_INTERACTIONS || [];
		},
		task(): any {
			return this.TASK || {};
		},
		currentExecuteCommand: function() {
			return this.TASK_CURRENT_EXECUTE_COMMAND;
		},
		currentUserInteraction: function() {
			return this.userInteractions[this.tab];
		},
	},
	data: () => {
		return {
			dialog: true,
			tab: null,
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
		};
	},
	methods: {
		drawDocument(userInteraction) {
			const toEl = document.getElementById('to-element');
			// eslint-disable-next-line no-debugger
			debugger;
			if (toEl) {
				documentUnpack({
					screenshotSrc: userInteraction.jpegScreenshotLink,
					width: userInteraction.pageWidthPx,
					height: userInteraction.pageHeightPx,
					viewElements: userInteraction.pageElements,
					toElement: toEl,
				});
			}
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
	},
	props: {
		taskId: {
			type: String,
			required: true,
		},
	},
	created() {
		this.$store.dispatch(`userInteraction/${FETCH_USER_INTERACTIONS}`, {
			taskId: this.taskId,
		});
		this.$store.dispatch(`task/${FETCH_TASK}`, this.taskId);
	},
};
</script>
<style lang="less" scoped>
.v-card__text {
	padding: 0;
	overflow-x: auto;
}
.page-screenshot {
	margin: 0;
	padding: 10px;
	background-color: #fff;
}
</style>
