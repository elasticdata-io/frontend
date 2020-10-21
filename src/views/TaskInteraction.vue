<template>
	<v-main style="height: 100%;">
		<v-container>
			<router-view></router-view>
		</v-container>
	</v-main>
</template>
<script lang="ts">
import { FETCH_USER_INTERACTIONS } from '@/store/user-interaction/actions';
import { FETCH_TASK } from '@/store/task/actions';
import {FETCH_PIPELINE} from "@/store/pipeline/actions";
import {mapGetters} from "vuex";
import {TASK} from "@/store/task/getters";

export default {
	name: 'TaskInteraction',
    watch: {
        task() {
            this.fetchPipeline();
        },
    },
    computed: {
        ...mapGetters('task', {
            TASK: TASK,
        }),
        task(): any {
            return this.TASK || {};
        },
    },
	methods: {
        fetchPipeline() {
            const pipelineId = this.task?.pipelineId;
            if (!pipelineId) {
                return;
            }
            this.$store.dispatch(`pipeline/${FETCH_PIPELINE}`, { id: this.task.pipelineId });
        },
    },
	created() {
		this.$store.dispatch(`userInteraction/${FETCH_USER_INTERACTIONS}`, {
			taskId: this.taskId,
		});
		this.$store.dispatch(`task/${FETCH_TASK}`, this.taskId);
	},
	props: {
		taskId: {
			type: String,
			required: true,
		},
		interactionId: {
			type: String,
		},
	},
};
</script>
