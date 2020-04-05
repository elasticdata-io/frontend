<template>
	<div>
		<default-command :cmd="cmd" :number="number" :params="loopParams" :running="running">
		</default-command>
		<command-factory
			v-for="(command, index) in params.commands"
			:key="index"
			:number="number + '.' + (index + 1)"
			:cmd="command.cmd"
			:params="command"
			:running="command.running"
		></command-factory>
	</div>
</template>
<script>
import DefaultCommand from './DefaultCommand';

export default {
	name: 'LoopCommand',
	components: {
		DefaultCommand,
		CommandFactory: () => import('./CommandFactory.vue'),
	},
	computed: {
		loopParams: function() {
			const params = {
				...this.params,
			};
			delete params.commands;
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
	},
};
</script>
