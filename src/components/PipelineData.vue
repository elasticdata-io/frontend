<template>
	<v-card-text class="pt-1">
		<v-row>
			<v-col class="pt-0">
				<v-row>
					<v-col xl="6" lg="6" md="12" sm="12" xs="12">
						<v-btn
							class="mr-4"
							icon
							:to="{ name: 'pipeline.data-view', params: $route.params }"
						>
							<v-tooltip bottom>
								<template v-slot:activator="{ on }">
									<v-icon v-on="on">view_list</v-icon>
								</template>
								<span>Переглянути документи</span>
							</v-tooltip>
						</v-btn>
						<v-menu offset-y>
							<template v-slot:activator="{ on }">
								<v-btn class="mr-4" v-on="on" icon>
									<v-tooltip bottom>
										<template v-slot:activator="{ on }">
											<v-icon v-on="on">get_app</v-icon>
										</template>
										<span>Завантажити документи</span>
									</v-tooltip>
								</v-btn>
							</template>
							<v-list>
								<v-list-item :href="jsonLink" target="_blank">
									<v-list-item-title>
										<v-icon class="ml-2">get_app</v-icon>
										json
									</v-list-item-title>
								</v-list-item>
								<v-list-item :href="csvLink" target="_blank">
									<v-list-item-title>
										<v-icon class="ml-2">get_app</v-icon>
										csv
									</v-list-item-title>
								</v-list-item>
								<v-list-item disabled>
									<v-list-item-title>
										<v-icon disabled class="ml-2">get_app</v-icon>
										xls
									</v-list-item-title>
								</v-list-item>
							</v-list>
						</v-menu>
						<v-menu offset-y>
							<template v-slot:activator="{ on }">
								<v-btn icon v-on="on">
									<v-tooltip bottom>
										<template v-slot:activator="{ on }">
											<v-icon v-on="on">link</v-icon>
										</template>
										<span>Копіювати посилання на документи</span>
									</v-tooltip>
								</v-btn>
							</template>
							<v-list>
								<v-list-item @click="copyJsonLink">
									<v-list-item-title>
										<v-icon class="ml-2">link</v-icon>
										json
									</v-list-item-title>
								</v-list-item>
								<v-list-item @click="copyCsvLink">
									<v-list-item-title>
										<v-icon class="ml-2">link</v-icon>
										csv
									</v-list-item-title>
								</v-list-item>
								<v-list-item disabled>
									<v-list-item-title>
										<v-icon disabled class="ml-2">link</v-icon>
										xls
									</v-list-item-title>
								</v-list-item>
							</v-list>
						</v-menu>
					</v-col>
					<v-col xl="6" lg="6" md="12" sm="12" xs="12">
						<v-badge color="purple" right overlap style="width: 100%;">
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
				<v-divider></v-divider>
				<v-row>
					<v-col>
						<span class="headline">Всього документів: {{ lastParseRowsCount }}</span>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</v-card-text>
</template>
<script>
import copy from 'copy-to-clipboard';
import { SET_SNACK_MESSAGE } from '../store/mutations';

export default {
	computed: {
		jsonLink: function() {
			const port = location.port ? `:${location.port}` : '';
			return `${location.protocol}//${location.hostname}${port}/api/pipeline/data/${
				this.pipelineId
			}`;
		},
		csvLink: function() {
			return `${location.protocol}//${location.hostname}:${
				location.port
			}/api/pipeline/data/csv/${this.pipelineId}`;
		},
	},
	methods: {
		copyJsonLink() {
			copy(this.jsonLink);
			this.$store.commit(SET_SNACK_MESSAGE, `Посилання скопійовано в буфер обміну`);
		},
		copyCsvLink() {
			copy(this.csvLink);
			this.$store.commit(SET_SNACK_MESSAGE, `Посилання скопійовано в буфер обміну`);
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
