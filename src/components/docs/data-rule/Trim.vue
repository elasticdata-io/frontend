<template>
	<data-rule-layout :cmd="cmd">
		<div class="head">
			<h2 class="headline">Description</h2>
			<p>
				Команда використовуєтся для
				<strong>обрізання ПУСТИХ</strong> символів по краям тексту
			</p>
		</div>
		<div class="head">
			<h2 class="headline">Example</h2>
			<div class="mb-2">
				<v-btn :color="mode === 'yaml' ? 'primary' : 'default'" x-small @click="switchMode"
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
			<code-preview :code="example" :mode="mode" :selection-text="cmd"></code-preview>
		</div>
		<div class="head">
			<h2 class="headline">Data output</h2>
			<code-preview :code="outputDataExample" mode="json"></code-preview>
		</div>
	</data-rule-layout>
</template>
<script>
import * as YAML from 'json-to-pretty-yaml';
import CodePreview from '../../CodePreview';
import DataRuleLayout from './DataRuleLayout';

export default {
	components: {
		DataRuleLayout,
		CodePreview,
	},
	computed: {
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
			cmd: 'trim',
			code: {
				version: '2.0',
				dataRules: [
					{
						cmd: 'trim',
						bindKey: 'text-with-spaces',
						toKey: 'text-without-spaces',
					},
				],
				commands: [
					{
						cmd: 'openurl',
						link: 'https://sandbox.elasticdata.io/text-with-spaces',
					},
					{
						cmd: 'gethtml',
						key: 'text-with-spaces',
						selector: 'div.text-with-spaces',
					},
				],
			},
			outputData: [
				{
					'text-with-spaces': '  Sat May 16 2020 19:30:42  ',
					'text-without-spaces': 'Sat May 16 2020 19:30:42',
				},
			],
		};
	},
	methods: {
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
