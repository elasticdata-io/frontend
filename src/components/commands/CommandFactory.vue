<template>
	<div>
		<loop-command
			v-if="cmd === 'loop'"
			:cmd="cmd"
			:number="number"
			:params="params"
			:running="running"
		>
			<slot></slot>
		</loop-command>
		<default-command
			v-if="cmd !== 'loop'"
			:cmd="cmd"
			:number="number"
			:params="params"
			:running="running"
		>
		</default-command>
	</div>
</template>
<script>
import DefaultCommand from './DefaultCommand';

export default {
	name: 'CommandFactory',
	components: {
		LoopCommand: () => import('./LoopCommand.vue'),
		DefaultCommand,
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
