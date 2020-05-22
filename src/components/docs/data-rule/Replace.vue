<template>
	<data-rule-layout :cmd="cmd" @mode="switchMode">
		<div slot="description">
			<p>
				Команда використовуєтся для
				<strong>ЗАМІНИ будьяких символів</strong> в тексті
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
			mode: 'json',
			cmd: 'replace',
			code: {
				version: '2.0',
				dataRules: [
					{
						cmd: 'replace',
						bindKey: 'price',
						toKey: 'price-replaced',
						oldValue: '$',
						newValue: ' dollars',
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
			outputData: [
				{
					price: 'price: 540$',
					'price-replaced': 'price: 540 dollars',
				},
			],
		};
	},
	methods: {},
};
</script>
