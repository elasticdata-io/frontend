<template>
	<div>
		<div v-if="disconnected" class="text-center headline pa-3">
			{{ $t('TASK.INTERACTION_DISCONNECTED') }}
		</div>
		<div v-if="connected">
			<div :id="id"></div>
		</div>
	</div>
</template>
<script lang="ts">
import { documentUnpack } from 'web-page-teleport';
// eslint-disable-next-line no-unused-vars
import { UserInteraction } from '@/store/user-interaction';

export default {
	name: 'TeleportWebPage',
	data: () => ({
		id: 'teleport-web-page',
		timer: null,
	}),
	props: {
		userInteraction: {
			type: Object,
		},
		disconnected: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		interaction(): UserInteraction {
			return this.userInteraction || {};
		},
		connected() {
			return !this.disconnected;
		},
	},
	methods: {
		enableBodyScrollBar(enabled: boolean) {
			const els = document.querySelectorAll('body, html');
			Array.from(els).forEach(
				(x: HTMLElement) => (x.style.overflow = enabled ? 'auto' : 'hidden')
			);
		},
		unpack() {
			const toEl = document.getElementById(this.id);
			const interaction = this.interaction;
			if (!interaction || !toEl) {
				return;
			}
			clearInterval(this.timer);
			documentUnpack({
				screenshotSrc: interaction.jpegScreenshotLink,
				width: interaction.pageWidthPx,
				height: interaction.pageHeightPx,
				viewElements: interaction.pageElements,
				toElement: toEl,
			});
		},
	},
	mounted() {
		this.enableBodyScrollBar(false);
		this.timer = setInterval(() => this.unpack(), 100);
	},
	destroyed() {
		this.enableBodyScrollBar(true);
		clearInterval(this.timer);
	},
};
</script>
<style></style>
