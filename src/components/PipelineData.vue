<template>
	<v-card-text>
		<v-row>
			<v-col>
				<span class="headline">Всього документів: {{ lastParseRowsCount }}</span>
				<p>
					<!--                                                <pipeline-data></pipeline-data>-->
				</p>
				<v-row>
					<v-col class="pb-1">
						<v-btn block small>
							переглянути
							<v-icon class="ml-2">view_list</v-icon>
						</v-btn>
					</v-col>
				</v-row>
				<v-row>
					<v-col class="pb-1">
						<v-menu offset-y>
							<template v-slot:activator="{ on }">
								<v-btn block small v-on="on">
									завантажити
									<v-icon class="ml-2">more_vert </v-icon>
								</v-btn>
							</template>
							<v-list>
								<v-list-item :href="jsonLink" target="_blank">
									<v-list-item-title>
										<v-icon class="ml-2">get_app </v-icon>
										json
									</v-list-item-title>
								</v-list-item>
								<v-list-item :href="csvLink" target="_blank">
									<v-list-item-title>
										<v-icon class="ml-2">get_app </v-icon>
										csv
									</v-list-item-title>
								</v-list-item>
								<v-list-item disabled>
									<v-list-item-title>
										<v-icon disabled class="ml-2">get_app </v-icon>
										xls
									</v-list-item-title>
								</v-list-item>
							</v-list>
						</v-menu>
					</v-col>
				</v-row>
				<v-row>
					<v-col>
						<v-menu offset-y>
							<template v-slot:activator="{ on }">
								<v-btn block small v-on="on">
									Копіювати посилання
									<v-icon class="ml-2">more_vert </v-icon>
								</v-btn>
							</template>
							<v-list>
								<v-list-item>
									<v-list-item-title>
										<v-icon class="ml-2">link </v-icon>
										json
									</v-list-item-title>
								</v-list-item>
								<v-list-item>
									<v-list-item-title>
										<v-icon class="ml-2">link </v-icon>
										csv
									</v-list-item-title>
								</v-list-item>
								<v-list-item disabled>
									<v-list-item-title>
										<v-icon disabled class="ml-2">link </v-icon>
										xls
									</v-list-item-title>
								</v-list-item>
							</v-list>
						</v-menu>
					</v-col>
				</v-row>
				<v-row>
					<v-col>
						<v-badge style="width: 100%" color="purple" right overlap>
							<template v-slot:badge>
								<v-tooltip bottom>
									<template v-slot:activator="{ on }">
										<v-icon dark v-on="on">
											attach_money
										</v-icon>
									</template>
									<span>Доступно в платній підписці</span>
								</v-tooltip>
							</template>
							<v-btn block small disabled>
								Аналітика
								<v-icon class="ml-2">equalizer</v-icon>
							</v-btn>
						</v-badge>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</v-card-text>
</template>
<script>
export default {
	computed: {
		jsonLink: function() {
			return `/api/pipeline/data/${this.pipelineId}`;
		},
		csvLink: function() {
			return `/api/pipeline/data/csv/${this.pipelineId}`;
		},
	},
	props: {
		pipelineId: {
			type: String,
			default: '',
		},
		lastParseRowsCount: {
			type: Number,
			default: null,
		},
	},
};
</script>
