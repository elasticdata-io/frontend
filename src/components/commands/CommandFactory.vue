<template>
	<div>
		<default-command
			v-if="cmd !== 'loop'"
			:cmd="cmd"
			:uuid="uuid"
			:materializedUuidPath="materializedUuidPath"
			:level="level"
			:number="number"
			:params="params"
			:running="running"
			:success="success"
			:failure-reason="failureReason"
			:data-value="dataValue"
			:start-on-utc="startOnUtc"
			:end-on-utc="endOnUtc"
		>
		</default-command>
		<loop-command
			v-if="cmd === 'loop'"
			:uuid="uuid"
			:materializedUuidPath="materializedUuidPath"
			:level="level"
			:number="number"
			:params="params"
			:data-context="params.dataContext"
			:context="params.context"
			:start-index="params.index"
			:current-index="params.currentIndex"
			:max="params.max"
			:running="running"
			:success="success"
			:failure-reason="failureReason"
			:data-value="dataValue"
			:start-on-utc="startOnUtc"
			:end-on-utc="endOnUtc"
			@changeLoopPage="changeLoopPageEmit"
		>
		</loop-command>
	</div>
</template>
<script>
import DefaultCommand from './DefaultCommand';
import LoopCommand from './LoopCommand';

export default {
	name: 'CommandFactory',
	components: {
		DefaultCommand,
		LoopCommand,
	},
	methods: {
		changeLoopPageEmit(materializedUuidPath, index) {
			this.$emit('changeLoopPage', materializedUuidPath, index);
		},
	},
	props: {
		level: {
			type: Number,
			default: 0,
		},
		number: {
			type: String,
			default: '',
		},
		cmd: {
			type: String,
			default: '',
		},
		materializedUuidPath: {
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
