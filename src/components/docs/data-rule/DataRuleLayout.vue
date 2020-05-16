<template>
	<v-content class="data-rule-command">
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
								<v-col cols="5" class="left">
									<slot></slot>
								</v-col>
								<v-col md="6">
									<data-rules-navigation></data-rules-navigation>
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
import DataRulesNavigation from '../DataRulesNavigation';

export default {
	components: {
		DataRulesNavigation,
	},
	computed: {
		example: function() {
			if (this.mode === 'json') {
				return JSON.stringify(this.code, null, 4);
			}
			return YAML.stringify(this.code);
		},
		outputDataExample: function() {
			return JSON.stringify(this.outputData, null, 4);
		},
	},
	data: () => {
		return {
			mode: 'json',
		};
	},
	methods: {
		back() {
			this.$router.push({ name: 'docs.data-rules' });
		},
	},
	props: {
		cmd: {
			type: String,
			required: true,
		},
	},
};
</script>
<style lang="less">
@import '../../../less/var';

.data-rule-command {
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
