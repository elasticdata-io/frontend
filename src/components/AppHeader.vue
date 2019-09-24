<template>
	<v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3">
		<v-toolbar-title class="ml-0 pl-4">
			<a href="/" class="md-title" style="flex: 1 1 0%;">
				<img src="/logo-black.svg" width="125" alt="elastic data service" />
			</a>
		</v-toolbar-title>
		<div class="flex-grow-1"></div>
		<v-btn small to="/logout">
			Exit
			<v-icon small style="margin-left: 5px;">power_settings_new</v-icon>
		</v-btn>
	</v-app-bar>
</template>
<script>
export default {};
</script>
