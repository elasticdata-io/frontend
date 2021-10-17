<template>
	<v-content>
		<v-container>
			<v-row>
				<v-col>
					<v-card>
						<v-card-title>{{ $t('USER_MENU.WORKERS') }}</v-card-title>
						<v-divider></v-divider>
						<v-card-text>
							<v-simple-table>
								<template v-slot:default>
									<thead>
										<tr>
											<th class="text-left">
												name
											</th>
											<th class="text-left">
												status
											</th>
											<th class="text-left">
												cpu
											</th>
											<th class="text-left">
												memory
											</th>
											<th class="text-left">
												provider
											</th>
											<th class="text-left"></th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="worker in workers" :key="worker.podKey">
											<td>
												{{ worker.ip }}
											</td>
											<td>
												{{ worker.status }}
											</td>
											<td>
												{{ worker.cpu }}
											</td>
											<td>
												{{ worker.memory }}
											</td>
											<td>
												{{ worker.cloudProvider }}
											</td>
											<td>
												<v-btn
													color="primary"
													@click="restartWorker(worker.podKey)"
												>
													restart
												</v-btn>
											</td>
										</tr>
									</tbody>
								</template>
							</v-simple-table>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-content>
</template>
<script lang="ts">
import { mapGetters } from 'vuex';
import { FETCH_USER_WORKERS, WORKER_RESTART } from '@/store/workers/actions';
import { WORKERS_BY_USER } from '@/store/workers/getters';

export default {
	computed: {
		...mapGetters('workers', {
			WORKERS_BY_USER: WORKERS_BY_USER,
		}),
		workers(): Worker[] {
			return this.WORKERS_BY_USER;
		},
	},
	methods: {
		restartWorker(podKey: string) {
			this.$store.dispatch(`workers/${WORKER_RESTART}`, { podKey });
		},
	},
	mounted() {
		this.$store.dispatch(`workers/${FETCH_USER_WORKERS}`);
	},
};
</script>
<style lang="less" scoped></style>
