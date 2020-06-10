<template>
	<ul>
		<li v-for="command in commands" v-bind:key="command.cmd">
			<router-link tag="a" :to="command.route">
				{{ command.cmd }}
			</router-link>
		</li>
	</ul>
</template>
<script>
import { mapGetters } from 'vuex';
import { COMMANDS } from '../../store/commands/getters';

export default {
	computed: {
		...mapGetters('commands', {
			COMMANDS: COMMANDS,
		}),
		commands: function() {
			return this.COMMANDS.filter(x => x.disabled !== true);
		},
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
