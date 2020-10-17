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
							<v-checkbox
								class="hide-v-messages"
								v-model="pipeline.needProxy"
								label="Змінювати ip адресу"
							>
								<v-tooltip top slot="append">
									<template v-slot:activator="{ on }">
										<v-icon small v-on="on" color="grey lighten-1">help</v-icon>
									</template>
									<span
										>Якщо увімкнено - павук постійно змінює свою ip адресу</span
									>
								</v-tooltip>
							</v-checkbox>
							<v-btn
								small
								class="expand-more"
								depressed
								v-if="!viewAdditional"
								@click="viewAdditional = true"
							>
								<v-icon class="pr-2">expand_more</v-icon>
								ще
							</v-btn>
							<div v-if="viewAdditional">
								<v-checkbox
									v-if="false"
									class="hide-v-messages"
									v-model="pipeline.isDebugMode"
									label="Режим розробника"
								>
									<v-tooltip top slot="append">
										<template v-slot:activator="{ on }">
											<v-icon small v-on="on" color="grey lighten-1"
												>help
											</v-icon>
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
											<v-icon small v-on="on" color="grey lighten-1"
												>help
											</v-icon>
										</template>
										<span
											>Якщо увімкнено - для кожної команди зберігаєтся
											скріншот, значно сповільнює роботу павука</span
										>
									</v-tooltip>
								</v-checkbox>
								<div>
									<pipeline-dependents
										:disabled="!pipeline.key"
										:id="pipeline.id"
										:title="pipeline.key"
										:dependencies="dependencies"
										@add="onAddDependency"
										@remove="onRemoveDependency"
										@save="onSaveDependency"
									></pipeline-dependents>
								</div>
								<div>
									<v-btn depressed small color="grey darken-1" dark class="mt-4">
										<v-icon class="pr-2">timer</v-icon>
										розклад запуску
									</v-btn>
								</div>
							</div>
							<div v-if="viewAdditional">
								<v-btn
									depressed
									small
									class="expand-less"
									v-if="viewAdditional"
									@click="viewAdditional = false"
								>
									<v-icon class="pr-2">expand_less</v-icon>
									згорнути
								</v-btn>
							</div>
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
						<v-card-title>Задачі</v-card-title>
						<v-divider></v-divider>
						<v-card-text>
							<v-row>
								<v-col>
									<v-btn
										:disabled="state === 'add'"
										block
										color="primary"
										@click="runPipeline"
									>
										<v-icon class="mr-1">play_arrow</v-icon>
										Запустити задачу
									</v-btn>
								</v-col>
							</v-row>
							<v-divider></v-divider>
							<v-row>
								<v-col>
									<tasks-mini
										v-if="state === 'edit'"
										:pipeline-id="id"
										:pipeline-key="pipeline.key"
									></tasks-mini>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
			<need-user-interaction-modal-box
				:pipeline-id="id"
				:opened="needUserInteractionModalBox"
				@close="needUserInteractionModalBox = false"
			></need-user-interaction-modal-box>
		</v-container>
	</v-content>
</template>
<script type="ts">
import * as moment from 'moment';
import {
	FETCH_PIPELINE,
	CLEAR_PIPELINE,
	SAVE_PIPELINE,
	INIT_DEFAULT_PIPELINE_PROPERTIES,
	RUN_PIPELINE,
} from '@/store/pipeline/actions';
import { mapGetters } from 'vuex';
import { CURRENT_PIPELINE, CURRENT_PIPELINE_LOADING } from '@/store/pipeline/getters';
import { SET_SNACK_MESSAGE } from '@/store/mutations';
import PipelineJsonEditor from '../components/PipelineJsonEditor';
import PipelineYamlEditor from '../components/PipelineYamlEditor';
import TasksMini from '../components/TasksMini';
import { CLEAR_TASKS } from '@/store/tasks/mutations';
import PipelineData from '../components/PipelineData';
import PipelineDependents from '../components/PipelineDependents';
import NeedUserInteractionModalBox from '@/components/NeedUserInteractionModalBox.vue';

export default {
	components: {
		PipelineJsonEditor,
		PipelineYamlEditor,
		TasksMini,
		PipelineData,
		PipelineDependents,
        NeedUserInteractionModalBox,
	},
	data() {
		return {
			viewAdditional: false,
            needUserInteractionModalBox: false,
		};
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
			return this.pipelineLoading || !this.pipeline.key;
		},
		hasName() {
			return Boolean(this.pipeline.key);
		},
		dependencies: {
			get() {
				return this.pipeline.dependencies;
			},
			set(dependencies) {
				this.pipeline.dependencies = dependencies;
			},
		},
	},
	methods: {
		runPipeline() {
            const pipeline = JSON.parse(this.pipeline.jsonCommands) || {settings: {}};
            const settings = pipeline.settings || {};
            this.needUserInteractionModalBox = Boolean(settings.userInteraction);
            if (this.needUserInteractionModalBox) {
                return;
            }
			this.$store.dispatch(`pipeline/${RUN_PIPELINE}`, { pipelineId: this.id });
		},
		saveJsonCommands(json) {
			this.pipeline.jsonCommands = JSON.stringify(JSON.parse(json), null, 4);
			this.savePipeline();
		},
		async savePipeline() {
			return this.$store
				.dispatch(`pipeline/${SAVE_PIPELINE}`)
				.then(success => {
					this.$store.commit(SET_SNACK_MESSAGE, { msg: success });
					this.checkRedirectAfterCreated();
				})
				.catch(error =>
					this.$store.commit(SET_SNACK_MESSAGE, {
						msg: error,
						color: 'rgba(255, 0, 0, 0.6)',
					})
				);
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
		onAddDependency({ pipelineId, dataFreshnessInterval }) {
			const dependencies = this.dependencies || [];
			this.dependencies = dependencies.concat([
				{
					pipelineId,
					dataFreshnessInterval,
				},
			]);
		},
		onRemoveDependency(pipelineId) {
			this.dependencies = this.dependencies.filter(x => x.pipelineId !== pipelineId);
		},
		async onSaveDependency() {
			return this.savePipeline();
		},
	},
	created() {
		this.$store.dispatch(`pipeline/${CLEAR_PIPELINE}`);
		this.$store.commit(`tasks/${CLEAR_TASKS}`);
		this.$store.dispatch(`pipeline/${INIT_DEFAULT_PIPELINE_PROPERTIES}`, {
			id: this.id,
			isDebugMode: false,
			dependencies: [],
		});
		if (this.state === 'add') {
			return;
		}
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
<style lang="less">
.expand-more {
	margin-top: 16px;
}

.expand-less {
	margin-top: 32px;
}

.hide-v-messages {
	.v-messages {
		display: none;
	}
}
</style>
