<template>
	<data-rule-layout :cmd="cmd" @mode="switchMode" :examples="examples">
		<div slot="description">
			<p>
				Команда використовуєтся для
				<strong>формування строки з масиву</strong>
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
			cmd: 'join',
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
				},
			],
		};
	},
	methods: {},
};
</script>
