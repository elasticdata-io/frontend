<template>
	<component :is="cmd" v-bind="{ cmd: cmd }"></component>
</template>
<script>
import openurl from './OpenUrl';
export default {
	components: {
		openurl,
	},
	data: function() {
		return {};
	},
	computed: {},
	props: {
		cmd: {
			type: String,
		},
	},
};
</script>
