<template>
	<div :id="id" :style="{ height: height ? `${height}px` : 'auto' }"></div>
</template>
<script lang="ts">
import * as monaco from 'monaco-editor';
import { StringGenerator } from "@/lib/string.generator";

export default {
	data: () => {
		return {
			interval: null,
			editor: null,
			id: `input-editor-${StringGenerator.generate()}`,
            defaultHeight: 200,
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
                el.innerHTML = '';
                clearInterval(this.interval);
                this.editor = monaco.editor.create(el, {
                    value: this.code,
                    language: this.mode,
                    theme: 'vs-dark',
                    readOnly: this.readOnly,
                });
                const options = {
                    fontSize: 14,
                    fontFamily: 'Monaco, "Ubuntu Mono", monospace',
                    tabSize: 2,
                    scrollBeyondLastLine: false,
                    renderWhitespace: true,
                    letterSpacing: 0.8,
                }
                this.editor.updateOptions(options);
                this.updateEditorHeight();
            }, 30);
        },
        updateEditorHeight() {
            if (this.height) {
                return;
            }
            const editor = this.editor;
            const editorElement = editor.getDomNode();
            if (!editorElement) {
                return
            }
            const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
            const lineCount = editor.getModel()?.getLineCount() || 1;
            const height = editor.getTopForLineNumber(lineCount + 1) + lineHeight;
            const el = document.getElementById(this.id);
            el.style.height = `${Math.min(height, this.maxHeight)}px`;
            editor.layout();
        },
	},
	mounted() {
        this.createEditor();
	},
	destroyed() {
		clearInterval(this.interval);
		console.log('destroyed')
	},
	watch: {
		code: function(oldCode, newCode) {
            if (oldCode === newCode) {
                return;
            }
            const options = {
                value: this.code,
            }
            this.editor.updateOptions(options);
		},
		mode: function(oldMode, newMode) {
			if (oldMode === newMode) {
                return;
            }
			this.createEditor();
		},
        fakeUpdated: function() {
			this.createEditor();
		}
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
		height: {
			type: Number,
			default: null,
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
.input-editor {
	//transition: height 0.35s ease-out;

	code {
		visibility: hidden;
	}

	.ace_content * {
		font-family: Monaco, 'Ubuntu Mono', monospace;
	}
}
</style>
