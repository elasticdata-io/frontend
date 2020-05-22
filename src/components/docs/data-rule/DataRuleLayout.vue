<template>
	<v-content class="data-rule-command">
		<v-container class="fill-height" fluid>
			<v-row>
				<v-col>
					<v-card>
						<v-card-title>
							<span class="headline text-uppercase">{{ cmd }}</span>
						</v-card-title>
						<v-card-text>
							<v-btn depressed small @click="back">
								<v-icon class="mr-2">keyboard_backspace</v-icon>
								Назад
							</v-btn>
							<v-row class="pt-6">
								<v-col xl="6" lg="8" md="7" sm="12" cols="12" class="left">
									<!--									<slot></slot>-->
									<div class="head">
										<h2 class="headline">Description</h2>
										<slot name="description"></slot>
									</div>
									<div class="head">
										<h2 class="headline">Support value types</h2>
										<ul>
											<li
												v-bind:key="index"
												v-for="(supportTypes,
												index) in dataRule.supportTypes"
											>
												<strong>{{ supportTypes.name }}</strong>
											</li>
										</ul>
									</div>
									<div class="head">
										<h2 class="headline">Example</h2>
										<div class="mb-2">
											<v-btn
												:color="mode === 'yaml' ? 'primary' : 'default'"
												x-small
												@click="switchMode"
												>yaml</v-btn
											>
											<v-btn
												:color="mode === 'json' ? 'primary' : 'default'"
												x-small
												class="ml-2"
												@click="switchMode"
												>json</v-btn
											>
										</div>
										<slot name="example"></slot>
									</div>
									<div class="head">
										<h2 class="headline">Data output</h2>
										<slot name="example-output"></slot>
									</div>
								</v-col>
								<v-col xl="5" lg="3" md="4" sm="12" cols="12">
									<data-rules-navigation></data-rules-navigation>
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
import * as YAML from 'json-to-pretty-yaml';
import DataRulesNavigation from '../DataRulesNavigation';
import { mapGetters } from 'vuex';
import { DATA_RULE_BY_CMD } from '../../../store/data-rules/getters';

export default {
	components: {
		DataRulesNavigation,
	},
	computed: {
		...mapGetters('dataRules', {
			DATA_RULE_BY_CMD: DATA_RULE_BY_CMD,
		}),
		dataRule: function() {
			if (!this.cmd) {
				return {};
			}
			return this.DATA_RULE_BY_CMD(this.cmd);
		},
		example: function() {
			if (this.mode === 'json') {
				return JSON.stringify(this.code, null, 4);
			}
			return YAML.stringify(this.code);
		},
		outputDataExample: function() {
			return JSON.stringify(this.outputData, null, 4);
		},
	},
	data: () => {
		return {
			mode: 'json',
		};
	},
	methods: {
		back() {
			this.$router.push({ name: 'docs.data-rules' });
		},
		switchMode() {
			if (this.mode === 'json') {
				this.mode = 'yaml';
			} else if (this.mode === 'yaml') {
				this.mode = 'json';
			}
			this.$emit('mode', this.mode);
		},
	},
	props: {
		cmd: {
			type: String,
			required: true,
		},
	},
};
</script>
<style lang="less">
@import '../../../less/var';

.data-rule-command {
	.head {
		padding-bottom: 25px;

		h2.headline {
			font-family: @ubuntu-mono;
			margin-bottom: 10px;
		}
	}

	.left {
		border-right: 1px solid rgba(0, 0, 0, 0.12);
	}
}
</style>
