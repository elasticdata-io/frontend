<template>
	<div id="site-view-box-wrapper">
		<div id="content">
			<v-progress-linear
				v-if="loading"
				buffer-value="50"
				stream
				color="cyan"
			></v-progress-linear>
			<v-card v-else>
				<v-toolbar dark color="primary">
					<v-btn icon dark @click="back()">
						<v-icon>close</v-icon>
					</v-btn>
					<v-toolbar-title>
						Вкладка №{{ tabNumber }} - {{ pipeline.key }}
					</v-toolbar-title>
				</v-toolbar>
				<teleport-web-page :user-interaction="userInteraction"></teleport-web-page>
			</v-card>
		</div>
	</div>
</template>
<script lang="ts">
import { mapGetters } from 'vuex';
import { FIND_USER_INTERACTION_BY_ID } from '@/store/user-interaction/getters';
// eslint-disable-next-line no-unused-vars
import { UserInteraction } from '@/store/user-interaction';
import { CURRENT_PIPELINE } from '@/store/pipeline/getters';
import TeleportWebPage from "@/components/TeleportWebPage.vue";
import {TASK} from "@/store/task/getters";
import TaskStatusesMixin from "@/mixins/TaskStatusesMixin";

export default {
	name: 'InteractionModalBox',
    components: {TeleportWebPage},
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
