<template>
	<v-btn @click="stop()" color="secondary" depressed small :disabled="isFinished(status)">
		<v-icon>stop</v-icon>
		зупинити
	</v-btn>
</template>
<script type="ts">
import TaskStatusesMixin from "@/mixins/TaskStatusesMixin";
import {TASK_STOP} from "@/store/task/actions";

export default {
    name: 'StopTaskButton',
    mixins: [TaskStatusesMixin],
    props: {
        status: {
            type: String,
        },
        taskId: {
            type: String,
        },
    },
    methods: {
        stop() {
            this.$store.dispatch(`task/${TASK_STOP}`, { id: this.taskId,  });
        }
    }
}
</script>
