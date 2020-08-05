<template>
	<div v-if="analyzedCommands.length">
		<analyzed-command-factory
			v-for="(analyzedCommand, index) in displayAnalyzedCommands"
			:analyzed-command="analyzedCommand"
			:key="index"
		></analyzed-command-factory>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import { TASK_ANALYZED_COMMANDS } from '../store/task-analyzed-commands/getters';
import AnalyzedCommandFactory from './commands/AnalyzedCommandFactory';

export default {
	name: 'AnalyzedCommands',
	components: {
		AnalyzedCommandFactory,
	},
	computed: {
		...mapGetters(`taskAnalyzedCommands`, {
			analyzedCommands: TASK_ANALYZED_COMMANDS,
		}),
		displayAnalyzedCommands: function() {
			return this.analyzedCommands.map(x => {
				const params = {
					...x.designTimeConfig,
					...x.runTimeConfig,
					dataContext: x.dataContext,
					pageContext: x.pageContext,
				};
				x.params = params;
				x.success = x.status === 'success';
				x.error = x.status === 'error';
				x.level = this.level(x);
				x.number = this.number(x);
				return x;
			});
		},
	},
	methods: {
		level(command) {
			const materializedUuidPath = command.materializedUuidPath || '';
			return materializedUuidPath.split('_').length - 1;
		},
		number(command) {
			const materializedUuidPath = command.materializedUuidPath || '';
			return materializedUuidPath.replace(/_/g, '.');
		},
	},
};
</script>
