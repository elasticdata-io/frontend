<template>
	<div class="view-command" :class="selected ? 'selected' : ''" @click="toggleSelected">
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
	</div>
</template>
<script>
export default {
	data: () => ({
		selected: false,
	}),
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
	font-family: 'Ubuntu Mono', 'Ubuntu', monospace;
	font-size: 0.9em;

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
		font-weight: bold;
		text-transform: uppercase;
	}

	.prop-value {
		position: relative;
		padding-left: 100px;

		.prop,
		.value {
			padding-top: 0;
			padding-bottom: 0;
		}

		.prop {
			position: absolute;
			left: 0;
			text-transform: uppercase;
			font-weight: bold;

			&:before {
				content: '- ';
			}
		}

		.value {
		}
	}
}
</style>
