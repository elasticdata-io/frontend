<template>
	<div v-if="command">
		<cmd-layout :cmd="cmd" @mode="switchMode" :examples="command.examples">
			<div slot="description">
				<p v-if="command.description">{{ command.description }}</p>
				<p v-else-if="command.summary">{{ command.summary }}</p>
				<p v-else>
					Command not have any description
				</p>
			</div>
		</cmd-layout>
	</div>
</template>
<script>
import CmdLayout from './CmdLayout';
import CmdDocMixin from '../CmdDocMixin';
import { mapGetters } from 'vuex';
import { COMMAND_BY_CMD } from '../../../store/commands/getters';
import { FETCH_COMMANDS_DOCUMENTATION } from '../../../store/commands/actions';

export default {
	name: 'CmdDoc',
	mixins: [CmdDocMixin],
	components: {
		CmdLayout,
	},
	computed: {
		...mapGetters('commands', {
			COMMAND_BY_CMD: COMMAND_BY_CMD,
		}),
		command: function() {
			if (!this.cmd) {
				return {};
			}
			return this.COMMAND_BY_CMD(this.cmd);
		},
	},
	data: () => {
		return {};
	},
	methods: {},
	props: {
		cmd: {
			type: String,
		},
	},
	created() {
		this.$store.dispatch(`commands/${FETCH_COMMANDS_DOCUMENTATION}`);
	},
};
</script>
