<template>
	<data-rule-layout :cmd="cmd" @mode="switchMode">
		<div slot="description">
			<p>
				Команда використовуєтся для
				<strong>ЗАМІНИ в тексті за РЕГУЛЯРНИМ ВИРАЗОМ</strong>
			</p>
			<p>
				<v-alert type="warning" color="secondary">
					Екранування повинно відбуватися двома символами <code>\\</code> замість
					звичайного одного <code>\</code>
				</v-alert>
			</p>
			<p>
				<v-alert type="info" color="#999">
					<a href="https://javascript.info/regexp-groups" target="_blank">
						Детальніша інформація про функцію заміни
					</a>
				</v-alert>
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
			cmd: 'replace_regex',
			code: {
				version: '2.0',
				dataRules: [
					{
						cmd: 'replace_regex',
						bindKey: 'phones',
						toKey: 'phones-replaced',
						searchRegex: '\\+38([0-9]{3})',
						replaceValue: '+38($1)',
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
					'phones-replaced': '+38(097)-123-50-17,+38(050)-333-11-22,+38(097)-123-50-17',
				},
			],
		};
	},
	methods: {},
};
</script>
