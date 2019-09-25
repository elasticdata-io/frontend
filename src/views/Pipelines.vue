<template>
	<v-app id="pipelines">
		<app-header></app-header>
		<v-content>
			<v-container class="fill-height" fluid>
				<v-layout>
					<v-flex>
						<h1>Pipelines</h1>
						<v-simple-table>
							<template v-slot:default>
								<thead>
									<tr>
										<th class="text-left">Run status</th>
										<th class="text-left">Name</th>
										<th class="text-left">launches</th>
										<th class="text-left">Last completed</th>
										<th class="text-left">Scrap data</th>
										<th class="text-left">Actions</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="pipeline in pipelines" :key="pipeline.id">
										<td>
											<pipeline-run-status-button
												:pipeline="pipeline"
											></pipeline-run-status-button>
										</td>
										<td>{{ pipeline.key }}</td>
										<td>
											<v-btn
												text
												small
												color="primary"
												:to="'/tasks/' + pipeline.id"
												>35 launches</v-btn
											>
										</td>
										<td>{{ fromNow(pipeline.lastCompletedOn) }}</td>
										<td>
											<v-menu offset-y>
												<template v-slot:activator="{ on }">
													<v-btn color="primary" text small v-on="on">
														download
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
																>create</v-icon
															>
															edit
														</v-list-item-title>
													</v-list-item>
													<v-list-item @click="remove(pipeline.id)">
														<v-list-item-title>
															<v-icon style="padding-right: 5px;"
																>delete_sweep</v-icon
															>
															remove
														</v-list-item-title>
													</v-list-item>
												</v-list>
											</v-menu>
										</td>
									</tr>
								</tbody>
							</template>
						</v-simple-table>
					</v-flex>
				</v-layout>
			</v-container>
		</v-content>
	</v-app>
</template>
<script>
import AppHeader from '../components/AppHeader';
import PipelineRunStatusButton from '../components/PipelineRunStatusButton';
import { FETCH_PIPELINES, REMOVE } from '../store/pipelines/actions';
import { PIPELINES } from '../store/pipelines/getters';
import * as moment from 'moment';
import { mapGetters } from 'vuex';

export default {
	components: {
		AppHeader,
		PipelineRunStatusButton,
	},
	computed: {
		...mapGetters('pipelines', {
			pipelines: PIPELINES,
		}),
	},
	methods: {
		fromNow(date) {
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
			const token = this.$localStorage.get('token');
			this.$store.dispatch(`pipelines/${REMOVE}`, { token, id });
		},
	},
	created() {
		this.$store.dispatch(`pipelines/${FETCH_PIPELINES}`);
	},
};
</script>
