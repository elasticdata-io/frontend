<template>
	<v-content>
		<v-container class="fill-height" fluid>
			<v-row align="center" justify="center">
				<v-col sm="7" md="6" lg="5">
					<v-card class="elevation-2" ref="form">
						<v-card-text>
							<v-row justify="center">
								<v-col class="text-center" sm="10" md="10" lg="8" xl="8">
									<v-toolbar flat>
										<v-toolbar-title>Вхід/Реєстрація</v-toolbar-title>
									</v-toolbar>
									<v-btn
										block
										class="mt-2"
										color="secondary lighten-2"
										:href="'/api/oauth2/authorization/google'"
										>google</v-btn
									>
									<v-btn
										block
										class="mt-3"
										color="primary lighten-2"
										:href="'/api/oauth2/authorization/facebook'"
										>facebook</v-btn
									>
								</v-col>
							</v-row>
							<v-form v-if="showSimpleLogin" class="pt-6">
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
						<v-card-actions v-if="showSimpleLogin">
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
						<div class="links">
							<ul>
								<li>
									<a href="">Технічна підтримка</a>
								</li>
								<li>
									<a href="">Умови надання послуг</a>
								</li>
								<li>
									<a href="">Політика конфіденційності</a>
								</li>
							</ul>
							<div class="license">
								2019 elasticdata.io Всі права зареєстровано
							</div>
						</div>
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
import { LOGIN } from '../store/user/actions';

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
		showSimpleLogin: false,
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
						this.$store.dispatch(`user/${LOGIN}`, {
							login: this.login,
							token: body.token,
							userId: body.userId,
						});
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
			this.$store.commit(SET_SNACK_MESSAGE, {
				msg: body.bodyText || body.body || body.error,
			});
		},
	},
};
</script>
<style scoped lang="less">
.links {
	font-size: 0.8em;
	text-align: center;
	padding-bottom: 20px;

	li {
		display: inline-block;
		padding-right: 20px;
	}

	a {
		text-decoration: none;
	}

	.license {
		padding-top: 7px;
		color: #666;
	}
}
</style>
