<template>
	<ul>
		<li v-for="command in commands" v-bind:key="command.cmd">
			<router-link
				tag="a"
				:to="command.route || { name: 'docs.commands.view', params: { cmd: command.cmd } }"
			>
				{{ command.cmd }}
			</router-link>
		</li>
	</ul>
</template>
<script>
import { mapGetters } from 'vuex';
import { COMMANDS } from '../../store/commands/getters';
import { FETCH_COMMANDS_DOCUMENTATION } from '../../store/commands/actions';

export default {
	computed: {
		...mapGetters('commands', {
			COMMANDS: COMMANDS,
		}),
		commands: function() {
			return this.COMMANDS.filter(x => x.disabled !== true);
		},
	},
	created() {
		this.$store.dispatch(`commands/${FETCH_COMMANDS_DOCUMENTATION}`);
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
