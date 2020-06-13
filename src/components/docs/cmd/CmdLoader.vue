<template>
	<component :is="cmd" v-bind="{ cmd: cmd }"></component>
</template>
<script>
import OpenUrl from './OpenUrl';
export default {
	components: {
		openurl: OpenUrl,
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
