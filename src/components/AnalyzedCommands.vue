<template>
	<div>
		<template v-if="analyzedCommands.length">
			<analyzed-command-factory
				v-for="(analyzedCommand, index) in displayAnalyzedCommands"
				:analyzed-command="analyzedCommand"
				:key="index"
			></analyzed-command-factory>
		</template>
		<template v-else-if="showOnlyWithError">
			<v-alert border="right" colored-border type="success" elevation="0">{{
				$t('TASK.HAS_NOT_ERROR_COMMANDS')
			}}</v-alert>
		</template>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import { TASK_ANALYZED_COMMANDS } from '../store/task-analyzed-commands/getters';
import AnalyzedCommandFactory from './commands/AnalyzedCommandFactory';
import { SHOW_ONLY_WITH_ERROR } from '@/store/task-analyzed-commands/getters';

export default {
	name: 'AnalyzedCommands',
	components: {
		AnalyzedCommandFactory,
	},
	computed: {
		...mapGetters(`taskAnalyzedCommands`, {
			showOnlyWithError: SHOW_ONLY_WITH_ERROR,
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
