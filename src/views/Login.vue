<template>
	<v-app id="inspire">
		<app-header></app-header>
		<v-content>
			<v-container class="fill-height" fluid>
				<v-row align="center" justify="center">
					<v-col cols="12" sm="8" md="4">
						<v-card class="elevation-2">
							<v-toolbar color="primary" dark flat>
								<v-toolbar-title>Login</v-toolbar-title>
								<div class="flex-grow-1"></div>
							</v-toolbar>
							<v-card-text>
								<v-form>
									<v-text-field
										label="Enter you login"
										name="login"
										prepend-icon="person"
										type="text"
										required
										v-model="login"
										@change="changeForm"
										@keyup.enter="doLogin"
									></v-text-field>

									<v-text-field
										id="password"
										label="Enter you password"
										name="password"
										prepend-icon="lock"
										type="password"
										required
										v-model="password"
										@change="changeForm"
										@keyup.enter="doLogin"
									></v-text-field>
								</v-form>
							</v-card-text>
							<v-card-actions>
								<div class="flex-grow-1"></div>
								<v-btn @click="doLogin" :disabled="loading">login</v-btn>
							</v-card-actions>
						</v-card>
					</v-col>
				</v-row>
			</v-container>
		</v-content>
	</v-app>
</template>

<script>
import AppHeader from '../components/AppHeader';
import { SET_SNACK_MESSAGE } from '../store/mutations';

export default {
	components: {
		AppHeader,
	},
	data: () => ({
		login: '',
		password: '',
		error: null,
		success: null,
		loading: false,
	}),
	created: function() {
		this.login = this.$localStorage.get('login');
		this.$localStorage.remove('token');
	},
	methods: {
		changeForm: function() {
			this.error = null;
		},
		doLogin: function() {
			this.loading = true;
			let params = {
				login: this.login,
				password: this.password,
			};
			this.$http
				.post('/api/login', params)
				.then(res => {
					this.loading = false;
					let body = res.body;
					this.error = body.error;
					this.success = body.message;
					if (body.success) {
						this.$localStorage.set('login', this.login);
						this.$localStorage.set('token', body.token);
						this.successRedirect();
					}
				})
				.catch(res => {
					this.loading = false;
					this.$store.commit(SET_SNACK_MESSAGE, res.bodyText || res.body);
				});
		},

		successRedirect: function() {
			this.$router.push('/');
		},
	},
};
</script>
