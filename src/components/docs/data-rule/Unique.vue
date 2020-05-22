<template>
	<data-rule-layout :cmd="cmd" @mode="switchMode" :examples="examples">
		<div slot="description">
			<p>
				Команда використовуєтся для
				<strong>видалення дублюцчих записів</strong> у масиві
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
			cmd: 'unique',
			examples: [
				{
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
				},
			],
		};
	},
	methods: {},
};
</script>
