<template>
	<v-content>
		<v-container>
			<v-row>
				<v-col>
					<v-card>
						<v-card-title>Увійти під користувачем</v-card-title>
						<v-divider></v-divider>
						<v-card-text>
							<v-list two-line>
								<v-list-item-group>
									<template v-for="(user, index) in users">
										<v-list-item :key="user.login">
											<template v-slot:default="{ active, toggle }">
												<v-list-item-content>
													<v-list-item-title></v-list-item-title>
													{{ user.email || user.login }}
													<v-list-item-subtitle
														>{{ user.firstName }}
														{{ user.lastName }}</v-list-item-subtitle
													>
												</v-list-item-content>

												<v-list-item-action>
													<v-btn
														depressed
														small
														@click="loginByUser(user.id)"
														>увійти під
													</v-btn>
												</v-list-item-action>
											</template>
										</v-list-item>
										<v-divider
											v-if="index + 1 < users.length"
											:key="index"
										></v-divider>
									</template>
								</v-list-item-group>
							</v-list>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-content>
</template>
<script>
import { FETCH_USERS, LOGIN_BY_USER } from '../store/users/actions';
import { USERS } from '../store/users/getters';
import { mapGetters } from 'vuex';

export default {
	computed: {
		...mapGetters('users', {
			users: USERS,
		}),
	},
	methods: {
		async loginByUser(userId) {
			await this.$store.dispatch(`users/${LOGIN_BY_USER}`, { userId });
			this.$router.push('/');
		},
	},
	created() {
		this.$store.dispatch(`users/${FETCH_USERS}`);
	},
};
</script>
