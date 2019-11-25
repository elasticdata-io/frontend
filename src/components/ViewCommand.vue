<template>
	<div class="view-command" :class="cls" @click="toggleSelected">
		<span class="number-icon">
			<v-icon size="38" v-if="!selected">arrow_right</v-icon>
			<v-icon size="38" v-if="selected" color="purple darken-3">arrow_right</v-icon>
		</span>
		<span class="number">
			{{ number }}
		</span>
		<div class="name">{{ name }}</div>
		<div class="prop-value" v-for="(value, prop) in params" :key="prop + value">
			<span class="prop">{{ prop }}</span>
			<div class="value">{{ value }}</div>
		</div>
		<v-progress-linear
			v-if="running"
			height="2"
			indeterminate
			color="green"
		></v-progress-linear>
	</div>
</template>
<script>
export default {
	data: () => ({
		selected: false,
	}),
	computed: {
		cls: function() {
			return {
				selected: this.selected,
				running: this.running,
			};
		},
	},
	methods: {
		toggleSelected() {
			this.selected = !this.selected;
		},
	},
	props: {
		number: {
			type: Number,
			default: 0,
		},
		name: {
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
.view-command {
	cursor: pointer;
	position: relative;
	min-height: 30px;
	padding: 2px 17px 5px 42px;
	background-color: #edf0f5;
	border-bottom: 1px solid rgba(0, 0, 0, 0.12);
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

	&.running {
		background-color: #cbe8cb;
	}

	&:hover,
	&.selected {
		background-color: #e0e2e7;

		.number {
			display: none;
		}
		.number-icon {
			display: inline-block;
		}
	}
	.number {
		position: absolute;
		left: 17px;
		color: #aaa;
		font-weight: bold;
	}

	.number-icon {
		position: absolute;
		left: 5px;
		top: -4px;
		color: #aaa;
		font-weight: bold;
		display: none;
	}

	.name {
		font-weight: 500;
		text-transform: uppercase;
	}

	.prop-value {
		position: relative;
		padding-left: 100px;

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
</style>
