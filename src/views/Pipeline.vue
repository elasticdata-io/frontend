<template>
	<v-content>
		<v-container>
			<v-row>
				<v-col md="4">
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
				<v-col md="4">
					<v-card>
						<v-card-title>Інструкції павука</v-card-title>
						<v-divider></v-divider>
						<v-card-text>
							telegram
						</v-card-text>
					</v-card>
				</v-col>
				<v-col md="4">
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
import * as ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/monokai';
import { FETCH_PIPELINE, CLEAR_PIPELINE, SAVE_PIPELINE } from '../store/pipeline/actions';
import { mapGetters } from 'vuex';
import { CURRENT_PIPELINE, CURRENT_PIPELINE_LOADING } from '../store/pipeline/getters';
import { SET_SNACK_MESSAGE } from '../store/mutations';
import { SET_PIPELINE_ID } from '../store/pipeline/mutations';

let editor;

export default {
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
		initEditor: function(ace) {
			setTimeout(() => {
				editor = ace.edit('editor');
				editor.setTheme('ace/theme/monokai');
				editor.getSession().setMode('ace/mode/json');
				editor.getSession().on('change', () => this.onChangeJsonCommands());
			});
		},
		onChangeJsonCommands: function() {
			let json = editor.getValue();
			// this.$store.commit(`pipeline/${pipelineMutation.CHANGE_PROPS}`, {
			//     property: 'jsonCommands',
			//     value: json
			// });
		},
		async savePipeline() {
			this.$store
				.dispatch(`pipeline/${SAVE_PIPELINE}`)
				.then(success => {
					this.$store.commit(SET_SNACK_MESSAGE, success);
				})
				.catch(error => this.$store.commit(SET_SNACK_MESSAGE, error));
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
<style lang="less">
#editor .ace_content * {
	font-family: Monaco, 'Ubuntu Mono', monospace;
	font-weight: 400;
	font-size: 12px;
	line-height: 1.35;
	letter-spacing: 0.32px;
}
</style>
