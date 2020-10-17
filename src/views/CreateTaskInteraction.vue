<template>
	<div></div>
</template>
<script type="ts">
import { RUN_PIPELINE } from "@/store/pipeline/actions";

export default {
    name: 'CreateTaskInteraction',
    async created() {
        const task = await this.$store.dispatch(`pipeline/${RUN_PIPELINE}`, { pipelineId: this.pipelineId });
        await this.$router.push({name: 'task-interaction', params: {taskId: task.id}})
    },
    props: {
        pipelineId: {
            type: String,
        }
    }
}
</script>
