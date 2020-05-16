<template>
	<data-rule-layout :cmd="cmd">
		<div class="head">
			<h2 class="headline">Description</h2>
			<p>
				Команда використовуєтся для
				<strong>ЗАМІНА в тексті за РЕГУЛЯРНИМ ВИРАЗОМ</strong>
			</p>
			<p>
				<v-alert type="warning" color="secondary">
					Екранування повинно відбуватися двома символами <code>\\</code> замість
					звичайного одного <code>\</code>
				</v-alert>
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
			cmd: 'replace_regex',
			code: {
				version: '2.0',
				dataRules: [
					{
						cmd: 'replace_regex',
						bindKey: 'phones',
						toKey: 'phones-replaced',
						searchRegex: '\\+38([0-9]{3})',
						replaceValue: '+38($1)',
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
					phones: '+38097-123-50-17,+38050-333-11-22',
					'phones-replaced': '+38(097)-123-50-17,+38(050)-333-11-22',
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
