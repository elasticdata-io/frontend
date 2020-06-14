<template>
	<v-content>
		<v-container class="fill-height" fluid>
			<v-row>
				<v-col>
					<v-card>
						<v-card-title>
							<span>Команди версії 2.0</span>
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
												v-model="group"
												:items="groups"
												label="фільтрувати по группі"
												solo
												:hide-details="true"
											></v-select>
										</v-col>
										<v-col md="3" sm="6" xs="12">
											<v-text-field
												flat
												clearable
												solo
												hide-details
												prepend-inner-icon="search"
												label="або шукати"
												v-model="search"
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
											v-for="command in displayCommands"
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
										<v-col v-if="emptyResult" md="12" sm="12">
											<div class="text-center pa-8">
												За вашим запитом нічого не знайдено
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
		search: null,
		group: null,
		groups: [
			{
				text: 'всі',
				value: null,
			},
			{
				text: 'вибрати текст',
				value: 'SELECTABLE',
			},
			{
				text: 'дія на сторінці',
				value: 'ACTION',
			},
			{
				text: 'інше',
				value: 'OTHER',
			},
		],
	}),
	computed: {
		...mapGetters('commands', {
			commands: COMMANDS,
		}),
		displayCommands: function() {
			let commands = this.commands;
			if (this.group) {
				commands = this.commands.filter(command => command.type === this.group);
			}
			const search = (this.search || '').toLowerCase();
			if (!search) {
				return commands;
			}
			return commands.filter(command => {
				return (
					command.cmd.toLowerCase().includes(search) ||
					(command.summary && command.summary.toLowerCase().includes(search)) ||
					(command.description && command.description.toLowerCase().includes(search)) ||
					command.props.find(p => p.name.toLowerCase().includes(search))
				);
			});
		},
		emptyResult: function() {
			return this.displayCommands.length === 0;
		},
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
