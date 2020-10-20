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
            model: null,
			editor: null,
			id: `input-editor-${StringGenerator.generate()}`,
            defaultHeight: 200,
		};
	},
    computed: {},
	methods: {
        createModel() {
            if (this.jsonSchema && !this.model) {
                const modelUri = monaco.Uri.parse('a://s.json');
                monaco.languages
                    .json
                    .jsonDefaults
                    .setDiagnosticsOptions({
                        schemas: [
                            {
                                uri: "http://local/pipeline.json",
                                fileMatch: [modelUri.toString()],
                                schema: this.jsonSchema,
                            },
                        ],
                        validate: true,
                    });
                this.model = monaco.editor.createModel(this.code, 'json', modelUri);
            }
        },
        createEditor() {
            clearInterval(this.interval);
            this.interval = setInterval(() => {
                const el = document.getElementById(this.id);
                if (!el) {
                    return;
                }
                el.innerHTML = '';
                clearInterval(this.interval);
                this.createModel();
                const config = {
                    value: this.code,
                    theme: 'vs-dark',
                    language: 'json',
                    readOnly: this.readOnly,
                    model: undefined,
                };
                if (this.model) {
                    config.model = this.model;
                    delete config.value;
                    delete config.readOnly;
                }
                this.editor = monaco.editor.create(el, config);
                const options = {
                    fontSize: 12,
                    fontFamily: 'Monaco, "Ubuntu Mono", monospace',
                    tabSize: 2,
                    scrollBeyondLastLine: false,
                    renderWhitespace: false,
                    letterSpacing: 0.8,
                    scrollbar: {
                        useShadows: false,
                        horizontalScrollbarSize: 10,
                        verticalScrollbarSize: 10,
                        alwaysConsumeMouseWheel: false,
                    },
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
		if (this.model) {
            this.model.dispose();
        }
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
        jsonSchema: {
            type: Object,
        }
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
