<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
	<v-main>
		<v-container class="fill-height" fluid>
			<v-row>
				<v-col>
					<v-card>
						<v-card-title>
							<span>{{ $t('USER_MENU.PIPELINES') }}</span>
							<v-btn
								color="accent"
								small
								depressed
								style="margin-left: 20px;"
								to="/pipeline/add"
							>
								<v-icon>add</v-icon>
								{{ $t('USER_MENU.ADD_PIPELINE') }}
							</v-btn>
						</v-card-title>
						<v-card-text>
							<v-btn
								small
								depressed
								@click="toggleOnlyRunningPipeline"
								:color="onlyRunningPipeline ? 'secondary' : ''"
							>
								<v-icon small class="mr-3">filter_list</v-icon>
								{{ $t('PIPELINE.PIPELINES.ACTIVE') }}
								<v-icon small class="ml-3" v-if="onlyRunningPipeline">close</v-icon>
							</v-btn>
							<v-simple-table>
								<template v-slot:default>
									<thead>
										<tr>
											<th class="text-left">
												{{ $t('PIPELINE.PIPELINES.DOCS') }}
											</th>
											<th class="text-left" v-if="false">
												{{ $t('PIPELINE.PIPELINES.STATUS') }}
											</th>
											<th class="text-left">
												{{ $t('PIPELINE.PIPELINES.CHANGED') }}
											</th>
											<th class="text-left">
												{{ $t('PIPELINE.PIPELINES.VERSION') }}
											</th>
											<th class="text-left">
												{{ $t('PIPELINE.PIPELINES.NAME') }}
											</th>
											<th class="text-left">
												{{ $t('PIPELINE.PIPELINES.DESCRIPTION') }}
											</th>
											<th class="text-left">
												{{ $t('PIPELINE.PIPELINES.RUNS') }}
											</th>
											<th class="text-left">
												{{ $t('PIPELINE.PIPELINES.COLLECTED_DATA') }}
											</th>
											<th class="text-left">
												{{ $t('PIPELINE.PIPELINES.ACTIONS') }}
											</th>
										</tr>
									</thead>
									<tbody>
										<tr
											v-for="pipeline in pipelines"
											:class="{ 'pink lighten-5': dataIsEmpty(pipeline) }"
											:key="pipeline.id"
										>
											<td style="font-family: 'Ubuntu Mono', serif;">
												<v-tooltip bottom>
													<template v-slot:activator="{ on }">
														<v-btn text small v-on="on">
															<v-icon size="16" class="mr-1"
																>description</v-icon
															>
															<span>{{ docsCount(pipeline) }}</span>
														</v-btn>
													</template>
													<span>{{
														$t('PIPELINE.PIPELINES.COLLECTED_TOTAL')
													}}</span>
												</v-tooltip>
											</td>
											<td v-if="false">
												<pipeline-run-status-button
													:pipeline-id="pipeline.id"
													:status="pipeline.status"
													:current-execute-command="
														pipeline.currentExecuteCommand
													"
													:new-parse-rows-count="
														pipeline.newParseRowsCount
													"
													:loading="pipeline.loading"
												></pipeline-run-status-button>
											</td>
											<td>
												<small>{{ fromNow(pipeline.modifiedOn) }}</small>
											</td>
											<td>
												{{ pipeline.pipelineVersion }}
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
												<v-btn
													v-if="!pipeline.tasksTotal"
													text
													disabled
													small
												>
													не було
												</v-btn>
												<v-btn
													v-if="pipeline.tasksTotal"
													text
													small
													color="primary"
													disabled
													:to="'/tasks/' + pipeline.id"
													>{{ pipeline.tasksTotal }}
													{{ $t('PIPELINE.PIPELINES.RUNS_AMOUNT') }}
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
															:href="
																'/api/pipeline/data/' + pipeline.id
															"
															target="_blank"
														>
															<v-list-item-title
																>json</v-list-item-title
															>
														</v-list-item>
														<v-list-item
															:href="
																'/api/pipeline/data/csv/' +
																	pipeline.id
															"
															target="_blank"
														>
															<v-list-item-title
																>csv</v-list-item-title
															>
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
																<v-icon class="pr-2"
																	>create
																</v-icon>
																редагувати
															</v-list-item-title>
														</v-list-item>
														<v-list-item @click="clone(pipeline.id)">
															<v-list-item-title>
																<v-icon class="pr-2"
																	>file_copy
																</v-icon>
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
							<div
								class="title"
								v-if="pipelines && pipelines.length === 0 && !pipelinesLoading"
							>
								{{ $t('DATA.NOT_FOUND') }}
							</div>
							<v-progress-linear
								v-if="pipelinesLoading"
								indeterminate
								color="cyan"
							></v-progress-linear>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-main>
</template>
<script>
import PipelineRunStatusButton from '../components/PipelineRunStatusButton';
import {
	CLONE_PIPELINE,
	FETCH_PIPELINES,
	FETCH_PIPELINES_IN_PROCESSING,
	REMOVE_PIPELINE,
} from '../store/pipelines/actions';
import { PIPELINES, PIPELINES_LOADING } from '../store/pipelines/getters';
import * as moment from 'moment';
import { mapGetters } from 'vuex';

export default {
	components: {
		PipelineRunStatusButton,
	},
	computed: {
		...mapGetters('pipelines', {
			PIPELINES: PIPELINES,
			pipelinesLoading: PIPELINES_LOADING,
		}),
		pipelines: function() {
			return this.PIPELINES;
		},
	},
	data: () => {
		return {
			onlyRunningPipeline: false,
		};
	},
	methods: {
		toggleOnlyRunningPipeline: function() {
			this.onlyRunningPipeline = !this.onlyRunningPipeline;
			if (this.onlyRunningPipeline) {
				this.$store.dispatch(`pipelines/${FETCH_PIPELINES_IN_PROCESSING}`);
				return;
			}
			this.$store.dispatch(`pipelines/${FETCH_PIPELINES}`);
		},
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
		dataIsEmpty(pipeline) {
			return !this.docsBytes(pipeline);
		},
		docsCount(pipeline) {
			return pipeline.lastParseRowsCount || 0;
		},
		docsBytes(pipeline) {
			return pipeline.lastParseBytes || 0;
		},
	},
	created() {
		this.$store.dispatch(`pipelines/${FETCH_PIPELINES}`);
	},
};
</script>
