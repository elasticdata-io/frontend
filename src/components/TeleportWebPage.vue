<template>
	<div>
		<div v-if="disconnected" class="text-center headline pa-3">
			{{ $t('TASK.INTERACTION_DISCONNECTED') }}
		</div>
		<div v-if="connected">
			<div :id="id"></div>
		</div>
		<v-menu
			v-if="connected"
			:position-x="contextMenuX"
			:position-y="contextMenuY"
			fixed
			v-model="contextMenuVisible"
			transition="scale-transition"
		>
			<v-card>
				<v-card-text class="text-center">
					<v-btn disabled text>
						<strong>{{ selectedViewEl.tag }}</strong>
					</v-btn>
				</v-card-text>
				<v-list>
					<v-list-item>
						<v-list-item-title>
							<v-btn text @click="triggerClick">
								<v-icon class="mr-2">mouse</v-icon>
								left click
							</v-btn>
						</v-list-item-title>
					</v-list-item>
					<v-list-item>
						<v-list-item-title>
							<v-btn text>
								<v-icon class="mr-2">keyboard</v-icon>
								type text
							</v-btn>
						</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-card>
		</v-menu>
	</div>
</template>
<script lang="ts">
import { documentUnpack } from 'web-page-teleport';
// eslint-disable-next-line no-unused-vars
import { UserInteraction } from '@/store/user-interaction';
// eslint-disable-next-line no-unused-vars
import { TeleportCanvasEvent } from 'web-page-teleport/src/lib/page-reconstruction';

export default {
	name: 'TeleportWebPage',
	data: () => ({
		id: 'teleport-web-page',
		timer: null,
		contextMenuVisible: false,
		contextMenuX: 0,
		contextMenuY: 0,
		selectedFakeId: null,
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
		selectedViewEl() {
			return this.interaction.pageElements.find(x => x.fakeId === this.selectedFakeId) || {};
		},
	},
	methods: {
		enableBodyScrollBar(enabled: boolean) {
			const els = document.querySelectorAll('body, html');
			Array.from(els).forEach(
				(x: HTMLElement) => (x.style.overflow = enabled ? 'auto' : 'hidden')
			);
		},
		async unpack() {
			const toEl = document.getElementById(this.id);
			const interaction = this.interaction;
			if (!interaction || !toEl) {
				return;
			}
			clearInterval(this.timer);
			const canvas = await documentUnpack({
				screenshotSrc: interaction.jpegScreenshotLink,
				width: interaction.pageWidthPx,
				height: interaction.pageHeightPx,
				viewElements: interaction.pageElements,
				toElement: toEl,
			});
			canvas.onRightClick((e: TeleportCanvasEvent) => {
				e.originEvent.preventDefault();
				const canvasBox = document.querySelector('canvas').getBoundingClientRect();
				this.contextMenuVisible = true;
				this.contextMenuX = e.originEvent.offsetX + canvasBox.x;
				this.contextMenuY = e.originEvent.offsetY + canvasBox.y;
				this.selectedFakeId = e.fakeId;
			});
			canvas.onLeftClick(() => (this.contextMenuVisible = false));
		},
		triggerClick() {
			this.$emit('clickToEl', this.selectedFakeId);
		},
	},
	mounted() {
		this.enableBodyScrollBar(false);
		this.timer = setInterval(async () => this.unpack(), 100);
	},
	destroyed() {
		this.enableBodyScrollBar(true);
		clearInterval(this.timer);
	},
};
</script>
<style></style>
