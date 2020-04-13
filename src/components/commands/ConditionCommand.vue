<template>
	<div>
		<default-command
			:cmd="cmd"
			:number="number"
			:params="conditionParams"
			:running="running"
			:failureReason="failureReason"
		>
		</default-command>
		<default-command
			:cmd="ifCommand.cmd"
			:params="ifCommand.params"
			:running="ifCommand.running"
		>
		</default-command>
		<command-factory
			v-for="(command, index) in trueCommands"
			:key="index"
			:number="number + '.' + (index + 1)"
			:cmd="command.cmd"
			:params="command.params"
			:running="command.running"
			:failureReason="command.failureReason"
		></command-factory>
		<command-factory
			v-for="(command, index) in falseCommands"
			:key="index"
			:number="number + '.' + (index + 1)"
			:cmd="command.cmd"
			:params="command.params"
			:running="command.running"
			:failureReason="command.failureReason"
		></command-factory>
	</div>
</template>
<script>
import DefaultCommand from './DefaultCommand';

export default {
	name: 'ConditionCommand',
	components: {
		DefaultCommand,
		CommandFactory: () => import('./CommandFactory.vue'),
	},
	computed: {
		ifCommand: function() {
			return this.params.ifCommand;
		},
		trueCommands: function() {
			return this.params.trueCommands;
		},
		falseCommands: function() {
			return this.params.falseCommands;
		},
		conditionParams: function() {
			const params = {
				...this.params,
			};
			delete params.ifCommand;
			delete params.trueCommands;
			delete params.falseCommands;
			return params;
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
		failureReason: {
			type: String,
			default: '',
		},
	},
};
</script>
