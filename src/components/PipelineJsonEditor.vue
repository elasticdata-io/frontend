<template>
	<div class="json-editor">
		<v-dialog
			persistent
			v-model="dialog"
			fullscreen
			hide-overlay
			scrollable
			transition="dialog-bottom-transition"
			@keydown.esc="saveAndClose()"
		>
			<template v-slot:activator="{ on }">
				<v-btn
					:disabled="disabled"
					block
					depressed
					:elevation="btnElevation"
					v-on="on"
					:x-small="xSmall"
					:small="small"
				>
					<v-icon :class="!small && !x - small ? 'pr-2' : ''">{{ btnIcon }}</v-icon>
					{{ btnCaption }}
				</v-btn>
			</template>
			<v-card v-if="dialog">
				<v-toolbar class="toolbar" dark color="grey darken-3">
					<v-btn icon dark @click="dialog = false">
						<v-icon>close</v-icon>
					</v-btn>
					<v-toolbar-title>json: {{ title }}</v-toolbar-title>
					<div class="flex-grow-1"></div>
					<v-toolbar-items v-if="!readOnly">
						<v-btn text @click="save" class="mr-5">
							<v-icon>save</v-icon>
							<span class="pl-2">Зберегти</span>
						</v-btn>
						<v-btn dark text @click="saveAndClose">
							<v-icon>undo</v-icon>
							<span class="pl-2">Зберегти і закрити</span>
						</v-btn>
					</v-toolbar-items>
				</v-toolbar>
				<v-card-text class="pl-0 pr-0 pt-0 pb-0">
					<pre class="json" id="editor"><code>{{ editData }}</code></pre>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>
<script>
import * as ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/monokai';
import 'brace/ext/searchbox';

let editor;

export default {
	data: () => ({
		dialog: false,
		editData: '',
		textType: 'json',
	}),
	watch: {
		dialog: function(value) {
			if (value) {
				this.onOpenDialog();
			} else {
				this.onCloseDialog();
			}
		},
	},
	methods: {
		initData() {
			this.editData = this.json;
		},
		onOpenDialog() {
			this.initData();
			setTimeout(() => {
				editor = ace.edit('editor');
				editor.setTheme('ace/theme/monokai');
				editor.getSession().setMode(`ace/mode/${this.textType}`);
				editor.setOptions({ readOnly: this.readOnly });
			});
		},
		onCloseDialog() {
			if (editor) {
				setTimeout(() => {
					editor.destroy();
				});
			}
		},
		save() {
			let json = this.getEditData();
			this.$emit('save', json);
		},
		saveAndClose() {
			this.dialog = false;
			let json = this.getEditData();
			this.$emit('save', json);
		},
		getEditData() {
			return editor.getValue();
		},
	},
	props: {
		title: {
			type: String,
			default: '',
		},
		json: {},
		disabled: {
			type: Boolean,
			required: false,
			default: false,
		},
		readOnly: {
			type: Boolean,
			required: false,
			default: false,
		},
		small: {
			type: Boolean,
			required: false,
			default: false,
		},
		xSmall: {
			type: Boolean,
			required: false,
			default: false,
		},
		btnIcon: {
			type: String,
			required: false,
			default: 'create',
		},
		btnCaption: {
			type: String,
			required: false,
			default: 'json',
		},
		btnTooltip: {
			type: String,
			required: false,
			default: '',
		},
		btnElevation: {
			type: Number,
			required: false,
			default: 1,
		},
	},
};
</script>
<style lang="less">
.json-editor {
	.toolbar {
		max-height: 64px;
	}
}

#editor {
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
