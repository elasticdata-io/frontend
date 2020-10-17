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
										<h2 class="headline mb-6">
											{{ $t('DOC.CMD.DESCRIPTION') }}
										</h2>
										<slot name="description"></slot>
									</div>
									<div class="head">
										<h2 class="headline mb-6">
											{{ $t('DOC.CMD.PROPERTIES') }}
										</h2>
										<v-expansion-panels>
											<v-expansion-panel
												v-for="(prop, index) in command.props"
												v-bind:key="index"
											>
												<v-expansion-panel-header>
													<div class="property">
														<v-tooltip bottom>
															<template v-slot:activator="{ on }">
																<span v-on="on">{{
																	prop.name
																}}</span>
															</template>
															<span>
																{{
																	displayPropSummary(prop.summary)
																}}
															</span>
														</v-tooltip>
														<code v-if="prop.required" class="code ml-2"
															>required</code
														>
													</div>
												</v-expansion-panel-header>
												<v-expansion-panel-content>
													<ul class="property-params">
														<li>
															<code class="code">type</code>:
															<code class="code right-code">{{
																displayPropType(prop.type)
															}}</code>
														</li>
														<li>
															<code class="code">required</code>:
															<code class="code right-code">{{
																prop.required
															}}</code>
														</li>
														<li>
															<code class="code">default</code>:
															<code class="code right-code">{{
																displayPropDefault(prop.default)
															}}</code>
														</li>
													</ul>
												</v-expansion-panel-content>
											</v-expansion-panel>
										</v-expansion-panels>
									</div>

									<div class="head" v-if="examples.length">
										<h2 class="headline">{{ $t('DOC.CMD.EXAMPLES') }}</h2>
										<div class="mb-2 text-right">
											<v-btn
												:color="mode === 'yaml' ? 'primary' : 'default'"
												x-small
												depressed
												@click="switchMode"
												>yaml</v-btn
											>
											<v-btn
												:color="mode === 'json' ? 'primary' : 'default'"
												x-small
												depressed
												class="ml-2"
												@click="switchMode"
												>json</v-btn
											>
										</div>
										<v-expansion-panels v-model="panel" multiple>
											<v-expansion-panel
												v-for="(item, index) in examples"
												:key="index"
												@click="examplesTabsChanged"
											>
												<v-expansion-panel-header>
													<div class="example-title">
														<span>{{ index + 1 }}. </span>
														<span v-if="item.name">{{
															item.name
														}}</span>
														<span v-else>Example {{ index + 1 }}</span>
													</div>
												</v-expansion-panel-header>
												<v-expansion-panel-content>
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
												</v-expansion-panel-content>
											</v-expansion-panel>
										</v-expansion-panels>
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
import { COMMAND_BY_CMD } from '@/store/commands/getters';
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
			panel: [],
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
		displayPropType(type) {
			if (Array.isArray(type)) {
				return type.map(x => x.toLowerCase()).join(' | ');
			}
			return type.toLowerCase();
		},
		displayPropSummary(summary) {
			summary = summary || 'DOC.CMD.NOT_HAVE_ANY_DESCRIPTION';
			return this.$t(summary);
		},
		displayPropDefault(def) {
			if (def === '') {
				return `empty string`;
			}
			if (def === null) {
				return `null`;
			}
			if (def === undefined) {
				return `undefined`;
			}
			return def;
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
	code.code {
		background: #fff6ea;
		color: rgb(46, 47, 62);
		overflow-wrap: break-word;
		word-wrap: break-word;
		-webkit-box-decoration-break: clone;
		box-decoration-break: clone;
		padding: 0.1rem 0.3rem 0.2rem;
		border-radius: 0.2rem;
		font-family: Monaco, 'Ubuntu Mono', monospace;
		box-shadow: none;
		margin-right: 3px;

		&.right-code {
			background: #eaf8ff;
			margin-left: 3px;
		}
	}

	.property {
		span {
			font-family: Monaco, 'Ubuntu Mono', monospace;
		}

		&:before {
			content: '•';
			margin: 0 0.5rem 0 0;
			color: #ff8a00;
		}
	}

	.property-params {
		margin: 0;
		list-style: none;
		li {
			padding: 3px 0;
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

	.example-title {
		text-transform: capitalize;

		span {
			padding: 2px 6px 4px 6px;
			border-radius: 6px;
			font-family: 'Ubuntu Mono', monospace;
			font-size: 18px;
		}
	}
}
</style>
