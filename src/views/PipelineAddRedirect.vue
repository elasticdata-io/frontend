<template>
	<div>redirect...</div>
</template>
<script>
export default {
	methods: {
		async getId() {
			const response = await this.$http.get('/api/pipeline/uuid');
			return await response.bodyText;
		},
	},
	async created() {
		const id = await this.getId();
		if (!id) {
			return;
		}
		this.$router.replace({ name: 'pipeline.edit', params: { state: 'add', id: id } });
	},
};
</script>
