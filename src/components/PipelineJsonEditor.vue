<template>
	<div class="json-editor">
		<v-dialog
			v-model="dialog"
			fullscreen
			hide-overlay
			scrollable
			transition="dialog-bottom-transition"
		>
			<template v-slot:activator="{ on }">
				<v-btn block depressed elevation="1" v-on="on">
					<v-icon class="pr-2">create </v-icon>
					json
				</v-btn>
			</template>
			<v-card v-if="dialog">
				<v-toolbar class="toolbar" dark color="grey darken-3">
					<v-btn icon dark @click="dialog = false">
						<v-icon>close</v-icon>
					</v-btn>
					<v-toolbar-title>json: {{ title }}</v-toolbar-title>
					<div class="flex-grow-1"></div>
					<v-toolbar-items>
						<v-btn dark text @click="save">
							<v-icon>save</v-icon>
							<span class="pl-2">Зберегти</span>
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
		json: {
			type: String,
			required: false,
			default: '',
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
