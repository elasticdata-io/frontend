<template>
	<data-rule-layout :cmd="cmd" @mode="switchMode" :examples="examples">
		<div slot="description">
			<p>
				Команда використовуєтся для
				<strong>обрізання НЕ ЧИСЛОВИХ</strong> символів в тексті
			</p>
		</div>
	</data-rule-layout>
</template>
<script>
import DataRuleLayout from './DataRuleLayout';
import CmdDocMixin from '../CmdDocMixin';

export default {
	mixins: [CmdDocMixin],
	components: {
		DataRuleLayout,
	},
	computed: {},
	data: () => {
		return {
			cmd: 'only_number',
			examples: [
				{
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
				},
			],
		};
	},
	methods: {},
};
</script>
