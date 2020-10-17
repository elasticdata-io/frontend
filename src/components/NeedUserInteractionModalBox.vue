<template>
	<v-dialog :value="dialog" persistent max-width="600">
		<v-card>
			<v-card-title class="headline">
				Увага!
			</v-card-title>
			<v-card-text>
				<p>Цей pipeline містить <strong>user interaction</strong> блок:</p>
				<code-preview
					mode="json"
					:code="format(userInteraction)"
					:fake-updated="true"
				></code-preview>
				<br />
				Тому в будьякий момент може бути необхідне Ваше втручання.<br />
				Для запуску цього pipeline натисніть Продовжити та очикуйте сповіщення щодо
				необхідності Вашого втручання.
			</v-card-text>
			<v-divider></v-divider>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="secondary" depressed @click="close()">
					Відмінити
				</v-btn>
				<v-btn class="ml-5" depressed color="primary" @click="createTaskInteraction()">
					Продовжити
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script type="ts">

import CodePreview from "@/components/CodePreview.vue";

export default {
    name: 'NeedUserInteractionModalBox',
    components: {
        CodePreview,
    },
    data: () => ({}),
    computed: {
        dialog: function() {
            return this.opened && Boolean(this.pipelineId);
        }
    },
    methods: {
        close() {
            this.$emit('close');
        },
        format(outputData) {
            return JSON.stringify(outputData, null, 4);
        },
        createTaskInteraction() {
            this.$router.push({name: 'create-task-interaction', params: {pipelineId: this.pipelineId}})
        },
    },
    props: {
        opened: {
            type: Boolean,
            default: false,
        },
        pipelineId: {
            type: String,
        },
        userInteraction: {
            type: Object,
        }
    }
}
</script>
