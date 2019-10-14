<template>
	<div ref="root" class="chart-root"></div>
</template>
<script>
import c3 from 'c3';
import 'c3/c3.css';

import { debounce, cloneDeep, defaultsDeep } from 'lodash';
export default {
	name: 'c3-chart',
	props: {
		config: {
			type: Object,
			default: () => ({}),
		},
		data: {
			type: Object,
			default: () => ({
				// iris data from R
				columns: [['data1', 30], ['data2', 120]],
				type: 'pie',
				onclick: function(d, i) {
					console.log('onclick', d, i);
				},
				onmouseover: function(d, i) {
					console.log('onmouseover', d, i);
				},
				onmouseout: function(d, i) {
					console.log('onmouseout', d, i);
				},
			}),
		},
		type: {
			type: String,
			default: 'pie',
		},
	},
	watch: {
		data: {
			handler: 'reload',
			deep: true,
		},
		type: 'transform',
	},
	methods: {
		getArgs() {
			const data = this.getData();
			const config = this.getConfig();
			return defaultsDeep({ data }, config);
		},
		getData() {
			const { type } = this;
			const data = cloneDeep(this.data);
			return defaultsDeep({ type }, data);
		},
		getConfig() {
			const config = cloneDeep(this.config);
			const color = {
				pattern: [
					'#0a4f8a',
					'#0a88c2',
					'#75bcdd',
					'#E0E1E2',
					'#21BA45',
					'#DB2828',
					'#31CCEC',
					'#F2C037',
				],
			};
			const axis = {
				x: {
					type: 'category',
					padding: {
						left: 0,
						right: 0,
					},
					tick: {
						multiline: true,
					},
				},
			};
			return defaultsDeep({ axis, color }, config);
		},
		update: debounce(function update() {
			const data = this.getData();
			this.$chart.load(data);
			this.$emit('update', data);
		}, 500),
		transform: debounce(function transform(...args) {
			this.$chart.transform(...args);
		}, 100),
		reload: debounce(function reload() {
			this.$emit('reloading');
			this.$chart.unload();
			this.$nextTick(() => {
				this.update();
			});
		}, 700),
	},
	mounted() {
		const args = this.getArgs();
		this.$chart = c3.generate({
			bindto: this.$refs.root,
			...args,
		});
		this.$emit('init', args);
	},
	beforeDestroy() {
		this.$chart = this.$chart.destroy();
	},
};
</script>
<style lang="less"></style>
