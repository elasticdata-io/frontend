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
				<v-btn :disabled="disabled" block depressed elevation="1" v-on="on">
					<v-icon class="pr-2">create </v-icon>
					yaml
				</v-btn>
			</template>
			<v-card v-if="dialog">
				<v-toolbar class="toolbar" dark color="grey darken-3">
					<v-btn icon dark @click="dialog = false">
						<v-icon>close</v-icon>
					</v-btn>
					<v-toolbar-title>yaml: {{ title }}</v-toolbar-title>
					<div class="flex-grow-1"></div>
					<v-toolbar-items>
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
					<pre id="editor"><code>{{ editData }}</code></pre>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>
<script>
import * as YAML_JS from 'yamljs';
import * as YAML from 'json-to-pretty-yaml';
import 'brace/mode/yaml';
import PipelineJsonEditor from './PipelineJsonEditor';

export default {
	mixins: [PipelineJsonEditor],
	data: () => ({
		textType: 'yaml',
	}),
	methods: {
		initData() {
			this.editData = YAML.stringify(JSON.parse(this.json || '{"commands": []}'));
		},
		save() {
			let yaml = this.getEditData();
			const json = JSON.stringify(YAML_JS.parse(yaml));
			this.$emit('save', json);
		},
		saveAndClose() {
			this.dialog = false;
			let yaml = this.getEditData();
			const json = JSON.stringify(YAML_JS.parse(yaml));
			this.$emit('save', json);
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
	}
}
</style>
