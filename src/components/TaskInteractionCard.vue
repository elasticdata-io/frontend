<template>
	<v-card>
		<v-toolbar elevation="0">
			<v-toolbar-title>{{ tabName }}</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn text>
				<v-icon class="mr-2">history</v-icon>
				{{ timeExpired }}
			</v-btn>
		</v-toolbar>
		<v-card-text class="pt-0">
			<v-row no-gutters>
				<v-col md="12">
					<v-card>
						<v-img
							:src="userInteraction.jpegScreenshotLink"
							class="align-center white--text"
							gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
							height="350px"
						>
							<v-card-title class="justify-center">
								<v-badge bordered color="error" icon="pause arrow_back" overlap>
									<v-btn class="white--text" color="error" depressed>{{
										userInteraction.currentUrl
									}}</v-btn>
								</v-badge>
							</v-card-title>
						</v-img>
					</v-card>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>
<script type="ts">
import moment from "moment";

export default {
    data: () => ({
        timer: null,
        now: moment(),
    }),
    props: {
        userInteraction: {
            type: Object,
        },
        tabName: {
            type: String,
        }
    },
    computed: {
        timeExpired() {
            const end = moment(this.userInteraction.expiredOnUtc);
            const diff = Math.max(0, end.diff(this.now));
            const timeLeft = moment.utc(diff);
            return timeLeft.format('HH:mm:ss');
        },
    },
    created() {
        this.timer = setInterval(() => this.now = moment(), 1000);
    },
    destroyed() {
        clearInterval(this.timer);
    },
}
</script>
