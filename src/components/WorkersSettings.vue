<template>
	<v-card elevation="0">
		<v-card-text>
			<v-text-field
				label="Мінімальна кількість без діяльних робітніків"
				required
				type="number"
				min="0"
				max="2"
				v-model="minWorkers"
			></v-text-field>
			<v-checkbox label="Автоматичний запуск робітника" v-model="autoStart"></v-checkbox>
		</v-card-text>
		<v-card-actions>
			<div>
				<v-btn depressed :to="{ name: 'workers' }">закрити</v-btn>
				<v-btn color="accent" depressed class="ml-6" @click="save">
					<span>Зберегти</span>
				</v-btn>
			</div>
		</v-card-actions>
		<v-divider></v-divider>
	</v-card>
</template>
<script lang="ts">
export default {
	props: {},
	data: () => ({
		autoStart: true,
		minWorkers: 0,
	}),
	methods: {
		save() {},
	},
};
</script>
