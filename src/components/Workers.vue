<template>
	<v-simple-table>
		<template v-slot:default>
			<thead>
				<tr>
					<th class="text-left">
						Type
					</th>
					<th class="text-left">
						Started on
					</th>
					<th class="text-left">
						Public IP
					</th>
					<th class="text-left">
						Status
					</th>
					<th class="text-left">
						CPU total
					</th>
					<th class="text-left">
						Memory total
					</th>
					<th class="text-left">
						Cloud provider
					</th>
					<th class="text-left"></th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="worker in workers" :key="worker.uuid">
					<td>
						personal
					</td>
					<td>
						{{ fromNow(worker.createdOn) }}
					</td>
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
						<v-btn small color="secondary" @click="restartWorker(worker.uuid)">
							restart
						</v-btn>
					</td>
				</tr>
				<tr v-if="workers.length === 0">
					<td colspan="8">{{ $t('WORKERS.NOT_RUNNING') }}</td>
				</tr>
			</tbody>
		</template>
	</v-simple-table>
</template>
<script lang="ts">
import * as moment from 'moment';
import { FETCH_USER_WORKERS, WORKER_RESTART } from '@/store/workers/actions';
import { mapGetters } from 'vuex';
import { USER } from '@/store/user/getters';

export default {
	props: {
		workers: {
			type: Array,
		},
	},
	computed: {
		...mapGetters('user', {
			USER: USER,
		}),
	},
	methods: {
		fromNow(date) {
			return moment.utc(date).fromNow();
		},
		async restartWorker(uuid: string) {
			const yes = confirm(`Are you sure?`);
			if (!yes) {
				return;
			}
			await this.$store.dispatch(`workers/${WORKER_RESTART}`, { uuid });
			await this.$store.dispatch(`workers/${FETCH_USER_WORKERS}`, { userId: this.USER.id });
		},
	},
};
</script>
