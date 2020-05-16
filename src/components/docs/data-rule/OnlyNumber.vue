<template>
	<v-content class="data-rule-command">
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
									<div class="head">
										<h2 class="headline">Description</h2>
										<p>
											Команда використовуєтся для
											<strong>обрізання НЕ ЧИСЛОВИХ</strong> символів в тексті
										</p>
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
										<code-preview
											:code="example"
											:mode="mode"
											:selection-text="cmd"
										></code-preview>
									</div>
									<div class="head">
										<h2 class="headline">Data output</h2>
										<code-preview :code="outputData" mode="json"></code-preview>
									</div>
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
import * as YAML from 'json-to-pretty-yaml';
import { mapGetters } from 'vuex';
import { DATA_RULES } from '../../../store/data-rules/getters';
import CodePreview from '../../CodePreview';

export default {
	components: {
		CodePreview,
	},
	computed: {
		...mapGetters('dataRules', {
			rules: DATA_RULES,
		}),
		example: function() {
			if (this.mode === 'json') {
				return JSON.stringify(this.code, null, 4);
			}
			return YAML.stringify(this.code);
		},
	},
	data: () => {
		return {
			editor: null,
			cmd: 'only_number',
			mode: 'json',
			code: {
				version: '2.0',
				dataRules: [
					{
						cmd: 'only_number',
						bindKey: 'price',
						toKey: 'price-only-number',
					},
				],
				commands: [
					{
						cmd: 'openurl',
						link: 'https://sandbox.elasticdata.io/price',
					},
					{
						cmd: 'gettext',
						key: 'price',
						selector: 'div.price',
					},
				],
			},
			outputData: [{ price: 'Home\nprice: 540$', 'price-only-number': '540' }],
		};
	},
	methods: {
		back() {
			this.$router.back();
		},
		switchMode() {
			if (this.mode === 'json') {
				this.mode = 'yaml';
			} else if (this.mode === 'yaml') {
				this.mode = 'json';
			}
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
}
</style>
