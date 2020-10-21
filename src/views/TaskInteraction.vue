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
import TaskStatusesMixin from '@/mixins/TaskStatusesMixin';

export default {
	name: 'TaskInteraction',
	mixins: [TaskStatusesMixin],
	components: {},
	computed: {},
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
