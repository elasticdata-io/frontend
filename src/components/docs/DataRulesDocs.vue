<template>
	<v-content>
		<v-container class="fill-height" fluid>
			<v-row>
				<v-col>
					<v-card>
						<v-card-title>
							<span>DATA RULES версії 2.0</span>
						</v-card-title>
						<v-card-text>
							<v-btn depressed small @click="back">
								<v-icon class="mr-2">keyboard_backspace</v-icon>
								Назад
							</v-btn>
							<v-row justify="center" class="pt-6">
								<v-col cols="12" class="search-nav">
									<v-row justify="center">
										<v-col cols="3">
											<v-select
												:items="groups"
												label="фільтрувати по группі"
												solo
												:hide-details="true"
											></v-select>
										</v-col>
										<v-col cols="3">
											<v-text-field
												flat
												solo
												hide-details
												prepend-inner-icon="search"
												label="або шукати"
											></v-text-field>
										</v-col>
									</v-row>
								</v-col>
								<v-col md="7">
									<v-row no-gutters align="center">
										<v-col cols="4" v-for="rule in rules">
											<div class="rule">
												<router-link tag="a" :to="rule.route">
													<span class="command">{{ rule.cmd }}</span>
													<span class="summary">{{ rule.summary }}</span>
												</router-link>
											</div>
										</v-col>
									</v-row>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-content>
</template>
<script>
export default {
	data: () => ({
		groups: ['всі', 'хочу змінити текст', 'хочу вибрати текст', 'маніпуляція ключами'],
		rules: [
			{
				cmd: 'only_number',
				summary: 'Залишити тільки цифри',
				route: { name: 'docs.data-rules.only_number' },
			},
			{
				cmd: 'trim',
				summary: 'Обрізати пусті символи по крям',
				route: { name: 'docs.data-rules.trim' },
			},
			{
				cmd: 'replace',
				summary: 'Знайти і замінити',
				route: { name: 'docs.data-rules.replace' },
			},
			{
				cmd: 'concat',
				summary: 'Обєднати декілька ключів',
				route: { name: 'docs.data-rules.concat' },
			},
			{
				cmd: 'extract',
				summary: 'Вибрати необхдний текст',
				route: { name: 'docs.data-rules.extract' },
			},
			{
				cmd: 'split',
				summary: 'Розбити текст на массив',
				route: { name: 'docs.data-rules.split' },
			},
		],
	}),
	methods: {
		back() {
			this.$router.back();
		},
	},
};
</script>
<style lang="less" scoped>
.search-nav {
	text-align: center;
	background: #f0f0f0;
}
.rule {
	padding: 10px;

	> a {
		border-radius: 5px;
		background-color: #fafafa;
		height: 8em;
		display: block;
		padding: 1em;
		color: #333333;
		text-decoration: none;

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
