<template>
	<pre class="input-editor" :id="id"><code>{{ code }}</code></pre>
</template>
<script>
import * as ace from 'brace';
import 'brace/theme/monokai';
import 'brace/ext/searchbox';
import 'brace/mode/yaml';
import 'brace/mode/json';
import { StringGenerator } from '../lib/string.generator';

export default {
	data: () => {
		return {
			interval: null,
			editor: null,
			id: `input-editor-${StringGenerator.generate()}`,
		};
	},
	methods: {
		updateHeight() {
			const editor = this.editor;
			const newHeight =
				editor.getSession().getScreenLength() * editor.renderer.lineHeight +
				editor.renderer.scrollBar.getWidth();
			editor.setOptions({ maxLines: newHeight, readOnly: true });
			this.setSelection();
		},
		setMode() {
			const editor = this.editor;
			editor.getSession().setMode(`ace/mode/${this.mode}`);
			this.setSelection();
		},
		setSelection() {
			if (this.selectionText === undefined) {
				return;
			}
			const editor = this.editor;
			const startRange = editor.find(this.selectionText);
			startRange.start.column = 0;
			startRange.end.column = Number.MAX_VALUE;
			editor.selection.setRange(startRange);
		},
		init() {
			const interval = (this.interval = setInterval(() => {
				const el = document.getElementById(this.id);
				if (el) {
					clearInterval(interval);
				}
				const editor = (this.editor = ace.edit(this.id));
				editor.setTheme('ace/theme/monokai');
				this.setMode();
				this.updateHeight();
				this.setSelection();
			}, 200));
		},
	},
	mounted() {
		this.init();
	},
	destroyed() {
		clearInterval(this.interval);
	},
	watch: {
		code: function() {
			const editor = this.editor;
			editor.getSession().setValue(this.code);
			this.updateHeight();
		},
		mode: function() {
			this.setMode();
		},
	},
	props: {
		code: {
			type: String,
			required: true,
		},
		mode: {
			type: String,
			required: true,
		},
		selectionText: {
			type: String,
		},
		readOnly: {
			type: Boolean,
			default: true,
		},
	},
};
</script>
<style lang="less">
.input-editor {
	height: 200px;

	code {
		visibility: hidden;
	}

	.ace_content * {
		font-family: Monaco, 'Ubuntu Mono', monospace;
	}
}
</style>
