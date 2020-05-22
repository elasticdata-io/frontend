<template>
	<data-rule-layout :cmd="cmd" @mode="switchMode" :examples="examples">
		<div slot="description">
			<p>
				Команда використовуєтся для
				<strong>ЗАМІНИ будьяких символів</strong> в тексті
			</p>
		</div>
	</data-rule-layout>
</template>
<script>
import DataRuleLayout from './DataRuleLayout';
import DataRuleMixin from './DataRuleMixin';

export default {
	mixins: [DataRuleMixin],
	components: {
		DataRuleLayout,
	},
	computed: {},
	data: () => {
		return {
			mode: 'json',
			cmd: 'replace',
			examples: [
				{
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
				},
			],
		};
	},
	methods: {},
};
</script>
