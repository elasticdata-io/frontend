<script>
import * as YAML from 'json-to-pretty-yaml';

export default {
	computed: {
		example: function() {
			if (this.mode === 'json') {
				return JSON.stringify(this.code, null, 4);
			}
			return YAML.stringify(this.code);
		},
		outputDataExample: function() {
			return JSON.stringify(this.outputData, null, 4);
		},
	},
	data: () => {
		return {
			mode: 'json',
			cmd: '',
		};
	},
	methods: {
		switchMode(mode) {
			this.mode = mode;
		},
	},
};
</script>
