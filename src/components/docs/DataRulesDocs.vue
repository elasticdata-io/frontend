<template>
	<v-content>
		<v-container class="fill-height" fluid>
			<v-row>
				<v-col>
					<v-card>
						<v-card-title>
							<span>DATA RULES версії 2.0</span>
						</v-card-title>
						<v-card-text>
							<v-btn depressed small @click="back">
								<v-icon class="mr-2">keyboard_backspace</v-icon>
								Назад
							</v-btn>
							<v-row justify="center" class="pt-6">
								<v-col cols="12" class="search-nav">
									<v-row justify="center">
										<v-col md="3" sm="6" xs="12">
											<v-select
												:items="groups"
												label="фільтрувати по группі"
												solo
												:hide-details="true"
											></v-select>
										</v-col>
										<v-col md="3" sm="6" xs="12">
											<v-text-field
												flat
												solo
												hide-details
												prepend-inner-icon="search"
												label="або шукати"
											></v-text-field>
										</v-col>
									</v-row>
								</v-col>
								<v-col md="7" sm="12" xs="12">
									<v-row no-gutters align="center">
										<v-col
											md="4"
											sm="6"
											v-for="rule in rules"
											v-bind:key="rule.cmd"
										>
											<div class="rule" :disabled="rule.disabled">
												<router-link tag="a" :to="rule.route">
													<span class="command">{{ rule.cmd }}</span>
													<span class="summary">{{ rule.summary }}</span>
												</router-link>
											</div>
										</v-col>
									</v-row>
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
import { DATA_RULES } from '../../store/data-rules/getters';
import { mapGetters } from 'vuex';

export default {
	data: () => ({
		groups: ['всі', 'хочу змінити текст', 'хочу вибрати текст', 'маніпуляція ключами'],
	}),
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
<style lang="less" scoped>
.search-nav {
	text-align: center;
	background: #f0f0f0;
}
.rule {
	padding: 10px;

	&[disabled='disabled'] {
		pointer-events: none;
		> a {
			color: gray;

			.command {
				color: gray;
			}
		}
	}

	> a {
		border-radius: 5px;
		background-color: #fafafa;
		height: 8em;
		display: block;
		padding: 1em;
		color: #333333;
		text-decoration: none;

		.command {
			white-space: nowrap;
			overflow: hidden;
			-ms-text-overflow: ellipsis;
			-o-text-overflow: ellipsis;
			text-overflow: ellipsis;
			display: block;
			margin: 0 0 15px 0;
			color: #0066aa;
			text-transform: uppercase;
		}

		.summary {
			display: block;
			line-height: 1.5em;
		}
	}
}
</style>
