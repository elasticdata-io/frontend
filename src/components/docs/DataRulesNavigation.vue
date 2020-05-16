<template>
	<ul>
		<li v-for="rule in rules" v-bind:key="rule.cmd">
			<router-link tag="a" :to="rule.route">
				{{ rule.cmd }}
			</router-link>
		</li>
	</ul>
</template>
<script>
import { mapGetters } from 'vuex';
import { DATA_RULES } from '../../store/data-rules/getters';

export default {
	computed: {
		...mapGetters('dataRules', {
			rules: DATA_RULES,
		}),
	},
};
</script>
<style lang="less" scoped>
@import '../../less/var';

li {
	padding-bottom: 5px;

	a {
		color: #0066aa !important;
		text-decoration: none;
		font-size: 1.3em;
		font-family: @ubuntu-mono;
		text-transform: uppercase;
		font-weight: normal;
	}
}
</style>
