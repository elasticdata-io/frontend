<template>
	<div>
		<div class="default-command-wrap" :style="wrapStyle" :class="wrapCls">
			<div class="default-command" @click="toggleSelected">
				<span class="number">{{ number }}</span>
				<div class="name">{{ cmd }}</div>
				<div class="prop-value" v-for="(value, prop) in commandParams" :key="prop + value">
					<span class="prop" v-if="isNotEmpty(value)">{{ prop }}</span>
					<div v-if="!isObjectOrArray(value) && isNotEmpty(value)" class="value">
						{{ value }}
					</div>
					<div v-if="isObjectOrArray(value)" class="value">
						<v-btn x-small depressed>JSON</v-btn>
					</div>
				</div>
				<div class="prop-value">
					<span class="prop">totalTime</span>
					<div class="value">{{ totalTime }}</div>
				</div>
				<div v-if="dataValue" class="prop-value parsed-data-value">
					<span class="prop">value --></span>
					<div v-if="isLink(dataValue)" class="value">
						<a :href="dataValue" target="_blank">{{ dataValue }}</a>
					</div>
					<div v-else class="value">{{ dataValue }}</div>
				</div>
				<div v-if="failureReason">
					<v-alert class="failure-reason" dense>
						<div v-for="(errorLine, i) in failureReasonLines" :key="i">
							{{ errorLine }}
						</div>
					</v-alert>
				</div>
			</div>
		</div>
		<v-divider></v-divider>
	</div>
</template>
<script>
import moment from 'moment';

export default {
	name: 'DefaultCommand',
	data: () => ({
		selected: false,
	}),
	computed: {
		wrapStyle: function() {
			return {
				[`padding-left`]: `${this.padding}px`,
			};
		},
		wrapCls: function() {
			return {
				selected: this.selected,
				running: this.running,
				'cmd-success': this.success,
				'cmd-error': !this.success,
			};
		},
		padding: function() {
			const padding = this.level;
			return padding * 21;
		},
		commandParams: function() {
			const params = { ...this.params };
			delete params.cmd;
			return params;
		},
		totalTime() {
			const start = moment.utc(this.startOnUtc);
			const end = moment.utc(this.endOnUtc);
			const diff = end.diff(start);
			const duration = moment.duration(diff);
			if (duration.asMinutes() > 1) {
				return moment.utc(diff).format('m[m] s[s]');
			}
			if (duration.asSeconds() > 1) {
				return moment.utc(diff).format('s[s]');
			}
			return `${diff}ms`;
		},
		failureReasonLines: function() {
			const failureReason = this.failureReason || '';
			return failureReason.split('\n');
		},
	},
	methods: {
		toggleSelected() {
			this.selected = !this.selected;
		},
		isObjectOrArray(value) {
			return typeof value === 'object';
		},
		isNotEmpty(value) {
			if (value === undefined || value === null || value === '') {
				return false;
			}
			return true;
		},
		isLink: value => {
			return /^https?:\/\//.test(value);
		},
	},
	props: {
		number: {
			type: String,
			default: '',
		},
		level: {
			type: Number,
			default: 0,
		},
		cmd: {
			type: String,
			default: '',
		},
		parentUuid: {
			type: String,
			default: '',
		},
		uuid: {
			type: String,
			default: '',
		},
		params: {
			type: Object,
			default: () => {},
		},
		success: {
			type: Boolean,
			default: false,
		},
		failureReason: {
			type: String,
			default: '',
		},
		dataValue: {},
		startOnUtc: {
			type: String,
			default: '',
		},
		endOnUtc: {
			type: String,
			default: '',
		},
	},
};
</script>
<style lang="less">
.default-command-wrap {
	@fontFamily: 'Ubuntu Mono', 'Ubuntu', monospace;
	background-color: #edf0f5;
	position: relative;

	&:hover,
	&.selected {
		background-color: #e0e2e7;
	}

	&.cmd-success {
		background-color: rgba(46, 255, 0, 0.06);
	}

	&.cmd-error {
		background-color: rgba(255, 0, 3, 0.1);
	}

	&.running {
		background-color: #cbe8cb;
	}

	.default-command {
		cursor: pointer;

		min-height: 30px;
		padding: 2px 17px 5px 42px;
		/*border-bottom: 1px solid rgba(0, 0, 0, 0.12);*/

		font-size: 0.8em;
		font-weight: normal;

		.v-progress-linear {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
		}

		.number {
			position: absolute;
			left: 17px;
			color: #666;
			font-family: @fontFamily;
		}

		.name {
			font-size: 1.05em;
			text-transform: uppercase;
			font-family: @fontFamily;
		}

		.prop-value {
			position: relative;
			padding-left: 110px;

			&.parsed-data-value {
				font-weight: bold;
			}

			&:hover {
				background-color: #e5c4ff;
			}

			.prop,
			.value {
				padding-top: 0;
				padding-bottom: 0;
				color: #555;
				font-family: @fontFamily;
			}

			.prop {
				position: absolute;
				left: 0;
				text-transform: uppercase;
				font-weight: normal;
				font-size: 1em;

				&:before {
					content: '- ';
				}
			}

			.value {
				font-size: 1em;
			}
		}

		.failure-reason {
			background-color: black;
			color: gray;
			font-size: 12px;
			line-height: 16px;

			.bold {
				color: white;
			}
		}
	}
}
</style>
