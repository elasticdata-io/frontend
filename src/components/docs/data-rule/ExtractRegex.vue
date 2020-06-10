<template>
	<data-rule-layout :cmd="cmd" @mode="switchMode" :examples="examples">
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
			cmd: 'extract_regex',
			examples: [
				{
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
				},
			],
		};
	},
	methods: {},
};
</script>
