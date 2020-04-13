<template>
	<div>
		<loop-command
			v-if="cmd === 'loop'"
			:cmd="cmd"
			:number="number"
			:params="params"
			:running="running"
			:success="success"
			:failureReason="failureReason"
		></loop-command>
		<condition-command
			v-if="cmd === 'condition'"
			:cmd="cmd"
			:number="number"
			:params="params"
			:running="running"
			:success="success"
			:failureReason="failureReason"
		></condition-command>
		<default-command
			v-if="cmd !== 'loop' && cmd !== 'condition'"
			:cmd="cmd"
			:number="number"
			:params="params"
			:running="running"
			:success="success"
			:failureReason="failureReason"
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
		ConditionCommand: () => import('./ConditionCommand.vue'),
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
		success: {
			type: Boolean,
			default: false,
		},
		failureReason: {
			type: String,
			default: '',
		},
	},
};
</script>
