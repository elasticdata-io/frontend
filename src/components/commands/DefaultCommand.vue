<template>
	<div>
		<div class="default-command-wrap" :style="wrapStyle" :class="wrapCls">
			<div class="default-command" @click="toggleSelected">
				<span class="number">{{ number }}</span>
				<div class="name">{{ cmd }}</div>
				<div class="prop-value" v-for="(value, prop) in params" :key="prop + value">
					<span class="prop">{{ prop }}</span>
					<div v-if="!isObjectOrArray(value)" class="value">{{ value }}</div>
					<div v-if="isObjectOrArray(value)" class="value">JSON</div>
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
	},
};
</script>
<style lang="less">
.default-command-wrap {
	background-color: #edf0f5;
	position: relative;

	&:hover,
	&.selected {
		background-color: #e0e2e7;
	}

	&.running {
		background-color: #cbe8cb;
	}

	.default-command {
		cursor: pointer;

		min-height: 30px;
		padding: 2px 17px 5px 42px;
		/*border-bottom: 1px solid rgba(0, 0, 0, 0.12);*/
		/*font-family: 'Ubuntu Mono', 'Ubuntu', monospace;*/
		font-size: 0.9em;

		font-family: 'Karla', sans-serif;
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
			color: #aaa;
			font-weight: bold;
		}

		.name {
			font-weight: 500;
			text-transform: uppercase;
		}

		.prop-value {
			position: relative;
			padding-left: 130px;

			.prop,
			.value {
				padding-top: 0;
				padding-bottom: 0;
				color: #555;
			}

			.prop {
				position: absolute;
				left: 0;
				text-transform: uppercase;
				font-weight: normal;
				font-size: 1em;

				&:before {
					content: ':';
				}
			}

			.value {
			}
		}
	}
}
</style>
