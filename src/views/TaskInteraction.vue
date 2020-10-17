<template>
	<v-content>
		<template>
			<v-tabs v-model="tab">
				<v-tab v-for="userInteraction in userInteractions" v-bind:key="userInteraction.id">
					{{ userInteraction.currentUrl }}
				</v-tab>
			</v-tabs>
			<v-tabs-items v-model="tab">
				<v-tab-item
					v-for="userInteraction in userInteractions"
					v-bind:key="userInteraction.id"
				>
					<v-card flat>
						<v-card-text>
							<img
								class="page-screenshot"
								:src="userInteraction.jpegScreenshotLink"
								:width="userInteraction.pageWidthPx"
								:height="userInteraction.pageHeightPx"
							/>
						</v-card-text>
					</v-card>
				</v-tab-item>
			</v-tabs-items>
		</template>
	</v-content>
</template>
<script lang="ts">
import { documentPack } from 'web-page-teleport';
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
			return this.USER_INTERACTIONS;
		},
	},
	data: () => {
		return {
			tab: null,
		};
	},
	props: {
		taskId: {
			type: String,
			required: true,
		},
	},
	async created() {
		await this.$store.dispatch(`userInteraction/${FETCH_USER_INTERACTIONS}`, {
			taskId: this.taskId,
		});
	},
	async mounted() {
		console.log(await documentPack(document));
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
