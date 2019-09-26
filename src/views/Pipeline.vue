<template>
	<v-content>
		<v-container>
			<v-layout>
				<v-flex sm5 md4>
					<v-layout>
						<v-card width="100%">
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
											:label="`Запускати в дебаг режимі`"
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
											:label="`Робити скріни екрану`"
										>
											<v-tooltip top slot="append">
												<template v-slot:activator="{ on }">
													<v-icon v-on="on" color="grey lighten-1"
														>help</v-icon
													>
												</template>
												<span
													>Якщо увімкнено - сповільнює роботу павука</span
												>
											</v-tooltip>
										</v-switch>
									</v-flex>
								</v-layout>
							</v-card-text>
							<v-card-actions>
								<v-row class="pr-5" justify="end">
									<v-btn color="accent" depressed :disabled="true"
										>Зберегти</v-btn
									>
									<v-btn depressed :to="{ name: 'pipelines' }">Скасувати</v-btn>
								</v-row>
							</v-card-actions>
						</v-card>
					</v-layout>
				</v-flex>
				<v-flex>
					code editor
				</v-flex>
			</v-layout>
		</v-container>
	</v-content>
</template>
<script>
export default {
	data() {
		return {
			pipeline: {
				description: '',
				name: '',
				isDebugMode: false,
				isTakeScreenshot: false,
			},
		};
	},
	computed: {
		name() {
			return this.pipeline.name || 'Введіть назву';
		},
	},
	props: {
		id: {
			required: false,
			type: String,
		},
	},
};
</script>
