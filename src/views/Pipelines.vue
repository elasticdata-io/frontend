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
										<th class="text-left" v-if="false">Статус</th>
										<th class="text-left">Зміненно</th>
										<th class="text-left">Назва</th>
										<th class="text-left">Опис</th>
										<th class="text-left">Запуски</th>
										<th class="text-left">Зібранні данні</th>
										<th class="text-left">Дії</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="pipeline in pipelines" :key="pipeline.id">
										<td v-if="false">
											<pipeline-run-status-button
												:pipeline-id="pipeline.id"
												:status="pipeline.status"
												:current-execute-command="
													pipeline.currentExecuteCommand
												"
												:new-parse-rows-count="pipeline.newParseRowsCount"
												:loading="pipeline.loading"
											></pipeline-run-status-button>
										</td>
										<td>
											<small>{{ fromNow(pipeline.modifiedOn) }}</small>
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
											<small>{{ pipeline.description }}</small>
										</td>
										<td>
											<v-btn v-if="!pipeline.tasksTotal" text disabled small>
												не було
											</v-btn>
											<v-btn
												v-if="pipeline.tasksTotal"
												text
												small
												color="primary"
												disabled
												:to="'/tasks/' + pipeline.id"
												>{{ pipeline.tasksTotal }} запуск(ів)
											</v-btn>
										</td>
										<td>
											<v-menu offset-y>
												<template v-slot:activator="{ on }">
													<v-btn
														v-if="pipeline.lastCompletedOn"
														color="primary"
														text
														small
														v-on="on"
													>
														<v-icon>arrow_downward</v-icon>
														{{ fromNow(pipeline.lastCompletedOn) }}
													</v-btn>
													<v-btn
														v-if="!pipeline.lastCompletedOn"
														text
														disabled
														small
													>
														немає
													</v-btn>
												</template>
												<v-list>
													<v-list-item
														:href="'/api/pipeline/data/' + pipeline.id"
														target="_blank"
													>
														<v-list-item-title>json</v-list-item-title>
													</v-list-item>
													<v-list-item
														:href="
															'/api/pipeline/data/csv/' + pipeline.id
														"
														target="_blank"
													>
														<v-list-item-title>csv</v-list-item-title>
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
															<v-icon class="pr-2">create </v-icon>
															редагувати
														</v-list-item-title>
													</v-list-item>
													<v-list-item @click="clone(pipeline.id)">
														<v-list-item-title>
															<v-icon class="pr-2">file_copy </v-icon>
															клонувати
														</v-list-item-title>
													</v-list-item>
													<v-list-item @click="remove(pipeline.id)">
														<v-list-item-title>
															<v-icon class="pr-2"
																>delete_sweep
															</v-icon>
															видалити
														</v-list-item-title>
													</v-list-item>
												</v-list>
											</v-menu>
										</td>
									</tr>
								</tbody>
							</template>
						</v-simple-table>
						<v-progress-linear
							v-if="pipelinesLoading"
							indeterminate
							color="cyan"
						></v-progress-linear>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-content>
</template>
<script>
import PipelineRunStatusButton from '../components/PipelineRunStatusButton';
import { CLONE_PIPELINE, FETCH_PIPELINES, REMOVE_PIPELINE } from '../store/pipelines/actions';
import { PIPELINES, PIPELINES_LOADING } from '../store/pipelines/getters';
import * as moment from 'moment';
import { mapGetters } from 'vuex';

export default {
	components: {
		PipelineRunStatusButton,
	},
	computed: {
		...mapGetters('pipelines', {
			pipelines: PIPELINES,
			pipelinesLoading: PIPELINES_LOADING,
		}),
	},
	methods: {
		fromNow(date) {
			if (!date) {
				return 'ще не збирались';
			}
			return moment.utc(date).fromNow();
		},
		edit(id) {
			this.$router.push({ name: 'pipeline.edit', params: { id } });
		},
		clone(id) {
			let is = window.confirm('Продовжити клонування павука?');
			if (!is) {
				return;
			}
			this.$store.dispatch(`pipelines/${CLONE_PIPELINE}`, { id });
		},
		remove(id) {
			let isDeleted = window.confirm('Продовжити видалення павука?');
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
