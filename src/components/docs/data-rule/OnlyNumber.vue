<template>
	<v-content>
		<v-container class="fill-height" fluid>
			<v-row>
				<v-col>
					<v-card>
						<v-card-title>
							<span>ONLY_NUMBER</span>
						</v-card-title>
						<v-card-text>
							<v-btn depressed small @click="back">
								<v-icon class="mr-2">keyboard_backspace</v-icon>
								Назад
							</v-btn>
							<v-row class="pt-6">
								<v-col cols="5">
									sss
								</v-col>
								<v-col md="6">
									<ul>
										<li v-for="rule in rules" v-bind:key="rule.cmd">
											<router-link tag="a" :to="rule.route">
												{{ rule.cmd }}
											</router-link>
										</li>
									</ul>
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
import { mapGetters } from 'vuex';
import { DATA_RULES } from '../../../store/data-rules/getters';

export default {
	computed: {
		...mapGetters('dataRules', {
			rules: DATA_RULES,
		}),
	},
	methods: {
		back() {
			this.$router.back();
		},
	},
};
</script>
