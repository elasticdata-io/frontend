<template>
	<data-rule-layout :cmd="cmd">
		<div class="head">
			<h2 class="headline">Description</h2>
			<p>
				Команда використовуєтся для
				<strong>ЗАМІНИ будьяких символів</strong> в тексті
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
			cmd: 'unique',
			code: {
				version: '2.0',
				dataRules: [
					{
						cmd: 'split',
						bindKey: 'phones',
						delimiter: ',',
					},
					{
						cmd: 'unique',
						bindKey: 'phones',
						toKey: 'phones-unique',
					},
				],
				commands: [
					{
						cmd: 'openurl',
						link: 'https://sandbox.elasticdata.io/phones',
					},
					{
						cmd: 'gettext',
						key: 'phones',
						selector: 'div.phones',
					},
				],
			},
			outputData: [
				{
					phones: ['+38097-123-50-17', '+38050-333-11-22', '+38097-123-50-17'],
					'phones-unique': ['+38097-123-50-17', '+38050-333-11-22'],
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
