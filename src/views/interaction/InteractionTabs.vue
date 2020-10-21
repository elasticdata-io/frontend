<template>
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
				<stop-task-button :status="task.status" :task-id="task.id"></stop-task-button>
			</v-toolbar>
		</v-col>
		<template v-if="!loadingUserInteractions">
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
				Якщо павук буде зупинено, на сторінці буде відображена інформація про необхідніть
				Вашого втручання.
				<v-progress-linear height="2" indeterminate color="light-blue"></v-progress-linear>
			</v-col>
			<v-col v-for="userInteraction in userInteractions" :key="userInteraction.id" md="4">
				<task-interaction-card
					v-if="showInteractionTabs"
					:tab-name="`Вкладка №${parseInt(userInteraction.pageContext) + 1}`"
					:user-interaction="userInteraction"
					@open="goToSiteViewBox"
				></task-interaction-card>
			</v-col>
		</template>
		<template v-if="loadingUserInteractions">
			<v-col md="12">
				<v-progress-linear
					color="teal"
					buffer-value="0"
					value="20"
					stream
				></v-progress-linear>
			</v-col>
		</template>
	</v-row>
</template>
<script lang="ts">
import { mapGetters } from 'vuex';
import { LOADING_USER_INTERACTIONS, USER_INTERACTIONS } from '@/store/user-interaction/getters';
// eslint-disable-next-line no-unused-vars
import { UserInteraction } from '@/store/user-interaction';
import { TASK, TASK_CURRENT_EXECUTE_COMMAND } from '@/store/task/getters';
import { CURRENT_PIPELINE } from '@/store/pipeline/getters';
import TaskStatusesMixin from '@/mixins/TaskStatusesMixin';
import TaskInteractionCard from '@/components/TaskInteractionCard.vue';
import TaskStatusButton from '@/components/TaskStatusButton.vue';
import StopTaskButton from '@/components/StopTaskButton.vue';
import { FETCH_PIPELINE } from '@/store/pipeline/actions';

export default {
	name: 'InteractionTabs',
	mixins: [TaskStatusesMixin],
	components: {
		TaskInteractionCard,
		TaskStatusButton,
		StopTaskButton,
	},
	computed: {
		...mapGetters('userInteraction', {
			USER_INTERACTIONS: USER_INTERACTIONS,
			LOADING_USER_INTERACTIONS: LOADING_USER_INTERACTIONS,
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
		loadingUserInteractions(): UserInteraction[] {
			return this.LOADING_USER_INTERACTIONS;
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
		goToSiteViewBox(interactionId) {
			this.$router.push(`/task-interaction/${this.taskId}/${interactionId}`);
		},
	},
	props: {
		taskId: {
			type: String,
			required: true,
		},
		interactionId: {
			type: String,
		},
	},
	watch: {
		task(val) {
			if (val) {
				this.fetchPipeline();
			}
		},
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
