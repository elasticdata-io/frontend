<template>
	<div id="app">
		<router-view></router-view>
		<snackbar></snackbar>
		<http-transport-layer></http-transport-layer>
	</div>
</template>

<script>
import HttpTransportLayer from './components/HttpTransportLayer.vue';
import Snackbar from './components/Snackbar';
export default {
	components: { HttpTransportLayer, Snackbar },
};
</script>
<style>
* {
	font-family: Ubuntu, sans-serif;
}
</style>
