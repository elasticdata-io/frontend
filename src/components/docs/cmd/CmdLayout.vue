<template>
	<v-content class="doc-command">
		<v-container class="fill-height" fluid>
			<v-row>
				<v-col>
					<v-card>
						<v-card-title>
							<span class="headline text-uppercase">{{ cmd }}</span>
						</v-card-title>
						<v-card-text>
							<v-btn depressed small @click="back">
								<v-icon class="mr-2">keyboard_backspace</v-icon>
								Назад
							</v-btn>
							<v-row class="pt-6">
								<v-col xl="6" lg="8" md="7" sm="12" cols="12" class="left">
									<!--									<slot></slot>-->
									<div class="head">
										<h2 class="headline">Description</h2>
										<slot name="description"></slot>
									</div>
									<div class="head">
										<h2 class="headline">Properties</h2>
										<ul class="properties">
											<li
												class="property"
												v-bind:key="index"
												v-for="(prop, index) in command.props"
											>
												<v-tooltip bottom>
													<template v-slot:activator="{ on, attrs }">
														<code class="prop-name" v-on="on">{{
															prop.name
														}}</code>
														<v-icon class="ml-1" small v-on="on"
															>help</v-icon
														>
													</template>
													<span>{{
														prop.summary ||
															'Property not have any description'
													}}</span>
												</v-tooltip>
												<ul class="property-params">
													<li>type: {{ prop.type }}</li>
													<li>required: {{ prop.required }}</li>
													<li>default: {{ prop.default }}</li>
												</ul>
											</li>
										</ul>
									</div>

									<div class="head" v-if="examples.length">
										<h2 class="headline">Examples</h2>
										<div class="mb-2">
											<v-btn
												:color="mode === 'yaml' ? 'primary' : 'default'"
												x-small
												@click="switchMode"
												>yaml</v-btn
											>
											<v-btn
												:color="mode === 'json' ? 'primary' : 'default'"
												x-small
												class="ml-2"
												@click="switchMode"
												>json</v-btn
											>
										</div>
										<div v-if="examples.length > 1">
											<v-tabs
												v-if="examples.length > 1"
												class="elevation-1"
												fixed-tabs
												background-color="indigo"
												dark
												@change="examplesTabsChanged"
											>
												<v-tabs-slider></v-tabs-slider>
												<v-tab
													v-for="(item, index) in examples"
													:key="index"
													:href="`#tab-${index}`"
												>
													<span v-if="item.name">{{ item.name }}</span>
													<span v-else>Example {{ index + 1 }}</span>
												</v-tab>
												<v-tab-item
													v-for="(item, index) in examples"
													:key="index"
													:value="'tab-' + index"
													transition="fade-transition"
													reverse-transition="fade-transition"
												>
													<code-preview
														:code="example(item.code)"
														:mode="mode"
														:selection-text="cmd"
														:fakeUpdated="fakeUpdated"
													></code-preview>
													<div v-if="item.outputData.length" class="mt-4">
														<h2 class="headline">Data output</h2>
														<code-preview
															:code="
																outputDataExample(item.outputData)
															"
															mode="json"
															:fakeUpdated="fakeUpdated"
														></code-preview>
													</div>
												</v-tab-item>
											</v-tabs>
										</div>
										<div v-else>
											<div v-for="(item, index) in examples" :key="index">
												<code-preview
													:code="example(item.code)"
													:mode="mode"
													:selection-text="cmd"
													:fakeUpdated="fakeUpdated"
												></code-preview>
												<div v-if="item.outputData.length" class="mt-4">
													<h2 class="headline">Data output</h2>
													<code-preview
														:code="outputDataExample(item.outputData)"
														mode="json"
														:fakeUpdated="fakeUpdated"
													></code-preview>
												</div>
											</div>
										</div>
									</div>
								</v-col>
								<v-col xl="5" lg="3" md="4" sm="12" cols="12">
									<commands-navigation></commands-navigation>
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
import * as YAML from 'json-to-pretty-yaml';
import CommandsNavigation from '../CommandsNavigation';
import { mapGetters } from 'vuex';
import { COMMAND_BY_CMD } from '../../../store/commands/getters';
import CodePreview from '../../CodePreview';

export default {
	components: {
		CommandsNavigation,
		CodePreview,
	},
	computed: {
		...mapGetters('commands', {
			COMMAND_BY_CMD: COMMAND_BY_CMD,
		}),
		command: function() {
			if (!this.cmd) {
				return {};
			}
			return this.COMMAND_BY_CMD(this.cmd);
		},
	},
	data: () => {
		return {
			mode: 'json',
			fakeUpdated: new Date(),
		};
	},
	methods: {
		back() {
			this.$router.push({ name: 'docs.commands' });
		},
		switchMode() {
			if (this.mode === 'json') {
				this.mode = 'yaml';
			} else if (this.mode === 'yaml') {
				this.mode = 'json';
			}
			this.$emit('mode', this.mode);
		},
		examplesTabsChanged() {
			this.fakeUpdated = new Date();
		},

		example(code) {
			if (this.mode === 'json') {
				return JSON.stringify(code, null, 4);
			}
			return YAML.stringify(code);
		},
		outputDataExample(outputData) {
			return JSON.stringify(outputData, null, 4);
		},
	},
	props: {
		cmd: {
			type: String,
			required: true,
		},
		examples: {
			type: Array,
			required: true,
			default: () => [],
		},
	},
};
</script>
<style lang="less">
@import '../../../less/var';

.doc-command {
	ul.properties {
		padding: 20px;
		list-style: none;

		li.property {
			font-family: 'Ubuntu Mono', monospace;
			text-indent: -1.1rem;
			margin: 0 0 10px;

			&:first-child {
				margin-top: 0;
			}

			&:before {
				content: '•';
				margin: 0 0.5rem 0 0;
				color: #ff8a00;
			}

			.prop-name {
				padding: 0.1rem 0.3rem 0.2rem;
				background: #fff6ea;
				overflow-wrap: break-word;
				word-wrap: break-word;
				-webkit-box-decoration-break: clone;
				box-decoration-break: clone;
				border-radius: 0.2rem;
				font-size: 120%;
				display: inline;
				font-family: 'Ubuntu Mono', monospace;
				box-shadow: none;
				color: rgba(46, 47, 62, 0.9);
			}

			ul.property-params {
				margin-left: 15px;
			}
		}
	}

	.head {
		padding-bottom: 25px;

		h2.headline {
			font-family: @ubuntu-mono;
			margin-bottom: 10px;
		}
	}

	.left {
		border-right: 1px solid rgba(0, 0, 0, 0.12);
	}
}
</style>
