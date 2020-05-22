<template>
	<data-rule-layout :cmd="cmd" @mode="switchMode">
		<div slot="description">
			<p>
				Команда використовуєтся для
				<strong>формування строки з масиву</strong>
			</p>
		</div>
		<div slot="example">
			<code-preview :code="example" :mode="mode" :selection-text="cmd"></code-preview>
		</div>
		<div slot="example-output">
			<code-preview :code="outputDataExample" mode="json"></code-preview>
		</div>
	</data-rule-layout>
</template>
<script>
import CodePreview from '../../CodePreview';
import DataRuleLayout from './DataRuleLayout';
import DataRuleMixin from './DataRuleMixin';

export default {
	mixins: [DataRuleMixin],
	components: {
		DataRuleLayout,
		CodePreview,
	},
	computed: {},
	data: () => {
		return {
			cmd: 'join',
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
					},
					{
						cmd: 'join',
						bindKey: 'phones',
						toKey: 'phones-join',
						separator: ',',
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
					'phones-join': '+38097-123-50-17,+38050-333-11-22',
				},
			],
		};
	},
	methods: {},
};
</script>
