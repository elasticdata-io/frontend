<template>
	<v-content>
		<v-container>
			<v-row>
				<v-col>
					<v-card>
						<v-card-title>{{ $t('USER_MENU.WORKERS') }}</v-card-title>
						<v-divider></v-divider>
						<v-card-text>
							<workers :workers="workers"></workers>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-content>
</template>
<script lang="ts">
import { mapGetters } from 'vuex';
import { FETCH_USER_WORKERS } from '@/store/workers/actions';
import { WORKERS_BY_USER } from '@/store/workers/getters';
import { USER } from '@/store/user/getters';
import Workers from '@/components/Workers.vue';

export default {
	components: {
		Workers,
	},
	computed: {
		...mapGetters('user', {
			USER: USER,
		}),
		...mapGetters('workers', {
			WORKERS_BY_USER: WORKERS_BY_USER,
		}),
		workers(): Worker[] {
			return this.WORKERS_BY_USER;
		},
	},
	methods: {},
	mounted() {
		this.$store.dispatch(`workers/${FETCH_USER_WORKERS}`, { userId: this.USER.id });
	},
};
</script>
<style lang="less" scoped></style>
