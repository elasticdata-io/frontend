<template>
	<div>
		<div class="default-command-wrap" :style="wrapStyle" :class="wrapCls">
			<div class="default-command" @click="toggleSelected">
				<span class="number">{{ number }}</span>
				<div class="name">{{ cmd }}</div>
				<div class="prop-value" v-for="(value, prop) in params" :key="prop + value">
					<span class="prop">{{ prop }}</span>
					<div v-if="!isObjectOrArray(value)" class="value">{{ value }}</div>
					<div v-if="isObjectOrArray(value)" class="value">
						<v-btn x-small depressed>JSON</v-btn>
					</div>
				</div>
			</div>
		</div>
		<v-progress-linear
			v-if="running"
			height="2"
			indeterminate
			color="green"
		></v-progress-linear>
		<v-divider></v-divider>
	</div>
</template>
<script>
export default {
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
			const padding = this.number.split('.').length - 1;
			return padding * 21;
		},
	},
	methods: {
		toggleSelected() {
			this.selected = !this.selected;
		},
		isObjectOrArray(value) {
			return typeof value === 'object';
		},
	},
	props: {
		number: {
			type: String,
			default: '0',
		},
		cmd: {
			type: String,
			default: '',
		},
		params: {
			type: Object,
			default: () => {},
		},
		running: {
			type: Boolean,
			default: false,
		},
		success: {
			type: Boolean,
			default: false,
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
		background-color: rgba(46, 255, 0, 0.2);
	}

	&.cmd-error {
		background-color: rgba(255, 0, 3, 0.2);
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
	}
}
</style>
