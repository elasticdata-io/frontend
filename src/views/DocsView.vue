<template>
	<v-content>
		<v-container class="fill-height" fluid>
			<v-row>
				<v-col>
					<v-card>
						<v-card-title>
							<span>Документація DSL версії 2.0</span>
						</v-card-title>
						<v-card-text>
							<div class="block">
								<router-link tag="a" :to="{ name: 'docs.commands' }">
									<span class="command">
										commands
									</span>
									<span class="summary">
										Команди взаємоції зі сторінкою
									</span>
								</router-link>
							</div>
							<div class="block">
								<router-link tag="a" :to="{ name: 'docs.data-rules' }">
									<span class="command">
										data rules
									</span>
									<span class="summary">
										Правила форматування тексту
									</span>
								</router-link>
							</div>
							<div class="block disabled">
								<router-link tag="a" :to="{ name: 'docs.docs.settings' }">
									<span class="command">
										pipeline settings
									</span>
									<span class="summary">
										Налуштування павука (мова, screen size, proxy та інше)
									</span>
								</router-link>
							</div>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-content>
</template>
<script>
export default {};
</script>
<style lang="less" scoped>
.block {
	margin: 1em 0;
	overflow: hidden;

	&.disabled {
		> a {
			pointer-events: none;
			cursor: text;
			color: gray;

			.command {
				color: gray;
			}
		}
	}

	> a {
		border-radius: 5px;
		background-color: #fafafa;
		height: 10em;
		display: block;
		padding: 1em;
		color: #333333;
		text-decoration: none;

		&:hover {
			background-color: #ecf7fa;
		}

		.command {
			white-space: nowrap;
			overflow: hidden;
			-ms-text-overflow: ellipsis;
			-o-text-overflow: ellipsis;
			text-overflow: ellipsis;
			display: block;
			margin: 0 0 15px 0;
			color: #0066aa;
			text-transform: uppercase;
		}

		.summary {
			display: block;
			line-height: 1.5em;
		}
	}
}
</style>
