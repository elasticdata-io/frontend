<template>
	<v-content>
		<v-container>
			<v-row>
				<v-col>
					<v-btn
						small
						elevation="1"
						:to="{ name: 'pipeline.edit', params: { id: id, state: 'edit' } }"
					>
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
						</v-card-title>
						<v-card-text>
							<v-divider></v-divider>
							<router-view></router-view>
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
import { CURRENT_PIPELINE } from '@/store/pipeline/getters';
import { FETCH_PIPELINE } from '@/store/pipeline/actions';

export default {
	components: {},
	data() {
		return {
			search: null,
		};
	},
	computed: {
		...mapGetters('pipeline', {
			pipeline: CURRENT_PIPELINE,
		}),
	},
	methods: {},
	created() {
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
<style lang="less">
.data-view {
	&.v-data-table td {
		font-size: 10px;
	}
}
</style>
