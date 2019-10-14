<template>
	<v-content>
		<v-container>
			<v-row>
				<v-col>
					<v-card>
						<v-card-title>{{ name }}</v-card-title>
						<v-divider></v-divider>
						<v-card-text>
							<v-text-field
								v-model="pipeline.key"
								:counter="255"
								label="Назва павука"
								required
							></v-text-field>
							<v-textarea
								v-model="pipeline.description"
								:rows="2"
								:counter="500"
								label="Опис"
							></v-textarea>
							<v-checkbox v-model="pipeline.isDebugMode" label="Режим розробника">
								<v-tooltip top slot="append">
									<template v-slot:activator="{ on }">
										<v-icon small v-on="on" color="grey lighten-1">help</v-icon>
									</template>
									<span
										>Якщо увімкнено - будуть доступні логи після
										завершення</span
									>
								</v-tooltip>
							</v-checkbox>
							<v-checkbox
								v-model="pipeline.isTakeScreenshot"
								label="Зберігати скріншоти"
							>
								<v-tooltip top slot="append">
									<template v-slot:activator="{ on }">
										<v-icon small v-on="on" color="grey lighten-1">help</v-icon>
									</template>
									<span
										>Якщо увімкнено - для кожної команди зберігаєтся скріншот,
										значно сповільнює роботу павука</span
									>
								</v-tooltip>
							</v-checkbox>
							<v-checkbox v-model="pipeline.needProxy" label="Змінювати ip адресу">
								<v-tooltip top slot="append">
									<template v-slot:activator="{ on }">
										<v-icon small v-on="on" color="grey lighten-1">help</v-icon>
									</template>
									<span
										>Якщо увімкнено - павук постійно змінює свою ip адресу</span
									>
								</v-tooltip>
							</v-checkbox>
						</v-card-text>
						<v-card-actions>
							<v-row class="pr-5" justify="end">
								<v-btn depressed :to="{ name: 'pipelines' }">назад</v-btn>
								<v-btn
									color="accent"
									depressed
									:disabled="saveBtnDisabled"
									@click="savePipeline"
									class="ml-6"
								>
									<span v-if="!pipelineLoading">Зберегти</span>
									<span v-if="pipelineLoading">Збереження...</span>
								</v-btn>
							</v-row>
						</v-card-actions>
					</v-card>
				</v-col>
				<v-col class="pt-0">
					<v-row>
						<v-col>
							<v-card>
								<v-card-title>Інструкції павука</v-card-title>
								<v-divider></v-divider>
								<v-card-text>
									<v-row v-if="pipeline.modifiedOn">
										<v-col>
											В останнє зміни збережено:
											<strong>{{ fromNow(pipeline.modifiedOn) }}</strong>
										</v-col>
									</v-row>
									<v-row>
										<v-col>
											<pipeline-json-editor
												:json="pipeline.jsonCommands"
												:title="pipeline.key"
												@save="saveJsonCommands"
												:disabled="!hasName"
											></pipeline-json-editor>
										</v-col>
									</v-row>
									<v-row>
										<v-col>
											<pipeline-yaml-editor
												:json="pipeline.jsonCommands"
												:title="pipeline.key"
												@save="saveJsonCommands"
												:disabled="!hasName"
											></pipeline-yaml-editor>
										</v-col>
									</v-row>
								</v-card-text>
							</v-card>
						</v-col>
					</v-row>
					<v-row>
						<v-col>
							<v-card>
								<v-card-title>Поточні дані</v-card-title>
								<v-divider></v-divider>
								<pipeline-data
									:pipeline-id="pipeline.id"
									:last-parse-rows-count="pipeline.lastParseRowsCount"
								></pipeline-data>
							</v-card>
						</v-col>
					</v-row>
				</v-col>
				<v-col>
					<v-card>
						<v-card-title>Історія запусків</v-card-title>
						<v-divider></v-divider>
						<v-card-text>
							<v-row>
								<v-col>
									<span>Поточний статус</span>
									<pipeline-run-status-button
										:miniIcon="false"
										:status="statusTitle"
										:pipeline-id="pipeline.id"
										:current-execute-command="pipeline.currentExecuteCommand"
										:current-execute-command-properties="
											pipeline.currentExecuteCommandProperties
										"
										:new-parse-rows-count="pipeline.newParseRowsCount"
										:loading="pipelineLoading"
										:disabled="!isCreated"
									></pipeline-run-status-button>
								</v-col>
							</v-row>
							<v-divider></v-divider>
							<v-row>
								<v-col>
									<span class="pr-3">10 останніх запусків павука</span>
									<tasks-mini
										v-if="tasks"
										:tasks="tasks"
										:disabled="!id"
										@reload="loadTasks"
									></tasks-mini>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-content>
</template>
<script>
import * as moment from 'moment';
import {
	FETCH_PIPELINE,
	CLEAR_PIPELINE,
	SAVE_PIPELINE,
	INIT_DEFAULT_PIPELINE_PROPERTIES,
} from '../store/pipeline/actions';
import { mapGetters } from 'vuex';
import { CURRENT_PIPELINE, CURRENT_PIPELINE_LOADING } from '../store/pipeline/getters';
import { SET_SNACK_MESSAGE } from '../store/mutations';
import PipelineJsonEditor from '../components/PipelineJsonEditor';
import PipelineYamlEditor from '../components/PipelineYamlEditor';
import PipelineRunStatusButton from '../components/PipelineRunStatusButton';
import TasksMini from '../components/TasksMini';
import { FETCH_TASKS } from '../store/tasks/actions';
import { TASKS } from '../store/tasks/getters';
import { CLEAR_TASKS } from '../store/tasks/mutations';
import PipelineData from '../components/PipelineData';
import ChartC3 from '../components/ChartC3';

export default {
	components: {
		PipelineJsonEditor,
		PipelineYamlEditor,
		PipelineRunStatusButton,
		TasksMini,
		ChartC3,
		PipelineData,
	},
	data() {
		return {};
	},
	watch: {
		$route: {
			handler: function(to, from) {},
		},
	},
	computed: {
		...mapGetters('pipeline', {
			pipeline: CURRENT_PIPELINE,
			pipelineLoading: CURRENT_PIPELINE_LOADING,
		}),
		...mapGetters('tasks', {
			tasks: TASKS,
		}),
		name() {
			return `Параметри` || this.pipeline.key || 'Введіть назву';
		},
		saveBtnDisabled() {
			return this.pipelineLoading || !this.pipeline.key;
		},
		isCreated() {
			return Boolean(this.pipeline.modifiedOn);
		},
		hasName() {
			return Boolean(this.pipeline.key);
		},
		statusTitle() {
			const status = (this.pipeline && this.pipeline.status) || {};
			return status.title;
		},
	},
	methods: {
		saveJsonCommands(json) {
			this.pipeline.jsonCommands = JSON.stringify(JSON.parse(json), null, 4);
			this.savePipeline();
		},
		async savePipeline() {
			this.$store
				.dispatch(`pipeline/${SAVE_PIPELINE}`)
				.then(success => {
					this.$store.commit(SET_SNACK_MESSAGE, success);
					this.checkRedirectAfterCreated();
				})
				.catch(error => this.$store.commit(SET_SNACK_MESSAGE, error));
		},
		checkRedirectAfterCreated() {
			if (this.state === 'edit') {
				return;
			}
			this.$router.replace({ name: 'pipeline.edit', params: { state: 'edit', id: this.id } });
		},
		fromNow(date) {
			if (!date) {
				return 'ще не зберігалося';
			}
			return moment.utc(date).fromNow();
		},
		loadTasks() {
			if (!this.id) {
				return;
			}
			this.$store.dispatch(`tasks/${FETCH_TASKS}`, { pipelineId: this.id });
		},
	},
	created() {
		this.$store.dispatch(`pipeline/${CLEAR_PIPELINE}`);
		this.$store.commit(`tasks/${CLEAR_TASKS}`);
		this.$store.dispatch(`pipeline/${INIT_DEFAULT_PIPELINE_PROPERTIES}`, {
			id: this.id,
		});
		if (this.state === 'add') {
			return;
		}
		this.loadTasks();
		this.$store.dispatch(`pipeline/${FETCH_PIPELINE}`, { id: this.id });
	},
	props: {
		id: {
			required: false,
			type: String,
		},
		state: {
			required: false,
			type: String,
			default: 'edit',
		},
	},
};
</script>
