<template>
	<div>
		<pipeline-task-logs
			v-if="selectedTaskId"
			@closed="selectedTaskId = null"
			:title="selectedPipelineTitle"
			:task-id="selectedTaskId"
		></pipeline-task-logs>
		<v-simple-table class="tasks-mini">
			<template v-slot:default>
				<thead>
					<tr>
						<th class="text-left pl-1">
							<v-tooltip top>
								<template v-slot:activator="{ on }">
									<v-btn
										small
										icon
										depressed
										:disabled="disabled"
										@click="reload"
										v-on="on"
										color="accent"
									>
										<v-icon>refresh</v-icon>
									</v-btn>
								</template>
								<span>Оновити список</span>
							</v-tooltip>
						</th>
						<th class="text-left">Завершено <v-icon>sort</v-icon></th>
						<th class="text-left">Тривалість</th>
						<th class="text-left">Дії</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="(task, index) in tasks"
						:key="task.id"
						:class="{ 'pink--text': task.error }"
					>
						<td>
							<v-tooltip left>
								<template v-slot:activator="{ on }">
									<v-icon small v-if="task.error" color="pink" v-on="on">
										error
									</v-icon>
								</template>
								<span>{{ task.error }}</span>
							</v-tooltip>

							<v-tooltip left>
								<template v-slot:activator="{ on }">
									<v-icon small v-if="!task.error" v-on="on">check</v-icon>
								</template>
								<span>Завершено без помилок</span>
							</v-tooltip>
						</td>
						<td>{{ fromNow(task.startOn) }}</td>
						<td>
							{{ duration(task) }}
						</td>
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
											<v-icon class="pr-2">folder_open</v-icon>
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

export default {
	components: { PipelineTaskLogs },
	data() {
		return {
			selectedPipelineTitle: null,
			selectedTaskId: null,
		};
	},
	methods: {
		viewLogs(task) {
			this.selectedTaskId = task.id;
			this.selectedPipelineTitle = task.pipeline.key;
		},
		fromNow(date) {
			if (!date) {
				return 'ще не зберігалося';
			}
			return moment.utc(date).fromNow();
		},
		duration: task => {
			if (!task.startOn || !task.endOn) {
				return 'невідомо';
			}
			const startOn = moment.utc(task.startOn);
			const endOn = moment.utc(task.endOn);
			const diff = endOn.diff(startOn);
			return moment.utc(diff).format('HH:mm:ss');
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
};
</script>
<style lang="less">
.tasks-mini {
	&.v-data-table td {
		font-size: 0.8em;
	}
}
</style>
