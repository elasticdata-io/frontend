<template>
	<div>
		<v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
			<template v-slot:activator="{ on }">
				<v-btn
					v-on="on"
					depressed
					small
					color="grey darken-1"
					:dark="!disabled"
					:disabled="disabled"
				>
					<v-icon class="pr-2">low_priority</v-icon>
					налаштувати залежності (<span>{{ dependencies.length }}</span
					>)
				</v-btn>
			</template>

			<v-card color="grey lighten-3">
				<v-toolbar dark color="gray">
					<v-toolbar-title>{{ title }}: налаштування залежностей</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-toolbar-items>
						<v-btn dark text @click="saveAndClose">
							<v-icon class="pr-2">save</v-icon>
							зберети і закрити
						</v-btn>
					</v-toolbar-items>
				</v-toolbar>

				<v-card-text>
					<v-row v-if="!dependencies.length">
						<v-col class="pt-10">
							<p class="headline">
								Ще не має залежності від інших павуків
							</p>
						</v-col>
					</v-row>
					<v-list color="grey lighten-3">
						<v-subheader v-if="dependencies.length"
							>Залежить від наступних павуків:
						</v-subheader>
						<v-list-item
							v-for="dependency in dependencies"
							:key="dependency.pipelineId"
						>
							<v-list-item-action style="margin-right: 5px;">
								<v-tooltip bottom>
									<template v-slot:activator="{ on }">
										<v-btn
											v-on="on"
											icon
											class="pl-1"
											@click="remove(dependency.pipelineId)"
										>
											<v-icon>delete_sweep</v-icon>
										</v-btn>
									</template>
									<span>Видалити</span>
								</v-tooltip>
							</v-list-item-action>
							<v-list-item-title>
								<span class="pl-2">
									{{ getPipelineKeyById(dependency.pipelineId) }}
								</span>
								<strong v-if="dependency.dataFreshnessInterval">
									<v-icon class="pl-2 ">access_time</v-icon>
									{{ dependency.dataFreshnessInterval }}
								</strong>
							</v-list-item-title>
						</v-list-item>
					</v-list>
					<v-divider></v-divider>
					<v-row>
						<v-col xl="4" lg="5" md="7">
							<v-select
								v-model="pipelineId"
								:items="items"
								item-text="key"
								item-value="id"
								label="Додати залежність від павука"
							></v-select>
							<div v-if="false && pipelineId">
								<v-sheet color="grey lighten-3" width="100%">
									<v-switch
										v-model="enableDataFreshControl"
										flat
										label="Запускати тільки якщо данні в середині павука, старші за:"
									></v-switch>
								</v-sheet>
								<v-row>
									<v-col class="pt-0" md="3">
										<v-text-field
											v-model="dataFresh"
											type="number"
											:disabled="!enableDataFreshControl"
											:label="selectedTimeMeasurement || `Введіть значення`"
											prepend-icon="access_time"
										></v-text-field>
									</v-col>
									<v-col class="pt-0">
										<v-select
											:disabled="!enableDataFreshControl"
											v-model="selectedTimeMeasurement"
											:items="timeMeasurement"
											item-text="title"
											item-value="id"
											label="Вимір часу"
										></v-select>
									</v-col>
								</v-row>
							</div>
							<v-row>
								<v-col class="text-right">
									<v-btn
										:disabled="!pipelineId"
										color="secondary"
										depressed
										@click="add"
										class="ml-6"
									>
										<v-icon>playlist_add</v-icon>
										<span class="pl-2">Додати в залежність</span>
									</v-btn>
								</v-col>
							</v-row>
						</v-col>
					</v-row>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>
<script>
import { FETCH_PIPELINES } from '../store/pipelines/actions';
import { mapGetters } from 'vuex';
import { PIPELINES } from '../store/pipelines/getters';

export default {
	data: () => ({
		pipelineId: null,
		dialog: false,
		enableDataFreshControl: false,
		selectedTimeMeasurement: 'm',
		dataFresh: 30,
		timeMeasurement: [
			{
				title: 'секунда',
				id: 's',
			},
			{
				title: 'хвилина',
				id: 'm',
			},
			{
				title: 'година',
				id: 'h',
			},
			{
				title: 'день',
				id: 'd',
			},
		],
	}),
	computed: {
		...mapGetters('pipelines', {
			pipelines: PIPELINES,
		}),
		items: function() {
			return this.pipelines
				.filter(x => {
					const find = this.dependencies.find(d => d.pipelineId === x.id);
					return find === undefined;
				})
				.filter(x => x.id !== this.id);
		},
	},
	methods: {
		remove(pipelineId) {
			this.$emit('remove', pipelineId);
		},
		add() {
			this.$emit('add', {
				pipelineId: this.pipelineId,
				dataFreshnessInterval:
					this.enableDataFreshControl && this.dataFresh > 0
						? `${this.dataFresh}${this.selectedTimeMeasurement}`
						: null,
			});
			this.resetAddControls();
		},
		resetAddControls() {
			this.pipelineId = null;
			this.dataFresh = 30;
			this.selectedTimeMeasurement = 'min';
			this.enableDataFreshControl = false;
		},
		getPipelineKeyById(pipelineId) {
			const pipeline = this.pipelines.find(p => p.id === pipelineId) || {};
			return pipeline.key;
		},
		async saveAndClose() {
			await this.$emit('save');
			this.dialog = false;
		},
	},
	created() {
		this.$store.dispatch(`pipelines/${FETCH_PIPELINES}`);
	},
	props: {
		id: {
			type: String,
			default: '',
		},
		title: {
			type: String,
			default: '',
		},
		dependencies: {
			type: Array,
			default: () => [],
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
};
</script>
