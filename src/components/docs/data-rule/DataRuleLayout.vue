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
										<h2 class="headline">Examples</h2>
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
										<div v-if="examples.length > 1">
											<v-tabs
												v-if="examples.length > 1"
												class="elevation-1"
												fixed-tabs
												background-color="indigo"
												dark
												@change="examplesTabsChanged"
											>
												<v-tabs-slider></v-tabs-slider>
												<v-tab
													v-for="(item, index) in examples"
													:key="index"
													:href="`#tab-${index}`"
												>
													Example {{ index + 1 }}
												</v-tab>
												<v-tab-item
													v-for="(item, index) in examples"
													:key="index"
													:value="'tab-' + index"
													transition="fade-transition"
													reverse-transition="fade-transition"
												>
													<code-preview
														:code="example(item.code)"
														:mode="mode"
														:selection-text="cmd"
														:fakeUpdated="fakeUpdated"
													></code-preview>
													<div class="mt-4">
														<h2 class="headline">Data output</h2>
														<code-preview
															:code="
																outputDataExample(item.outputData)
															"
															mode="json"
															:fakeUpdated="fakeUpdated"
														></code-preview>
													</div>
												</v-tab-item>
											</v-tabs>
										</div>
										<div v-else>
											<div v-for="(item, index) in examples" :key="index">
												<code-preview
													:code="example(item.code)"
													:mode="mode"
													:selection-text="cmd"
													:fakeUpdated="fakeUpdated"
													:read-only="false"
												></code-preview>
												<div class="mt-4">
													<h2 class="headline">Data output</h2>
													<code-preview
														:code="outputDataExample(item.outputData)"
														mode="json"
														:fakeUpdated="fakeUpdated"
													></code-preview>
												</div>
											</div>
										</div>
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
import CodePreview from '../../CodePreview';

export default {
	components: {
		DataRulesNavigation,
		CodePreview,
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
	},
	data: () => {
		return {
			mode: 'json',
			fakeUpdated: new Date(),
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
		examplesTabsChanged() {
			this.fakeUpdated = new Date();
		},

		example(code) {
			if (this.mode === 'json') {
				return JSON.stringify(code, null, 4);
			}
			return YAML.stringify(code);
		},
		outputDataExample(outputData) {
			return JSON.stringify(outputData, null, 4);
		},
	},
	props: {
		cmd: {
			type: String,
			required: true,
		},
		examples: {
			type: Array,
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
