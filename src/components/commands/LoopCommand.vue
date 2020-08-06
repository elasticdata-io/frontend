<template>
	<div>
		<div>
			<div class="default-command-wrap" :style="wrapStyle" :class="wrapCls">
				<div class="default-command" @click="toggleSelected">
					<span class="number">{{ number }}</span>
					<div style="display: flex;">
						<div class="name">{{ cmd }}</div>
						<div style="flex: 1;">
							<loop-pagination
								:length="totalPages"
								:active-index="displayIndex"
								@change="changeDisplayIndex"
							></loop-pagination>
						</div>
					</div>
					<div
						class="prop-value"
						v-for="(value, prop) in commandParams"
						:key="prop + value"
					>
						<span class="prop" v-if="isNotEmpty(value)">
							{{ prop }}
						</span>
						<div v-if="!isObjectOrArray(value) && isNotEmpty(value)" class="value">
							{{ value }}
						</div>
						<div v-if="isObjectOrArray(value)" class="value">
							<v-btn x-small depressed>JSON</v-btn>
						</div>
					</div>
					<div class="prop-value">
						<span class="prop">totalTime</span>
						<div class="value">{{ totalTime }}</div>
					</div>
					<div v-if="dataValue" class="prop-value parsed-data-value">
						<span class="prop">value --></span>
						<div v-if="isLink(dataValue)" class="value">
							<a :href="dataValue" target="_blank">{{ dataValue }}</a>
						</div>
						<div v-else class="value">{{ dataValue }}</div>
					</div>
					<div v-if="failureReason">
						<v-alert dense text class="subtitle-2">{{ failureReason }}</v-alert>
					</div>
				</div>
			</div>
			<v-divider></v-divider>
		</div>
	</div>
</template>
<script>
import DefaultCommand from './DefaultCommand';
import LoopPagination from './LoopPagination';
import { CHANGE_LOOP_DISPLAY_INDEX } from '../../store/task-analyzed-commands/actions';
import { mapGetters } from 'vuex';
import { LOOP_DISPLAY_INDEXES_BY_UUID } from '../../store/task-analyzed-commands/getters';

export default {
	name: 'LoopCommand',
	components: {
		LoopPagination,
	},
	mixins: [DefaultCommand],
	data: () => ({
		totalPages: 1,
	}),
	watch: {
		lastIndex: function() {
			this.updateTotalPages();
		},
		startIndex: function() {
			this.updateTotalPages();
		},
		max: function() {
			this.updateTotalPages();
		},
	},
	computed: {
		...mapGetters('taskAnalyzedCommands', {
			loopIndexesByUuid: LOOP_DISPLAY_INDEXES_BY_UUID,
		}),
		displayIndex: function() {
			return this.loopIndexesByUuid[this.uuid] || 0;
		},
	},
	methods: {
		async changeDisplayIndex(displayIndex) {
			const action = `taskAnalyzedCommands/${CHANGE_LOOP_DISPLAY_INDEX}`;
			const uuid = this.uuid;
			const materializedUuidPath = this.materializedUuidPath;
			const payload = { uuid, materializedUuidPath, index: displayIndex };
			await this.$store.dispatch(action, payload);
		},
		updateTotalPages() {
			const max = Math.min(this.lastIndex + 1, this.max);
			this.totalPages = max - this.startIndex;
		},
	},
	mounted() {
		this.updateTotalPages();
	},
	props: {
		number: {
			type: String,
			default: '',
		},
		level: {
			type: Number,
			default: 0,
		},
		cmd: {
			type: String,
			default: 'loop',
		},
		context: {
			type: String,
			default: '',
		},
		dataContext: {
			type: String,
			default: '',
		},
		startIndex: {
			type: Number,
			default: 0,
		},
		lastIndex: {
			type: Number,
			default: 0,
		},
		max: {
			type: Number,
			default: 1,
		},
		uuid: {
			type: String,
			default: '',
		},
		materializedUuidPath: {
			type: String,
			default: '',
		},
		params: {
			type: Object,
			default: () => {},
		},
		success: {
			type: Boolean,
			default: false,
		},
		failureReason: {
			type: String,
			default: '',
		},
		dataValue: {},
		startOnUtc: {
			type: String,
			default: '',
		},
		endOnUtc: {
			type: String,
			default: '',
		},
	},
};
</script>
<style lang="less">
.v-pagination {
	justify-content: flex-start !important;

	.v-pagination__item {
		font-size: 0.8rem;
		height: 22px;
		margin: 0.2rem;
		min-width: 22px;
	}

	.v-pagination__navigation {
		height: 22px;
		width: 22px;
	}
}
</style>
