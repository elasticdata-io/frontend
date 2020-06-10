<template>
	<cmd-layout :cmd="cmd" @mode="switchMode" :examples="command.examples">
		<div slot="description">
			<p>
				Команда використовуєтся для
				<strong>завантаження веб сторінки (url адреси)</strong>
			</p>
		</div>
	</cmd-layout>
</template>
<script>
import CmdLayout from './CmdLayout';
import CmdDocMixin from '../CmdDocMixin';
import { mapGetters } from 'vuex';
import { COMMAND_BY_CMD } from '../../../store/commands/getters';

export default {
	name: 'OpenUrl',
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
		return {
			cmd: 'openurl',
		};
	},
	methods: {},
};
</script>
