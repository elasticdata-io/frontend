<template>
	<v-dialog :value="dialog" persistent max-width="600">
		<v-card>
			<v-card-title class="headline">
				Увага!
			</v-card-title>
			<v-card-text>
				Цей pipeline містить <code>user interaction</code> блок.<br />
				Тому в будьякий момент може бути необхідне Ваше втручання.<br />
				Для запуску цього pipeline перейдіть за посиланням. На сторінці нажміть кнопку
				"запустити" і чекайте сповіщення про необхідність Вашего втручання.
			</v-card-text>
			<v-divider></v-divider>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="primary" text @click="close()">
					cancel
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script type="ts">

export default {
    name: 'NeedUserInteractionModalBox',
    data: () => ({}),
    computed: {
        dialog: function() {
            return this.opened && Boolean(this.pipelineId);
        }
    },
    methods: {
        close() {
            this.$emit('close');
        }
    },
    props: {
        opened: {
            type: Boolean,
            default: false,
        },
        pipelineId: {
            type: String,
        }
    }
}
</script>
