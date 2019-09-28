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
									<span>Якщо увімкнено - значно сповільнює роботу павука</span>
								</v-tooltip>
							</v-checkbox>
							<v-checkbox v-model="pipeline.needProxy" label="Приховувати ip адресу">
								<v-tooltip top slot="append">
									<template v-slot:activator="{ on }">
										<v-icon small v-on="on" color="grey lighten-1">help</v-icon>
									</template>
									<span>Павук приховує свою ip адресу</span>
								</v-tooltip>
							</v-checkbox>
						</v-card-text>
						<v-card-actions>
							<v-row class="pr-5" justify="end">
								<v-btn
									color="accent"
									depressed
									:disabled="saveBtnDisabled"
									@click="savePipeline"
								>
									<span v-if="!saveBtnDisabled">Зберегти</span>
									<span v-if="saveBtnDisabled">Збереження...</span>
								</v-btn>
								<v-btn depressed :to="{ name: 'pipelines' }">назад</v-btn>
							</v-row>
						</v-card-actions>
					</v-card>
				</v-col>
				<v-col>
					<v-card>
						<v-card-title>Інструкції павука</v-card-title>
						<v-divider></v-divider>
						<v-card-text>
							<v-row>
								<v-col>
									<pipeline-json-editor
										:json="pipeline.jsonCommands"
										:title="pipeline.key"
										@save="saveJsonCommands"
									></pipeline-json-editor>
								</v-col>
							</v-row>
							<v-row>
								<v-col>
									<pipeline-yaml-editor
										:json="pipeline.jsonCommands"
										:title="pipeline.key"
										@save="saveJsonCommands"
									></pipeline-yaml-editor>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col>
					<v-card>
						<v-card-title>Історія запусків</v-card-title>
						<v-divider></v-divider>
						<v-card-text>
							list tasks
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-content>
</template>
<script>
import { FETCH_PIPELINE, CLEAR_PIPELINE, SAVE_PIPELINE } from '../store/pipeline/actions';
import { mapGetters } from 'vuex';
import { CURRENT_PIPELINE, CURRENT_PIPELINE_LOADING } from '../store/pipeline/getters';
import { SET_SNACK_MESSAGE } from '../store/mutations';
import { SET_PIPELINE_ID } from '../store/pipeline/mutations';
import PipelineJsonEditor from '../components/PipelineJsonEditor';
import PipelineYamlEditor from '../components/PipelineYamlEditor';

export default {
	components: { PipelineJsonEditor, PipelineYamlEditor },
	data() {
		return {};
	},
	computed: {
		...mapGetters('pipeline', {
			pipeline: CURRENT_PIPELINE,
			pipelineLoading: CURRENT_PIPELINE_LOADING,
		}),
		name() {
			return `Параметри` || this.pipeline.key || 'Введіть назву';
		},
		saveBtnDisabled() {
			return this.pipelineLoading;
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
	},
	async created() {
		this.$store.dispatch(`pipeline/${CLEAR_PIPELINE}`);
		if (this.state === 'edit') {
			await this.$store.dispatch(`pipeline/${FETCH_PIPELINE}`, { id: this.id });
		}
		this.$store.commit(`pipeline/${SET_PIPELINE_ID}`, this.id);
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
