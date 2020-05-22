<template>
	<data-rule-layout :cmd="cmd" @mode="switchMode">
		<div slot="description">
			<p>
				Команда використовуєтся для
				<strong>вибору необхідної частини тексту по регулярному виразу</strong>
			</p>
			<p>
				<v-alert type="warning" color="secondary">
					Екранування повинно відбуватися двома символами <code>\\</code> замість
					звичайного одного <code>\</code>
				</v-alert>
			</p>
			<p>
				<v-alert type="info" color="#999">
					<a href="https://javascript.info/regexp-groups#named-groups" target="_blank">
						Детальніша інформація про групування у регулярному виразі
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
			cmd: 'extract_regex',
			code: {
				version: '2.0',
				dataRules: [
					{
						cmd: 'extract_regex',
						bindKey: 'iphone-name',
						toKey: 'iphone-memory',
						regex: '(?<memory>[0-9]+GB)',
						replacement: 'memory',
					},
				],
				commands: [
					{
						cmd: 'openurl',
						link: 'https://sandbox.elasticdata.io/inner-page',
					},
					{
						cmd: 'gettext',
						key: 'iphone-name',
						selector: 'div.card-body h5',
					},
				],
			},
			outputData: [
				{
					'iphone-name': 'iPhone 5 16GB',
					'iphone-memory': '16GB',
				},
			],
		};
	},
	methods: {},
};
</script>
