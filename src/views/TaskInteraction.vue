<template>
	<v-content>
		<template v-if="userInteractions">
			<v-tabs v-model="tab" @change="documentUnpack()">
				<v-tab v-for="userInteraction in userInteractions" v-bind:key="userInteraction.id">
					{{ userInteraction.currentUrl }}
				</v-tab>
			</v-tabs>
			<v-card flat>
				<v-card-text id="window"></v-card-text>
			</v-card>
		</template>
	</v-content>
</template>
<script lang="ts">
import { documentUnpack } from 'web-page-teleport';
import { FETCH_USER_INTERACTIONS } from '@/store/user-interaction/actions';
import { mapGetters } from 'vuex';
import { USER_INTERACTIONS } from '@/store/user-interaction/getters';
// eslint-disable-next-line no-unused-vars
import { UserInteraction } from '@/store/user-interaction';

export default {
	name: 'TaskInteraction',
	computed: {
		...mapGetters('userInteraction', {
			USER_INTERACTIONS: USER_INTERACTIONS,
		}),
		userInteractions(): UserInteraction[] {
			return this.USER_INTERACTIONS || [];
		},
		currentUserInteraction: function() {
			return this.userInteractions[this.tab];
		},
	},
	watch: {},
	data: () => {
		return {
			tab: null,
		};
	},
	methods: {
		documentUnpack() {
			const toEl = document.getElementById('window');
			if (toEl) {
				const userInteraction = this.currentUserInteraction;
				documentUnpack({
					screenshotSrc: userInteraction.jpegScreenshotLink,
					width: userInteraction.pageWidthPx,
					height: userInteraction.pageHeightPx,
					viewElements: userInteraction.pageElements,
					toElement: toEl,
				});
			}
		},
	},
	props: {
		taskId: {
			type: String,
			required: true,
		},
	},
	created() {
		this.$store.dispatch(`userInteraction/${FETCH_USER_INTERACTIONS}`, {
			taskId: this.taskId,
		});
	},
};
</script>
<style lang="less" scoped>
.v-card__text {
	padding: 0;
	overflow-x: auto;
}
.page-screenshot {
	margin: 0;
	padding: 10px;
	background-color: #fff;
}
</style>
