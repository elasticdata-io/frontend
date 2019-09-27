<template>
	<v-content>
		<v-container class="fill-height" fluid>
			<v-row>
				<v-col>
					<v-card>
						<v-card-title>
							<span>Павуки</span>
							<v-btn
								color="accent"
								small
								depressed
								style="margin-left: 20px;"
								to="/pipeline/add"
							>
								<v-icon>add</v-icon>
								додати нового павука
							</v-btn>
						</v-card-title>
						<v-simple-table>
							<template v-slot:default>
								<thead>
									<tr>
										<th class="text-left">Статус</th>
										<th class="text-left">Назва</th>
										<th class="text-left">Запуски</th>
										<th class="text-left">Зібранні данні</th>
										<th class="text-left">Дії</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="pipeline in pipelines" :key="pipeline.id">
										<td>
											<pipeline-run-status-button
												:pipeline="pipeline"
											></pipeline-run-status-button>
										</td>
										<td>
											<router-link
												:to="{
													name: 'pipeline.edit',
													params: { id: pipeline.id, state: 'edit' },
												}"
											>
												{{ pipeline.key }}
											</router-link>
										</td>
										<td>
											<v-btn
												text
												small
												color="primary"
												:to="'/tasks/' + pipeline.id"
												>35 запуск(ів)
											</v-btn>
										</td>
										<td>
											<v-menu offset-y v-if="pipeline.lastCompletedOn">
												<template v-slot:activator="{ on }">
													<v-btn color="primary" text small v-on="on">
														<v-icon>arrow_downward</v-icon>
														{{ fromNow(pipeline.lastCompletedOn) }}
													</v-btn>
												</template>
												<v-list>
													<v-list-item>
														<a
															:href="
																'/api/pipeline/data/' + pipeline.id
															"
															target="_blank"
														>
															json
														</a>
													</v-list-item>
													<v-list-item>
														<a
															:href="
																'/api/pipeline/data/csv/' +
																	pipeline.id
															"
															target="_blank"
														>
															csv
														</a>
													</v-list-item>
												</v-list>
											</v-menu>
										</td>
										<td>
											<v-menu offset-y>
												<template v-slot:activator="{ on }">
													<v-btn depressed text v-on="on">
														<v-icon>more_vert</v-icon>
													</v-btn>
												</template>
												<v-list>
													<v-list-item @click="edit(pipeline.id)">
														<v-list-item-title>
															<v-icon style="padding-right: 5px;"
																>create
															</v-icon>
															редагувати
														</v-list-item-title>
													</v-list-item>
													<v-list-item @click="remove(pipeline.id)">
														<v-list-item-title>
															<v-icon style="padding-right: 5px;"
																>delete_sweep
															</v-icon>
															видалити
														</v-list-item-title>
													</v-list-item>
													<v-list-item @click="clone(pipeline.id)">
														<v-list-item-title>
															<v-icon style="padding-right: 5px;"
																>file_copy
															</v-icon>
															клонувати
														</v-list-item-title>
													</v-list-item>
												</v-list>
											</v-menu>
										</td>
									</tr>
								</tbody>
							</template>
						</v-simple-table>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-content>
</template>
<script>
import PipelineRunStatusButton from '../components/PipelineRunStatusButton';
import { FETCH_PIPELINES, REMOVE_PIPELINE } from '../store/pipelines/actions';
import { PIPELINES } from '../store/pipelines/getters';
import * as moment from 'moment';
import { mapGetters } from 'vuex';

moment.locale('uk');

export default {
	components: {
		PipelineRunStatusButton,
	},
	computed: {
		...mapGetters('pipelines', {
			pipelines: PIPELINES,
		}),
	},
	methods: {
		fromNow(date) {
			if (!date) {
				return 'ще не збирались';
			}
			return moment(date).fromNow();
		},
		edit(id) {
			this.$router.push({ name: 'pipeline.edit', params: { id } });
		},
		remove(id) {
			let isDeleted = window.confirm('Do I continue deleting?');
			if (!isDeleted) {
				return;
			}
			this.$store.dispatch(`pipelines/${REMOVE_PIPELINE}`, { id });
		},
	},
	created() {
		this.$store.dispatch(`pipelines/${FETCH_PIPELINES}`);
	},
};
</script>
