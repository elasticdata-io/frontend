<template>
	<v-content>
		<v-container class="fill-height" fluid>
			<v-row align="center" justify="center">
				<v-col cols="12" sm="8" md="4">
					<v-card class="elevation-2" ref="form">
						<v-toolbar flat>
							<v-toolbar-title>Авторизація</v-toolbar-title>
							<div class="flex-grow-1"></div>
						</v-toolbar>
						<v-card-text>
							<v-form>
								<v-text-field
									ref="login"
									:rules="[rules.required]"
									label="Ваш логін"
									name="login"
									type="text"
									v-model="login"
									@change="changeForm"
									@keyup.enter="doLogin"
								></v-text-field>

								<v-text-field
									ref="password"
									:rules="[rules.required]"
									label="Пароль"
									name="password"
									type="password"
									v-model="password"
									@change="changeForm"
									@keyup.enter="doLogin"
								></v-text-field>
							</v-form>
						</v-card-text>
						<v-card-actions>
							<div class="flex-grow-1"></div>
							<v-btn
								color="action"
								dark
								@click="doLogin"
								depressed
								:disabled="loading"
								>Вхід
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-content>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import { SET_SNACK_MESSAGE } from '../store/mutations';

export default {
	components: {},
	mixins: [validationMixin],
	data: () => ({
		login: '',
		password: '',
		error: null,
		success: null,
		loading: false,
		rules: {
			required: value => !!value || "Обов'язкове поле",
		},
	}),
	validations: {
		login: {
			required,
		},
		password: {
			required,
		},
	},
	computed: {
		form() {
			return {
				login: this.login,
				password: this.password,
			};
		},
	},
	created: function() {
		this.login = this.$localStorage.get('login');
		this.$localStorage.remove('token');
	},
	methods: {
		changeForm: function() {
			this.error = null;
		},
		formValidate() {
			let formIsValid = true;
			Object.keys(this.form).forEach(f => {
				this.$refs[f].validate(true);
				if (!this.form[f]) {
					formIsValid = false;
				}
			});
			return formIsValid;
		},
		doLogin: function() {
			const formIsValid = this.formValidate();
			if (!formIsValid) {
				return;
			}
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
					if (body.success && body.token && body.userId) {
						this.$localStorage.set('login', this.login);
						this.$localStorage.set('token', body.token);
						this.$localStorage.set('userId', body.userId);
						this.successRedirect();
					} else {
						this.handleServerError(body);
					}
				})
				.catch(body => this.handleServerError(body));
		},

		successRedirect: function() {
			this.$router.push('/');
		},

		handleServerError(body) {
			this.loading = false;
			this.$store.commit(SET_SNACK_MESSAGE, body.bodyText || body.body || body.error);
		},
	},
};
</script>
