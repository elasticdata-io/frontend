<template>
	<v-content style="height: 100%;">
		<v-container>
			<v-row>
				<v-col md="12">
					<v-toolbar elevation="0">
						<v-btn depressed small>
							<v-icon class="mr-2">keyboard_backspace</v-icon>
							назад
						</v-btn>
						<v-toolbar-title class="ml-3"
							>instagram (собираем подписчиков)</v-toolbar-title
						>
						<v-spacer></v-spacer>
						<v-btn color="secondary" depressed dark>
							<v-icon>stop</v-icon>
							зупинити
						</v-btn>
					</v-toolbar>
				</v-col>
				<v-col md="12" class="text-center mt-7" v-if="false">
					Ця задача <strong>завершена</strong>. <br />Для докладного аналізу натісніть на
					кнопку:
					<br />
					<br />
					<router-link to="/" tag="span">
						<v-btn color="primary" depressed>аналізувати задачу</v-btn>
					</router-link>
				</v-col>
				<v-col md="12" class="text-center mt-7" v-if="false">
					Зачекайте, будь ласка...<br />
					Якщо павук буде зупинено, на сторінці буде відображена інформація про
					необхідніть Вашого втручання.
					<v-skeleton-loader type="text"></v-skeleton-loader>
				</v-col>
				<v-col md="4">
					<v-card>
						<v-toolbar elevation="0">
							<v-toolbar-title>Вкладка №1</v-toolbar-title>
							<v-spacer></v-spacer>
							<v-btn text>
								<v-icon class="mr-2">history</v-icon>
								00:14:23
							</v-btn>
						</v-toolbar>
						<v-card-text class="pt-0">
							<v-row no-gutters>
								<v-col md="12">
									<v-card>
										<v-img
											src="https://storage.elasticdata.io/5d97e3d304d18f0001adf90c/013a2764-b413-4e37-831b-2fccb21da204.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=elasticdataio%2F20201017%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20201017T225754Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=05d451d04fdc90d35a71cdaf207dbcfc0aa5cd3738814daa5d3633c438860237"
											class="align-center white--text"
											gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
											height="350px"
										>
											<v-card-title class="justify-center">
												<v-badge
													bordered
													color="error"
													icon="pause arrow_back"
													overlap
												>
													<v-btn
														class="white--text"
														color="error"
														depressed
													>
														https://www.instagram.com/...
													</v-btn>
												</v-badge>
											</v-card-title>
										</v-img>
									</v-card>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col md="4" v-if="false">
					<v-card>
						<v-toolbar elevation="0">
							<v-toolbar-title>Вкладка №2</v-toolbar-title>
						</v-toolbar>
						<v-card-text class="pt-0">
							<v-row no-gutters>
								<v-col md="12">
									<v-card>
										<v-img
											src="https://storage.elasticdata.io/5d97e3d304d18f0001adf90c/013a2764-b413-4e37-831b-2fccb21da204.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=elasticdataio%2F20201017%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20201017T225754Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=05d451d04fdc90d35a71cdaf207dbcfc0aa5cd3738814daa5d3633c438860237"
											class="align-center white--text"
											gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
											height="350px"
										>
											<v-card-title class="justify-center">
												<v-badge
													bordered
													color="error"
													icon="pause arrow_back"
													overlap
												>
													<v-btn
														class="white--text"
														color="error"
														depressed
													>
														https://www.instagram.com/...
													</v-btn>
												</v-badge>
											</v-card-title>
										</v-img>
									</v-card>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col md="4" v-if="false">
					<v-card>
						<v-toolbar elevation="0">
							<v-toolbar-title>Вкладка №3</v-toolbar-title>
						</v-toolbar>
						<v-card-text class="pt-0">
							<v-row no-gutters>
								<v-col md="12">
									<v-card>
										<v-img
											src="https://storage.elasticdata.io/5d97e3d304d18f0001adf90c/013a2764-b413-4e37-831b-2fccb21da204.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=elasticdataio%2F20201017%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20201017T225754Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=05d451d04fdc90d35a71cdaf207dbcfc0aa5cd3738814daa5d3633c438860237"
											class="align-center white--text"
											gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
											height="350px"
										>
											<v-card-title class="justify-center">
												<v-badge
													bordered
													color="error"
													icon="pause arrow_back"
													overlap
												>
													<v-btn
														class="white--text"
														color="error"
														depressed
													>
														https://www.instagram.com/...
													</v-btn>
												</v-badge>
											</v-card-title>
										</v-img>
									</v-card>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-content>
</template>
<script type="ts">
export default {
    name: 'Sandbox',
}
</script>
