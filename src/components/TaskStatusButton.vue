<template>
	<div>
		<v-btn
			depressed
			block
			small
			:class="{
				'red--text': taskIsError === status,
				'pink--text': taskIsStopped === status,
			}"
		>
			{{ $t(`PIPELINE.STATUS.${status}`) }}
			<v-tooltip left v-if="status === taskIsError">
				<template v-slot:activator="{ on }">
					<v-icon small color="pink" v-on="on" class="ml-2">error</v-icon>
				</template>
				<span>{{ failureReason }}</span>
			</v-tooltip>
		</v-btn>
		<v-progress-linear
			v-if="isWaiting(status)"
			height="2"
			color="red lighten-2"
			buffer-value="0"
			stream
		></v-progress-linear>
		<v-progress-linear
			v-if="isRunningOrQueue(status)"
			height="1"
			indeterminate
			color="light-blue"
		></v-progress-linear>
		<v-progress-linear
			v-if="isStopping(status)"
			height="2"
			indeterminate
			color="red"
		></v-progress-linear>
	</div>
</template>
<script type="ts">
import TaskStatusesMixin from "@/mixins/TaskStatusesMixin";

export default {
    name: 'TaskStatusButton',
    mixins: [TaskStatusesMixin],
    props: {
        status: {
            type: String,
        },
        failureReason: {
            type: String,
            default: '',
        },
    },
}
</script>
