<template>
	<div>
		<div class="http-transport-layer" v-if="loading">
			<div class="overlay"></div>
			<div class="ticker">
				<div class="line"></div>
			</div>
		</div>
	</div>
</template>
<script>
import Vue from 'vue';

export default {
	name: 'HttpTransportLayer',
	data: () => {
		return {
			pending: 0,
			loading: false,
		};
	},
	methods: {
		start() {
			this.pending++;
			this.loopTik();
		},
		end() {
			this.pending--;
			if (this.pending === 0) {
				this.loading = false;
			}
		},
		loopTik() {
			setTimeout(() => {
				if (this.pending === 0) {
					return;
				}
				this.loading = true;
			}, 200);
		},
	},
	created: function() {
		Vue.http.interceptors.push((request, next) => {
			this.start();
			next(() => {
				this.end();
			});
		});
	},
};
</script>
<style scoped lang="less">
.http-transport-layer {
	position: fixed;
	z-index: 1000;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;

	.overlay {
		background: rgb(238, 238, 238);
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0.8;
		z-index: 1;
	}

	.ticker {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		z-index: 1001;

		.line {
			-webkit-animation: slidein 1s infinite;
			animation: slidein 1s infinite;
			-webkit-animation-timing-function: cubic-bezier(0.4, 0, 1, 1);
			animation-timing-function: cubic-bezier(0.4, 0, 1, 1);
			-webkit-animation-delay: 0.1s;
			animation-delay: 0.1s;

			position: absolute;
			top: 0;
			left: 0;
			width: 25%;
			height: 100%;
			background: red;
			-webkit-transform-origin: 0 0;
			transform-origin: 0 0;

			-webkit-transform: scaleX(0);
			transform: scaleX(0);

			@keyframes slidein {
				0% {
					-webkit-transform: scaleX(0);
					transform: scaleX(0);
				}

				50% {
					-webkit-transform: scaleX(5);
					transform: scaleX(5);
				}

				100% {
					-webkit-transform: scaleX(5) translateX(100%);
					transform: scaleX(5) translateX(100%);
				}
			}
		}
	}
}
</style>
