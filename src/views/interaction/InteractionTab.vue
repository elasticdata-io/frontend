<template>
	<div id="site-view-box-wrapper">
		<div id="content">
			<v-progress-linear
				v-if="loading"
				buffer-value="50"
				stream
				color="cyan"
			></v-progress-linear>
			<v-card>
				<v-toolbar style="z-index: 1">
					<v-btn depressed small @click="back()" class="mr-3" :disabled="asyncLoading">
						<v-icon class="mr-2">keyboard_backspace</v-icon>
						назад
					</v-btn>
					<v-toolbar-title>
						Вкладка №{{ tabNumber }} - {{ pipeline.key }}
					</v-toolbar-title>

					<v-spacer></v-spacer>

					<v-btn
						small
						class="mr-2"
						@click="disableInteraction"
						color="primary"
						:disabled="asyncLoading"
					>
						<v-icon>play_arrow</v-icon>
						continue automation
					</v-btn>
					<v-menu offset-y style="z-index: 99;">
						<template v-slot:activator="{ on, attrs }">
							<v-btn small v-bind="attrs" v-on="on" depressed text>
								<v-icon>more_vert</v-icon>
							</v-btn>
						</template>
						<v-list>
							<v-list-item @click="refreshPage" :disabled="asyncLoading">
								<v-list-item-title>
									<v-icon class="mr-2">refresh</v-icon>
									Синхроніхувати сторінку
								</v-list-item-title>
							</v-list-item>
							<v-list-item @click="toBackPage" :disabled="asyncLoading">
								<v-list-item-title>
									<v-icon class="mr-2">arrow_back</v-icon>
									Назад
								</v-list-item-title>
							</v-list-item>
							<v-list-item @click="toForwardPage" :disabled="asyncLoading">
								<v-list-item-title>
									<v-icon class="mr-2">arrow_forward</v-icon>
									Вперед
								</v-list-item-title>
							</v-list-item>
							<v-list-item @click="abortTask" :disabled="asyncLoading">
								<v-list-item-title>
									<v-icon class="mr-2">block</v-icon>
									Завершити задачу
								</v-list-item-title>
							</v-list-item>
						</v-list>
					</v-menu>
				</v-toolbar>
				<teleport-page
					@clickToEl="onClickToEl"
					@typeToEl="onTypeToEl"
					:disconnected="taskIsFinished"
					:user-interaction="userInteraction"
					:loading="asyncLoading"
				></teleport-page>
			</v-card>
		</div>
	</div>
</template>
<script lang="ts">
import { mapGetters } from 'vuex';
import {ASYNC_LOADING, FIND_USER_INTERACTION_BY_ID} from '@/store/user-interaction/getters';
// eslint-disable-next-line no-unused-vars
import { UserInteraction } from '@/store/user-interaction';
import { CURRENT_PIPELINE } from '@/store/pipeline/getters';
import TeleportPage from "@/components/TeleportPage.vue";
import {TASK} from "@/store/task/getters";
import TaskStatusesMixin from "@/mixins/TaskStatusesMixin";
import {DISABLE_INTERACTION_MODE, EXECUTE_COMMAND} from "@/store/user-interaction/actions";
import {TASK_STOP} from "@/store/task/actions";

export default {
	name: 'InteractionTab',
    components: {TeleportPage},
    mixins: [TaskStatusesMixin],
    props: {
		interactionId: {
			type: String,
		},
		taskId: {
			type: String,
		},
	},
	computed: {
		...mapGetters('userInteraction', {
			FIND_USER_INTERACTION_BY_ID: FIND_USER_INTERACTION_BY_ID,
            ASYNC_LOADING: ASYNC_LOADING,
		}),
		...mapGetters('pipeline', {
			CURRENT_PIPELINE: CURRENT_PIPELINE,
		}),
        ...mapGetters('task', {
            TASK: TASK,
        }),
        task() {
            return this.TASK || {};
        },
		pipeline() {
			return this.CURRENT_PIPELINE || {};
		},
		userInteraction(): UserInteraction {
			return this.FIND_USER_INTERACTION_BY_ID(this.interactionId) || {};
		},
		asyncLoading(): UserInteraction {
			return this.ASYNC_LOADING;
		},
		tabNumber() {
			const userInteraction = this.userInteraction || {};
			return parseInt(userInteraction.pageContext) + 1;
		},
		loading() {
			return Object.keys(this.userInteraction).length === 0;
		},
        taskIsFinished() {
            return this.isFinished(this.task?.status);
        }
	},
    watch: {
        taskIsFinished(value) {
            if (value) {
                this.back();
            }
        }
    },
	methods: {
		back() {
            this.$router.replace({name: 'task-interaction', params: {taskId: this.taskId} });
		},
        onClickToEl(fakeId) {
            this.sendCommands([
                {
                    cmd: 'nativeclick',
                    selector: `[fake-id="${fakeId}"]`,
                },
            ]);
        },
        onTypeToEl({ fakeId }) {
            const str = prompt("Please enter text");
            this.sendCommands([
                {
                    cmd: 'type',
                    selector: `[fake-id="${fakeId}"]`,
                    text: str
                },
            ]);
        },
        abortTask() {
            this.$store.dispatch(`task/${TASK_STOP}`, {id: this.taskId});
        },
        refreshPage() {
            this.sendCommands([
                {
                    cmd: 'js',
                    script: `console.log(new Date)`,
                }
            ]);
        },
        toBackPage(){
            this.sendCommands([
                {
                    cmd: 'js',
                    script: `history.back()`
                }
            ]);
        },
        toForwardPage(){
            this.sendCommands([
                {
                    cmd: 'js',
                    script: `history.forward()`
                }
            ]);
        },
        sendCommands(commands: any[]) {
            this.$store.dispatch(`userInteraction/${EXECUTE_COMMAND}`, {
                commands: [
                    ...commands,
                    {
                        cmd: 'pause',
                        timeout: 2,
                    }
                ],
                userInteractionId: this.userInteraction.id,
                taskId: this.taskId,
                pageContext: this.userInteraction.pageContext,
            });
        },
        async disableInteraction() {
            await this.$store.dispatch(`userInteraction/${DISABLE_INTERACTION_MODE}`, this.interactionId);
            await this.$router.replace({name: 'task-interaction', params: {taskId: this.taskId}});
        },
	},
};
</script>
<style lang="less">
@toolbarHeight: 50px;

#site-view-box-wrapper {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	background-color: #fff;
	z-index: 99;
	overflow: auto;

	.v-toolbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		border-radius: 0;
	}

	.v-toolbar,
	.v-toolbar__content {
		height: @toolbarHeight !important;
	}

	#content {
		padding-top: @toolbarHeight;
	}
}
</style>
