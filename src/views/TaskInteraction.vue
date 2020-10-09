<template>
	<v-content>
		{{ taskId }}
	</v-content>
</template>
<script lang="ts">
export default {
	name: 'TaskInteraction',
	props: {
		taskId: {
			type: String,
			required: true,
		},
	},
};
</script>
