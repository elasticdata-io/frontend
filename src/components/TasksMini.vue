<template>
	<v-simple-table class="tasks-mini">
		<template v-slot:default>
			<thead>
				<tr>
					<th class="text-left"></th>
					<th class="text-left"></th>
					<th class="text-left">Тривалість</th>
					<th class="text-left">Завершено</th>
					<th class="text-left">Дії</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="(task, index) in tasks"
					:key="task.id"
					:class="{ 'pink--text': task.error }"
				>
					<td>{{ index + 1 }}</td>
					<td>
						<v-tooltip left>
							<template v-slot:activator="{ on }">
								<v-icon v-if="task.error" color="pink" v-on="on">
									error
								</v-icon>
							</template>
							<span>Завершено з помилкою</span>
						</v-tooltip>

						<v-tooltip left>
							<template v-slot:activator="{ on }">
								<v-icon v-if="!task.error" v-on="on">check</v-icon>
							</template>
							<span>Завершено без помилок</span>
						</v-tooltip>
					</td>
					<td>
						{{ duration(task) }}
					</td>
					<td>{{ fromNow(task.startOn) }}</td>
					<td>
						<v-menu offset-y>
							<template v-slot:activator="{ on }">
								<v-btn depressed text v-on="on">
									<v-icon>more_vert</v-icon>
								</v-btn>
							</template>
							<v-list>
								<v-list-item
									:href="'http://applogs.elasticdata.io/' + task.id"
									target="_blank"
								>
									<v-list-item-title>
										<v-icon class="pr-2">folder_open</v-icon>
										переглянути логи
									</v-list-item-title>
								</v-list-item>
								<v-list-item
									:href="'/api/pipeline-task/data/' + task.id"
									target="_blank"
								>
									<v-list-item-title>
										<v-icon class="pr-2">cloud_download</v-icon>
										скачати json
									</v-list-item-title>
								</v-list-item>
							</v-list>
						</v-menu>
					</td>
				</tr>
			</tbody>
		</template>
	</v-simple-table>
</template>
<script>
import * as moment from 'moment';

export default {
	methods: {
		fromNow(date) {
			if (!date) {
				return 'ще не зберігалося';
			}
			return moment.utc(date).fromNow();
		},
		duration: task => {
			const startOn = moment.utc(task.startOn);
			const endOn = moment.utc(task.endOn);
			const diff = endOn.diff(startOn);
			return moment.utc(diff).format('HH:mm:ss');
		},
	},
	props: {
		tasks: {
			type: Array,
			default: () => [],
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
