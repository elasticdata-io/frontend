<template>
	<v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="primary">
		<v-toolbar-title class="ml-0 pl-4">
			<a href="/" class="md-title" style="flex: 1 1 0%;">
				<img src="/logo-black.svg" width="125" alt="elastic data service" />
			</a>
		</v-toolbar-title>
		<div class="flex-grow-1"></div>
		<v-btn small text to="/logout" color="white">
			<v-icon>exit_to_app</v-icon>
			<span style="padding-left: 5px;">Exit</span>
		</v-btn>
	</v-app-bar>
</template>
<script>
export default {};
</script>
