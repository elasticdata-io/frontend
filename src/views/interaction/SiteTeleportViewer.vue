<template>
	<div id="site-view-box-wrapper">
		<div id="content">
			<v-progress-linear
				v-if="loading"
				buffer-value="50"
				stream
				color="cyan"
			></v-progress-linear>
			<v-card v-else>
				<v-toolbar dark color="primary">
					<v-btn icon dark @click="back()">
						<v-icon>close</v-icon>
					</v-btn>
					<v-toolbar-title>
						Вкладка №{{ tabNumber }} - {{ pipeline.key }}
					</v-toolbar-title>
				</v-toolbar>
				<v-card-text :id="id"></v-card-text>
			</v-card>
		</div>
	</div>
</template>
<script lang="ts">
import { documentUnpack } from 'web-page-teleport';
import { mapGetters } from 'vuex';
import { FIND_USER_INTERACTION_BY_ID } from '@/store/user-interaction/getters';
// eslint-disable-next-line no-unused-vars
import { UserInteraction } from '@/store/user-interaction';
import { CURRENT_PIPELINE } from '@/store/pipeline/getters';

export default {
	name: 'SiteTeleportViewer',
	props: {
		interactionId: {
			type: String,
		},
		taskId: {
			type: String,
		},
	},
	data: () => ({
		id: 'site-view-box',
		timer: null,
	}),
	computed: {
		...mapGetters('userInteraction', {
			FIND_USER_INTERACTION_BY_ID: FIND_USER_INTERACTION_BY_ID,
		}),
		...mapGetters('pipeline', {
			CURRENT_PIPELINE: CURRENT_PIPELINE,
		}),
		pipeline() {
			return this.CURRENT_PIPELINE || {};
		},
		userInteraction(): UserInteraction {
			return this.FIND_USER_INTERACTION_BY_ID(this.interactionId) || {};
		},
		tabNumber() {
			const userInteraction = this.userInteraction || {};
			return parseInt(userInteraction.pageContext) + 1;
		},
		loading() {
			return Object.keys(this.userInteraction).length === 0;
		},
	},
	methods: {
		unpack() {
			const toEl = document.getElementById(this.id);
			const userInteraction = this.userInteraction;
			if (!userInteraction || !toEl) {
				return;
			}
			clearInterval(this.timer);
			documentUnpack({
				screenshotSrc: userInteraction.jpegScreenshotLink,
				width: userInteraction.pageWidthPx,
				height: userInteraction.pageHeightPx,
				viewElements: userInteraction.pageElements,
				toElement: toEl,
			});
		},
		back() {
			this.$router.push(`/task-interaction/${this.taskId}`);
		},
		enableBodyScrollBar(enabled: boolean) {
			const els = document.querySelectorAll('body, html');
			Array.from(els).forEach(
				(x: HTMLElement) => (x.style.overflow = enabled ? 'auto' : 'hidden')
			);
		},
	},
	mounted() {
		this.timer = setInterval(() => this.unpack(), 100);
		this.enableBodyScrollBar(false);
	},
	destroyed() {
		this.enableBodyScrollBar(true);
		clearInterval(this.timer);
	},
};
</script>
<style lang="less">
@toolbarHeight: 50px;

#site-view-box-wrapper {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	background-color: #fff;
	z-index: 99;
	overflow: auto;

	.v-toolbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
	}

	.v-toolbar,
	.v-toolbar__content {
		height: @toolbarHeight !important;
	}

	#content {
		padding-top: @toolbarHeight;
	}

	.v-card__text {
		padding: 0;
	}
}
</style>
