<template>
	<div>
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
		<v-simple-table class="tasks-mini mt-5">
			<template v-slot:default>
				<thead>
					<tr>
						<th class="text-left pl-1">
							Статус
						</th>
						<th class="text-left">Тривалість</th>
						<th class="text-left">Завершено</th>
						<th class="text-left">Дії</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="task in tasks"
						:key="task.id"
						:class="{ 'pink--text': task.failureReason }"
					>
						<td>
							<task-run-status-button
								:task-id="task.id"
								:status="task.status"
								:failureReason="task.failureReason"
								:new-parse-rows-count="task.newParseRowsCount"
								:current-execute-command="task.currentExecuteCommand"
								:current-execute-command-properties="
									task.currentExecuteCommandProperties
								"
								:miniIcon="true"
							></task-run-status-button>
						</td>
						<td>
							{{ duration(task) }}
						</td>
						<td>{{ fromNow(task.endOnUtc) }}</td>
						<td>
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
								</v-list>
							</v-menu>
						</td>
					</tr>
				</tbody>
			</template>
		</v-simple-table>
	</div>
</template>
<script>
import * as moment from 'moment';
import PipelineTaskLogs from './PipelineTaskLogs';
import TaskRunStatusButton from './TaskRunStatusButton';

export default {
	components: { PipelineTaskLogs, TaskRunStatusButton },
	data() {
		return {
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
}
</style>
