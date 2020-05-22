<template>
	<data-rule-layout :cmd="cmd" @mode="switchMode">
		<div slot="description">
			<p>
				Команда використовуєтся для
				<strong>розбиття тексту на МАССИВ</strong> строк
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
			cmd: 'split',
			code: {
				version: '2.0',
				dataRules: [
					{
						cmd: 'split',
						bindKey: 'phones',
						toKey: 'phones-array',
						delimiter: ',',
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
					phones: '+38097-123-50-17,+38050-333-11-22,+38097-123-50-17',
					'phones-array': ['+38097-123-50-17', '+38050-333-11-22', '+38097-123-50-17'],
				},
			],
		};
	},
	methods: {},
};
</script>
