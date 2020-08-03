<template>
	<v-content>
		<link href="https://fonts.googleapis.com/css?family=Karla&display=swap" rel="stylesheet" />
		<v-container>
			<div v-if="!taskCommandsInformationLoading">
				<v-system-bar color="white" lights-out height="60">
					<v-btn depressed small @click="back">
						<v-icon class="mr-2">keyboard_backspace</v-icon>
						назад
					</v-btn>

					<v-divider vertical class="ml-2 mr-2"></v-divider>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn x-small text class="font-weight-bold" v-on="on">
								<v-icon>access_time</v-icon>
								{{ totalTime }}
							</v-btn>
						</template>
						<span>Всього: затраченого часу</span>
					</v-tooltip>

					<v-divider vertical class="ml-2 mr-2"></v-divider>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn x-small text class="font-weight-bold" v-on="on">
								<v-icon>donut_large</v-icon>
								<strong class="green--text">{{ successTotal }}</strong>
								|
								<strong class="red--text">{{ errorTotal }}</strong>
							</v-btn>
						</template>
						<span>Всього: успішних | не успішних команд</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn x-small text class="font-weight-bold" v-on="on">
								<v-icon>link</v-icon>
								{{ totalPages }}
							</v-btn>
						</template>
						<span>Всього: завантажених сторінок</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn x-small text class="font-weight-bold" v-on="on">
								<v-icon>insert_drive_file</v-icon>
								{{ totalKeys }}
							</v-btn>
						</template>
						<span>Всього: зібраних ключів</span>
					</v-tooltip>

					<v-divider vertical class="ml-2 mr-2"></v-divider>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<pipeline-json-editor
								v-on="on"
								:json="taskData"
								:read-only="true"
								:small="true"
								btn-icon="list"
								btn-caption="переглянути дані"
								btn-tooltip="Переглянути зідранні данні"
								:btn-elevation="0"
								title="Зібранні данні"
							></pipeline-json-editor>
						</template>
						<span>Всього: зібраних ключів</span>
					</v-tooltip>

					<v-divider vertical class="ml-2 mr-2"></v-divider>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-switch
								v-on="on"
								v-model="showOnlyError"
								class="ml-2"
								label="тільки з помилками"
							></v-switch>
						</template>
						<span>Відобразити команди лише з помилками</span>
					</v-tooltip>

					<v-spacer></v-spacer>
					<span>Завершено</span>
				</v-system-bar>
				<v-row class="task">
					<v-col class="commands" cols="12">
						<v-card>
							<command-factory
								v-for="(command, index) in displayCommandsAnalyzed"
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
					<v-col v-if="false" class="preview" cols="12">
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
			</div>
			<div v-else>
				<v-progress-linear indeterminate color="green"></v-progress-linear>
			</div>
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
import {
	TASK,
	TASK_COMMANDS_INFORMATION,
	TASK_COMMANDS_INFORMATION_LOADING,
	TASK_DATA,
} from '../store/task/getters';
import moment from 'moment';
import { flatten } from 'flat';
import { mapGetters } from 'vuex';
import PipelineJsonEditor from '../components/PipelineJsonEditor';

export default {
	components: {
		PipelineJsonEditor,
		CommandFactory,
	},
	data: () => ({
		tab: null,
		showOnlyError: false,
	}),
	computed: {
		...mapGetters(`task`, {
			task: TASK,
			taskData: TASK_DATA,
			taskCommandsInformation: TASK_COMMANDS_INFORMATION,
			taskCommandsInformationLoading: TASK_COMMANDS_INFORMATION_LOADING,
		}),
		commandsAnalyzed: function() {
			const taskCommandsInformation = this.taskCommandsInformation || { analyzed: [] };
			return taskCommandsInformation.analyzed || [];
		},
		displayCommandsAnalyzed: function() {
			return this.showOnlyError
				? this.commandsAnalyzed.filter(x => x.status === 'error')
				: this.commandsAnalyzed;
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
			return commandsAnalyzed.filter(x => x.cmd === 'openurl' || x.cmd === 'opentab').length;
		},
		successTotal: function() {
			return this.commandsAnalyzed.filter(x => x.status === 'success').length;
		},
		errorTotal: function() {
			return this.commandsAnalyzed.filter(x => x.status === 'error').length;
		},
	},
	methods: {
		back() {
			this.$router.back();
		},
		commandLevel(command) {
			const materializedUuidPath = command.designTimeConfig.materializedUuidPath || '';
			return materializedUuidPath.split('_').length - 1;
		},
		commandNumber(command) {
			const materializedUuidPath = command.designTimeConfig.materializedUuidPath || '';
			return materializedUuidPath.replace(/_/g, '.');
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
<style lang="less" scoped>
.task {
	.commands {
		.v-card {
		}
	}
}
.v-system-bar {
	position: sticky;
	top: 64px;
	z-index: 5;
	background-color: white;
}
</style>
