<template>
	<data-rule-layout :cmd="cmd" @mode="switchMode">
		<div slot="description">
			<p>
				Команда використовуєтся для
				<strong>обрізання ПУСТИХ</strong> символів по краям тексту
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
	methods: {},
};
</script>
