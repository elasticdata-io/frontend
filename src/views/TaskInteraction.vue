<template>
	<v-content style="height: 100%;">
		<v-container>
			<v-row>
				<v-col md="12">
					<v-toolbar elevation="0">
						<v-btn depressed small @click="back()">
							<v-icon class="mr-2">keyboard_backspace</v-icon>
							назад
						</v-btn>
						<v-toolbar-title class="ml-3">{{ pipeline.key }}</v-toolbar-title>
						<v-spacer></v-spacer>
						<task-status-button
							:status="task.status"
							:failure-reason="task.failureReason"
							class="mr-5"
							style="width: 300px"
						></task-status-button>
						<stop-task-button
							:status="task.status"
							:task-id="task.id"
						></stop-task-button>
					</v-toolbar>
				</v-col>
				<v-col v-if="showFinished" md="12" class="text-center mt-7">
					Ця задача <strong>завершена</strong>. <br />Для докладного аналізу натісніть на
					кнопку:
					<br />
					<br />
					<router-link :to="{ name: 'task', params: { id: task.id } }" tag="span">
						<v-btn color="primary" depressed>аналізувати задачу</v-btn>
					</router-link>
				</v-col>
				<v-col v-if="showNeedWaiting" md="12" class="text-center mt-7">
					Зачекайте, будь ласка...<br />
					Якщо павук буде зупинено, на сторінці буде відображена інформація про
					необхідніть Вашого втручання.
					<v-progress-linear
						height="2"
						indeterminate
						color="light-blue"
					></v-progress-linear>
				</v-col>
				<v-col
					v-for="(userInteraction, index) in userInteractions"
					:key="userInteraction.id"
					md="4"
				>
					<v-card v-if="showInteractionTabs">
						<v-toolbar elevation="0">
							<v-toolbar-title>Вкладка №{{ index + 1 }}</v-toolbar-title>
							<v-spacer></v-spacer>
							<v-btn text>
								<v-icon class="mr-2">history</v-icon>
								00:14:23
							</v-btn>
						</v-toolbar>
						<v-card-text class="pt-0">
							<v-row no-gutters>
								<v-col md="12">
									<v-card>
										<v-img
											:src="userInteraction.jpegScreenshotLink"
											class="align-center white--text"
											gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
											height="350px"
										>
											<v-card-title class="justify-center">
												<v-badge
													bordered
													color="error"
													icon="pause arrow_back"
													overlap
												>
													<v-btn
														class="white--text"
														color="error"
														depressed
														>{{ userInteraction.currentUrl }}</v-btn
													>
												</v-badge>
											</v-card-title>
										</v-img>
									</v-card>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
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
import TaskStatusButton from '@/components/TaskStatusButton.vue';
import StopTaskButton from '@/components/StopTaskButton.vue';
import TaskStatusesMixin from '@/mixins/TaskStatusesMixin';
import { FETCH_PIPELINE } from '@/store/pipeline/actions';
import { CURRENT_PIPELINE } from '@/store/pipeline/getters';

export default {
	name: 'TaskInteraction',
	mixins: [TaskStatusesMixin],
	components: {
		TaskStatusButton,
		StopTaskButton,
	},
	computed: {
		...mapGetters('userInteraction', {
			USER_INTERACTIONS: USER_INTERACTIONS,
		}),
		...mapGetters('task', {
			TASK: TASK,
			TASK_CURRENT_EXECUTE_COMMAND: TASK_CURRENT_EXECUTE_COMMAND,
		}),
		...mapGetters('pipeline', {
			CURRENT_PIPELINE: CURRENT_PIPELINE,
		}),
		userInteractions(): UserInteraction[] {
			return this.USER_INTERACTIONS || [];
		},
		task(): any {
			return this.TASK || {};
		},
		pipeline(): any {
			return this.CURRENT_PIPELINE || {};
		},
		currentExecuteCommand: function() {
			return this.TASK_CURRENT_EXECUTE_COMMAND;
		},
		currentUserInteraction: function() {
			return this.userInteractions[this.tab];
		},
		showNeedWaiting: function() {
			return this.userInteractions.length === 0 && this.isNotFinished(this.task.status);
		},
		showFinished: function() {
			return this.isFinished(this.task.status);
		},
		showInteractionTabs: function() {
			return this.isNotFinished(this.task.status);
		},
	},
	data: () => {
		return {
			dialog: true,
			tab: null,
		};
	},
	watch: {
		task(val) {
			if (val) {
				this.fetchPipeline();
			}
		},
	},
	methods: {
		back() {
			this.$router.push({
				name: 'pipeline.edit',
				params: { id: this.pipeline.id, state: 'edit' },
			});
		},
		fetchPipeline() {
			this.$store.dispatch(`pipeline/${FETCH_PIPELINE}`, { id: this.task.pipelineId });
		},
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
