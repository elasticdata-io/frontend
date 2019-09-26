<template>
	<v-content>
		<v-container>
			<v-layout>
				<v-flex sm6 md5>
					<v-card>
						<v-card-title>{{ name }}</v-card-title>
						<v-divider></v-divider>
						<v-card-text>
							<v-text-field
								v-model="pipeline.name"
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
							<v-layout>
								<v-flex>
									<v-switch
										v-model="pipeline.isDebugMode"
										:label="`Режим розробника`"
									>
										<v-tooltip top slot="append">
											<template v-slot:activator="{ on }">
												<v-icon v-on="on" color="grey lighten-1"
													>help</v-icon
												>
											</template>
											<span
												>Якщо увімкнено - будуть доступні логи після
												завершення</span
											>
										</v-tooltip>
									</v-switch>
								</v-flex>
								<v-flex>
									<v-switch
										v-model="pipeline.isTakeScreenshot"
										:label="`Зберігати скріншоти`"
									>
										<v-tooltip top slot="append">
											<template v-slot:activator="{ on }">
												<v-icon v-on="on" color="grey lighten-1"
													>help</v-icon
												>
											</template>
											<span
												>Якщо увімкнено - значно сповільнює роботу
												павука</span
											>
										</v-tooltip>
									</v-switch>
								</v-flex>
							</v-layout>
						</v-card-text>
						<v-card-actions>
							<v-row class="pr-5" justify="end">
								<v-btn color="accent" depressed :disabled="true">Зберегти</v-btn>
								<v-btn depressed :to="{ name: 'pipelines' }">Скасувати</v-btn>
							</v-row>
						</v-card-actions>
					</v-card>
				</v-flex>
				<v-flex>
					<pre class="json" id="editor" style="height: calc(100vh - 100px);">
                        <code>{{ pipeline.jsonCommands }}</code>
                    </pre>
				</v-flex>
			</v-layout>
		</v-container>
	</v-content>
</template>
<script>
import * as ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/monokai';

let editor;

export default {
	data() {
		return {
			pipeline: {
				description: '',
				name: '',
				isDebugMode: false,
				isTakeScreenshot: false,
				jsonCommands: JSON.stringify(window.location)
					.split(',')
					.join(',\n'),
			},
		};
	},
	computed: {
		name() {
			return this.pipeline.name || 'Введіть назву';
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
	},
	mounted() {
		this.initEditor(ace);
	},
	props: {
		id: {
			required: false,
			type: String,
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
