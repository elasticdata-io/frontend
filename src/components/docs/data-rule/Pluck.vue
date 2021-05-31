<template>
	<data-rule-layout :cmd="cmd" @mode="switchMode" :examples="examples">
		<div slot="description">
			<p>
				Команда використовуєтся для
				<strong>виокремлення данних массива</strong> по ключу. Підтримує функцію об'єднання
				значень <strong>merge: true</strong>
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
			cmd: 'pluck',
			examples: [
				{
					code: {
						version: '2.0',
						dataRules: [
							{
								cmd: 'pluck',
								bindKey: 'pages.links',
							},
						],
						commands: [
							{
								cmd: 'import',
								array: [
									{
										pages: [
											{
												links: [
													{
														link: 'http://1.google.com.ua',
													},
													{
														link: 'http://2.google.com.ua',
													},
												],
											},
											{
												links: [
													{
														link: 'http://1.yandex.com.ua',
													},
													{
														link: 'http://2.yandex.com.ua',
													},
												],
											},
											{
												links: [
													{
														link: 'http://1.yahoo.com.ua',
													},
													{
														link: 'http://2.yahoo.com.ua',
													},
												],
											},
										],
									},
								],
							},
						],
					},
					outputData: [
						{
							pages: [
								{
									link: 'http://1.google.com.ua',
								},
								{
									link: 'http://2.google.com.ua',
								},
								{
									link: 'http://1.yandex.com.ua',
								},
								{
									link: 'http://2.yandex.com.ua',
								},
								{
									link: 'http://1.yahoo.com.ua',
								},
								{
									link: 'http://2.yahoo.com.ua',
								},
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
