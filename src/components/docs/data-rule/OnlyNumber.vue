<template>
	<v-content>
		<v-container class="fill-height" fluid>
			<v-row>
				<v-col>
					<v-card>
						<v-card-title>
							<span>ONLY_NUMBER</span>
						</v-card-title>
						<v-card-text>
							<v-btn depressed small @click="back">
								<v-icon class="mr-2">keyboard_backspace</v-icon>
								Назад
							</v-btn>
							<v-row class="pt-6">
								<v-col cols="5">
									<h2 class="headline">Наприклад</h2>
									<pre
										class="json"
										id="json-editor"
									><code>{{ example }}</code></pre>
								</v-col>
								<v-col md="6">
									<ul>
										<li v-for="rule in rules" v-bind:key="rule.cmd">
											<router-link tag="a" :to="rule.route">
												{{ rule.cmd }}
											</router-link>
										</li>
									</ul>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-content>
</template>
<script>
import * as ace from 'brace';
import 'brace/theme/monokai';
import 'brace/ext/searchbox';
import * as YAML from 'json-to-pretty-yaml';
import 'brace/mode/yaml';
import 'brace/mode/json';
import { mapGetters } from 'vuex';
import { DATA_RULES } from '../../../store/data-rules/getters';

export default {
	computed: {
		...mapGetters('dataRules', {
			rules: DATA_RULES,
		}),
		example: function() {
			if (this.mode === 'json') {
				return this.code;
			}
			return YAML.stringify(this.code);
		},
	},
	data: () => {
		return {
			editor: null,
			cmd: 'only_number',
			mode: 'yaml',
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
						selector: 'body',
					},
				],
			},
		};
	},
	methods: {
		back() {
			this.$router.back();
		},
		setSelection() {
			const editor = this.editor;
			const startRange = editor.find(this.cmd);
			const endRange = editor.find('commands');
			startRange.start.column = 0;
			startRange.end.row = endRange.start.row - 1;
			startRange.end.column = Number.MAX_VALUE;
			editor.selection.setRange(startRange);
		},
	},
	created() {
		setTimeout(() => {
			const editor = (this.editor = ace.edit('json-editor'));
			editor.setTheme('ace/theme/monokai');
			editor.getSession().setMode(`ace/mode/${this.mode}`);
			this.setSelection();
		});
	},
};
</script>
<style lang="less">
#json-editor {
	height: 250px;

	code {
		visibility: hidden;
	}

	.ace_content * {
		font-family: Monaco, 'Ubuntu Mono', monospace;
	}
}
</style>
