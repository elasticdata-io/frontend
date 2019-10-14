<template>
	<v-content>
		<v-container>
			<v-row>
				<v-col>
					<v-btn :to="{ name: 'pipeline.edit', params: { id: id, state: 'edit' } }">
						<v-icon class="mr-2">keyboard_backspace</v-icon>
						назад до {{ pipeline.key }}
					</v-btn>
				</v-col>
			</v-row>
			<v-row>
				<v-col>
					<v-card>
						<v-card-title>
							{{ pipeline.key }}
							<v-spacer></v-spacer>
							<v-text-field
								v-model="search"
								append-icon="search"
								label="Пошук"
								single-line
								hide-details
							></v-text-field>
						</v-card-title>
						<v-card-text>
							<v-data-table
								:headers="headers"
								:items="items"
								:items-per-page="10"
								:search="search"
								class="elevation-1"
							></v-data-table>
						</v-card-text>
						<v-card-actions>
							<v-row class="pr-5" justify="end"> </v-row>
						</v-card-actions>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-content>
</template>
<script>
import { mapGetters } from 'vuex';
import { CURRENT_PIPELINE, CURRENT_PIPELINE_LAST_DATA } from '../store/pipeline/getters';
import { FETCH_PIPELINE, FETCH_PIPELINE_LAST_DATA } from '../store/pipeline/actions';

export default {
	components: {},
	data() {
		return {
			search: null,
		};
	},
	computed: {
		...mapGetters('pipeline', {
			lastData: CURRENT_PIPELINE_LAST_DATA,
		}),
		...mapGetters('pipeline', {
			pipeline: CURRENT_PIPELINE,
		}),
		headers: function() {
			const lastData = this.lastData;
			if (!lastData) {
				return [];
			}
			let columns = [];
			lastData.map(x => {
				const keys = Object.keys(x);
				columns = columns.concat(keys);
			});
			columns = [...new Set(columns)].map(x => {
				return {
					value: x,
					text: x.toUpperCase(),
					sortable: true,
				};
			});
			return columns;
		},
		items: function() {
			const lastData = this.lastData;
			if (!lastData) {
				return [];
			}
			return lastData;
		},
	},
	methods: {},
	created() {
		this.$store.dispatch(`pipeline/${FETCH_PIPELINE_LAST_DATA}`, { id: this.id });
		this.$store.dispatch(`pipeline/${FETCH_PIPELINE}`, { id: this.id });
	},
	props: {
		id: {
			required: false,
			type: String,
		},
	},
};
</script>
