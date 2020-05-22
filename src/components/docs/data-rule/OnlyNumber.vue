<template>
	<data-rule-layout :cmd="cmd" @mode="switchMode">
		<div slot="description">
			<p>
				Команда використовуєтся для
				<strong>обрізання НЕ ЧИСЛОВИХ</strong> символів в тексті
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
			cmd: 'only_number',
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
	methods: {},
};
</script>
