<template>
	<v-content>
		<v-container>
			<v-row>
				<v-col>
					<v-card>
						<v-card-title>
							<v-toolbar elevation="0">
								<v-toolbar-title>{{ $t('USER_MENU.WORKERS') }}</v-toolbar-title>
								<v-spacer></v-spacer>
								<v-btn
									class="ml-5"
									small
									depressed
									to="/workers/settings"
									color="secondary"
								>
									<v-icon class="mr-2">settings</v-icon>
									{{ $t('SETTINGS') }}
								</v-btn>
							</v-toolbar>
						</v-card-title>
						<v-divider></v-divider>
						<v-card-text>
							<router-view></router-view>
							<workers></workers>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-content>
</template>
<script lang="ts">
import Workers from '@/components/Workers.vue';

export default {
	components: {
		Workers,
	},
};
</script>
<style lang="less" scoped></style>
