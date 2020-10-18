import PipelineStatuses from "@/constants/pipeline-statuses";

export default {
    name: 'TaskStatusesMixin',
    data: () => {
        return {
            taskIsRunning: PipelineStatuses.RUNNING.title,
            taskIsNeedRun: PipelineStatuses.NEED_RUN.title,
            taskIsQueue: PipelineStatuses.QUEUE.title,
            taskIsError: PipelineStatuses.ERROR.title,
            taskIsStopping: PipelineStatuses.STOPPING.title,
            taskIsStopped: PipelineStatuses.STOPPED.title,
            taskIsPending: PipelineStatuses.PENDING.title,
            taskIsCompleted: PipelineStatuses.COMPLETED.title,
            taskIsWaiting: PipelineStatuses.WAIT_OTHER_PIPELINE.title,
            taskIsNeedOther: PipelineStatuses.NEED_OTHER_PIPELINE.title,
        };
    },
    methods: {
        isWaiting(status) {
            return (
                status === this.taskIsPending ||
                status === this.taskIsWaiting ||
                status === this.taskIsNeedRun ||
                status === this.taskIsNeedOther
            );
        },
        isNotFinished(status) {
            return (
                status !== this.taskIsError &&
                status !== this.taskIsCompleted &&
                status !== this.taskIsStopped
            );
        },
        isFinished(status) {
            return !this.isNotFinished(status);
        },
        isRunning(status) {
            return status === this.taskIsRunning;
        },
        isRunningOrQueue(status) {
            return status === this.taskIsRunning || status === this.taskIsQueue;
        },
        isStopping(status) {
            return status === this.taskIsStopping;
        },
    }
}