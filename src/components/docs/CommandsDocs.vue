<template>
	<v-content>
		<v-container class="fill-height" fluid>
			<v-row>
				<v-col>
					<v-card>
						<v-card-title>
							<span>Commands версії 2.0</span>
						</v-card-title>
						<v-card-text>
							<v-btn depressed small @click="back">
								<v-icon class="mr-2">keyboard_backspace</v-icon>
								Назад
							</v-btn>
							<v-row justify="center" class="pt-6">
								<v-col cols="12" class="search-nav">
									<v-row justify="center">
										<v-col md="3" sm="6" xs="12">
											<v-select
												:items="groups"
												label="фільтрувати по группі"
												solo
												:hide-details="true"
											></v-select>
										</v-col>
										<v-col md="3" sm="6" xs="12">
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
								<v-col md="7" sm="12" cols="12">
									<v-row no-gutters align="center">
										<v-col
											md="4"
											sm="6"
											cols="12"
											v-for="command in commands"
											v-bind:key="command.cmd"
										>
											<div class="command-doc" :disabled="command.disabled">
												<router-link
													tag="a"
													:to="
														command.route || {
															name: 'docs.commands.view',
															params: { cmd: command.cmd },
														}
													"
												>
													<span class="command">{{ command.cmd }}</span>
													<span class="summary">{{
														command.summary
													}}</span>
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
import { COMMANDS } from '../../store/commands/getters';
import { mapGetters } from 'vuex';
import { FETCH_COMMANDS_DOCUMENTATION } from '../../store/commands/actions';

export default {
	data: () => ({
		groups: ['всі', 'вибрати текст', 'дія на сторінці'],
	}),
	computed: {
		...mapGetters('commands', {
			commands: COMMANDS,
		}),
	},
	methods: {
		back() {
			this.$router.push({ name: 'docs' });
		},
	},
	created() {
		this.$store.dispatch(`commands/${FETCH_COMMANDS_DOCUMENTATION}`);
	},
};
</script>
<style lang="less" scoped>
.search-nav {
	text-align: center;
	background: #f0f0f0;
}
.command-doc {
	padding: 10px;

	&[disabled='disabled'] {
		pointer-events: none;
		> a {
			color: gray;

			.command {
				color: gray;
			}
		}
	}

	> a {
		border-radius: 5px;
		background-color: #fafafa;
		height: 9em;
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
			font-family: 'Open Sans', Helvetica, sans-serif;
			font-size: 0.9em;
		}
	}
}
</style>
