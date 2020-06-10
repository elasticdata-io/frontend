<template>
	<data-rule-layout :cmd="cmd" @mode="switchMode" :examples="examples">
		<div slot="description">
			<p>
				Команда використовуєтся для
				<strong>розбиття тексту на МАССИВ</strong> строк
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
			cmd: 'split',
			examples: [
				{
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
							'phones-array': [
								'+38097-123-50-17',
								'+38050-333-11-22',
								'+38097-123-50-17',
							],
						},
					],
				},
			],
		};
	},
	methods: {},
};
</script>
