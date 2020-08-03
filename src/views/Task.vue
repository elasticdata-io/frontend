<template>
	<v-content>
		<link href="https://fonts.googleapis.com/css?family=Karla&display=swap" rel="stylesheet" />
		<v-container>
			<v-system-bar color="white" lights-out height="40">
				<v-btn depressed small @click="back">
					<v-icon class="mr-2">keyboard_backspace</v-icon>
					назад
				</v-btn>
				<v-divider vertical class="ml-4 "></v-divider>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn text color="secondary" class="font-weight-bold" v-on="on">
							<v-icon>link</v-icon>
							{{ totalPages }}
						</v-btn>
					</template>
					<span>Всього сторінок</span>
				</v-tooltip>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn text color="primary" class="font-weight-bold" v-on="on">
							<v-icon>insert_drive_file</v-icon>
							{{ totalKeys }}
						</v-btn>
					</template>
					<span>Всього зібраних ключів</span>
				</v-tooltip>
				<v-divider vertical class="ml-4 "></v-divider>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn text class="font-weight-bold" v-on="on">
							<v-icon>access_time</v-icon>
							{{ totalTime }}
						</v-btn>
					</template>
					<span>Всього затраченого часу</span>
				</v-tooltip>

				<v-divider vertical></v-divider>
				<v-spacer></v-spacer>
				<v-icon>mdi-wifi-strength-4</v-icon>
				<v-icon>mdi-signal-cellular-outline</v-icon>
				<v-icon>mdi-battery</v-icon>
				<span>Завершено</span>
			</v-system-bar>
			<v-row class="task">
				<v-col class="commands" cols="6">
					<v-card>
						<command-factory
							v-for="(command, index) in commandsAnalyzed"
							:key="index"
							:number="commandNumber(command)"
							:cmd="command.cmd"
							:uuid="command.uuid"
							:level="commandLevel(command)"
							:running="command.running"
							:params="commandParams(command)"
							:success="command.status === 'success'"
							:failureReason="command.failureReason"
						></command-factory>
					</v-card>
				</v-col>
				<v-col class="preview" cols="6">
					<v-card>
						<v-tabs v-model="tab">
							<v-tab key="data">Данні</v-tab>
							<v-tab key="snapshot">snapshots</v-tab>
						</v-tabs>
						<v-tabs-items v-model="tab">
							<v-tab-item key="data">
								<v-card flat>
									<v-card-text>{{ taskData }}</v-card-text>
								</v-card>
							</v-tab-item>
							<v-tab-item key="snapshot">
								<v-card flat>
									<v-card-text>
										<iframe
											width="100%"
											src="https://vuetifyjs.com/ru/components/tabs/"
											height="400"
											style="border: 1px solid #ddd;"
										/>
									</v-card-text>
								</v-card>
							</v-tab-item>
						</v-tabs-items>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-content>
</template>
<script>
import CommandFactory from '../components/commands/CommandFactory';
import {
	FETCH_TASK,
	FETCH_TASK_COMMANDS_INFORMATION,
	FETCH_TASK_DATA,
} from '../store/task/actions';
import { TASK, TASK_COMMANDS_INFORMATION, TASK_DATA } from '../store/task/getters';
import moment from 'moment';
import { flatten } from 'flat';
import { mapGetters } from 'vuex';
import CommandsAnalyzedStructure from '../lib/commands.analyzed.structure';

export default {
	components: {
		CommandFactory,
	},
	data: () => ({
		tab: null,
	}),
	computed: {
		...mapGetters(`task`, {
			task: TASK,
			taskData: TASK_DATA,
			taskCommandsInformation: TASK_COMMANDS_INFORMATION,
		}),
		commandsAnalyzed: function() {
			const taskCommandsInformation = this.taskCommandsInformation || { analyzed: [] };
			return taskCommandsInformation.analyzed || [];
		},
		commandsJson: function() {
			const taskCommandsInformation = this.taskCommandsInformation || { json: [] };
			return taskCommandsInformation.json || [];
		},
		commands: function() {
			return this.commandsAnalyzed.map(x => {
				return {
					params: {
						...x.json,
						data_context: x.dataContext,
					},
					success: x.status === 'success',
					failureReason: x.failureReason,
					cmd: x.json.cmd,
					uuid: x.uuid,
				};
			});
		},
		commandsSortingWithLevel: function() {
			return CommandsAnalyzedStructure.getSortingWithLevel(
				this.commandsAnalyzed,
				this.commandsJson
			);
		},
		totalTime: function() {
			const commandsAnalyzed = this.commandsAnalyzed;
			if (commandsAnalyzed.length === 0) {
				return;
			}
			const firstCommand = commandsAnalyzed[0];
			const lastCommand = commandsAnalyzed[commandsAnalyzed.length - 1];
			const start = moment.utc(firstCommand.startOnUtc);
			const end = moment.utc(lastCommand.endOnUtc);
			const diff = end.diff(start);
			return moment.utc(diff).format('HH:mm:ss');
		},
		flattenTaskData: function() {
			return flatten(this.taskData || []);
		},
		totalKeys: function() {
			const flattenData = this.flattenTaskData;
			return Object.keys(flattenData).length;
		},
		totalPages: function() {
			const commandsAnalyzed = this.commandsAnalyzed;
			if (commandsAnalyzed.length === 0) {
				return;
			}
			return commandsAnalyzed.filter(x => x.json.cmd === 'openurl').length;
		},
	},
	methods: {
		back() {
			this.$router.back();
		},
		commandLevel(command) {
			return command.designTimeConfig.materializedUuidPath.split('_').length - 1;
		},
		commandNumber(command) {
			return command.designTimeConfig.materializedUuidPath.replace(/_/g, '.');
		},
		commandParams(command) {
			const params = {
				...command.designTimeConfig,
				...command.runTimeConfig,
				dataContext: command.dataContext,
				pageContext: command.pageContext,
			};
			delete params.materializedUuidPath;
			delete params.index;
			return params;
		},
	},
	created: async function() {
		await this.$store.dispatch(`task/${FETCH_TASK}`, this.taskId);
		await this.$store.dispatch(`task/${FETCH_TASK_COMMANDS_INFORMATION}`);
		await this.$store.dispatch(`task/${FETCH_TASK_DATA}`);
	},
	props: {
		taskId: {
			type: String,
		},
	},
};
</script>
<style lang="less">
.task {
	.commands {
	}
}
</style>
