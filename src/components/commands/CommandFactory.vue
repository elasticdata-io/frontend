<template>
	<div>
		<default-command
			:cmd="cmd"
			:uuid="uuid"
			:parentUuid="parentUuid"
			:level="level"
			:number="number"
			:params="params"
			:running="running"
			:success="success"
			:failureReason="failureReason"
			:data-value="dataValue"
		>
		</default-command>
	</div>
</template>
<script>
import DefaultCommand from './DefaultCommand';

export default {
	name: 'CommandFactory',
	components: {
		DefaultCommand,
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
		parentUuid: {
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
	},
};
</script>
