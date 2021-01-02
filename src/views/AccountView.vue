<template>
	<v-content>
		<v-container>
			<v-row>
				<v-col>
					<v-card>
						<v-card-title>{{ user.firstName }} {{ user.lastName }}</v-card-title>
						<v-divider></v-divider>
						<v-card-text>
							<div class="mt-2">
								<a class="telegram" :href="telegramBotLink" target="_blank">
									<v-icon class="mr-2">near_me</v-icon>
									Telegram bot integration
								</a>
							</div>
							<div class="mt-7">
								<v-text-field
									label="First name"
									hide-details="auto"
									:value="user.firstName"
								></v-text-field>
							</div>
							<div class="mt-7">
								<v-text-field
									label="Last Name"
									hide-details="auto"
									:value="user.lastName"
								></v-text-field>
							</div>
							<div class="mt-7">
								<v-text-field
									label="Email"
									hide-details="auto"
									:value="user.email"
									disabled
								></v-text-field>
							</div>
							<div class="mt-7">
								<v-textarea
									label="API key"
									:value="user.apiToken"
									disabled
									rows="2"
									no-resize
								></v-textarea>
							</div>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-content>
</template>
<script lang="ts">
import { mapGetters } from 'vuex';
import { USER } from '@/store/user/getters.ts';

export default {
	computed: {
		...mapGetters('user', {
			user: USER,
		}),
		telegramBotLink: function() {
			return `https://t.me/elasticdataBot?start=${this.user.id}`;
		},
	},
};
</script>
<style lang="less" scoped>
.telegram {
	text-decoration: none;
	color: #000;

	&:hover {
		color: #3ca2d9;
	}

	.v-icon {
		background-color: #3ca2d9;
		color: white;
	}
}
</style>
