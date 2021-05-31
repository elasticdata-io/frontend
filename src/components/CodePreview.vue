<template>
	<pre class="json" :id="id" :style="{ height: height ? `${height}px` : 'auto' }">{{ code }}</pre>
</template>
<script lang="ts">
import * as ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/monokai';
import 'brace/ext/searchbox';
import { StringGenerator } from '@/lib/string.generator';

export default {
	data: () => {
		return {
			interval: null,
			editor: null,
			id: `input-editor-${StringGenerator.generate()}`,
		};
	},
	computed: {},
	methods: {
		createEditor() {
			clearInterval(this.interval);
			this.interval = setInterval(() => {
				const el = document.getElementById(this.id);
				if (!el) {
					return;
				}
				clearInterval(this.interval);
				this.editor = ace.edit(this.id);
				this.editor.setTheme('ace/theme/monokai');
				this.editor.getSession().setMode(`ace/mode/${this.mode}`);
				this.editor.setOptions({ readOnly: this.readOnly });
			}, 30);
		},
		updateEditorHeight() {},
	},
	mounted() {
		this.createEditor();
	},
	destroyed() {
		clearInterval(this.interval);
	},
	watch: {
		mode: function(oldMode, newMode) {
			if (oldMode === newMode) {
				return;
			}
			this.createEditor();
		},
		fakeUpdated: function() {
			this.createEditor();
		},
	},
	props: {
		code: {
			type: String,
			required: true,
		},
		mode: {
			type: String,
			default: 'json',
		},
		selectionText: {
			type: String,
		},
		readOnly: {
			type: Boolean,
			default: true,
		},
		height: {
			type: Number,
			default: 300,
		},
		maxHeight: {
			type: Number,
			default: 500,
		},
		fakeUpdated: {
			type: Date,
			required: false,
		},
	},
};
</script>
<style lang="less">
.json {
	height: calc(100vh - 64px);

	code {
		visibility: hidden;
	}

	.ace_content * {
		font-family: Monaco, 'Ubuntu Mono', monospace;
		/*font-weight: 400;*/
		/*font-size: 13px;*/
		/*line-height: 1.35;*/
		/*letter-spacing: 0.32px;*/
	}
}
</style>
