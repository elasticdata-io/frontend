<template>
	<div>
		<default-command
			v-if="analyzedCommand.cmd !== 'loop'"
			:cmd="analyzedCommand.cmd"
			:uuid="analyzedCommand.uuid"
			:materialized-uuid-path="analyzedCommand.materializedUuidPath"
			:level="analyzedCommand.level"
			:number="analyzedCommand.number"
			:params="analyzedCommand.params"
			:success="analyzedCommand.success"
			:failure-reason="analyzedCommand.failureReason"
			:data-value="analyzedCommand.dataValue"
			:start-on-utc="analyzedCommand.startOnUtc"
			:end-on-utc="analyzedCommand.endOnUtc"
		>
		</default-command>
		<loop-command
			v-if="analyzedCommand.cmd === 'loop'"
			:uuid="analyzedCommand.uuid"
			:materialized-uuid-path="analyzedCommand.materializedUuidPath"
			:level="analyzedCommand.level"
			:number="analyzedCommand.number"
			:params="analyzedCommand.params"
			:data-context="analyzedCommand.params.dataContext"
			:context="analyzedCommand.params.context"
			:start-index="analyzedCommand.params.index"
			:last-index="analyzedCommand.params.currentIndex"
			:max="analyzedCommand.params.max"
			:success="analyzedCommand.success"
			:failure-reason="analyzedCommand.failureReason"
			:data-value="analyzedCommand.dataValue"
			:start-on-utc="analyzedCommand.startOnUtc"
			:end-on-utc="analyzedCommand.endOnUtc"
		>
		</loop-command>
	</div>
</template>
<script>
import DefaultCommand from './DefaultCommand';
import LoopCommand from './LoopCommand';

export default {
	name: 'AnalyzedCommandFactory',
	components: {
		DefaultCommand,
		LoopCommand,
	},
	methods: {},
	props: {
		analyzedCommand: {
			type: Object,
			required: true,
		},
	},
};
</script>
