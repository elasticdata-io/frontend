<template>
	<ul class="loop-pagination">
		<li
			v-for="index in length"
			:key="index"
			:class="{ active: activeIndex === index - 1 }"
			@click="setActiveIndex(index - 1)"
		>
			<a href="javascript:void(0)">
				{{ index - 1 }}
			</a>
		</li>
	</ul>
</template>
<script>
export default {
	name: 'LoopPagination',
	methods: {
		setActiveIndex(newIndex) {
			if (this.activeIndex === this.newIndex) {
				return;
			}
			this.$emit('change', newIndex);
		},
	},
	props: {
		length: {
			type: Number,
			required: true,
		},
		activeIndex: {
			type: Number,
			required: true,
		},
	},
};
</script>
<style lang="less">
@import '../../less/var';

.loop-pagination {
	margin: 0;
	padding: 0;

	li {
		display: inline-block;
		padding: 0 5px 0 5px;
		color: #999;
		font-family: @ubuntu-mono;

		&:hover {
			background-color: #fff;

			a {
				color: #333;
			}
		}

		&.active {
			a {
				font-weight: bold;
				text-decoration: underline;
			}
		}

		a {
			text-decoration: none;
			color: #333;
		}
	}
}
</style>
