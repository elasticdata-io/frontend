<template>
	<v-content>
		<link href="https://fonts.googleapis.com/css?family=Karla&display=swap" rel="stylesheet" />
		<v-container>
			<v-system-bar color="white" lights-out height="40">
				<v-btn depressed small>
					<v-icon class="mr-2">keyboard_backspace</v-icon> назад
				</v-btn>
				<v-divider vertical class="ml-4 "></v-divider>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn text color="secondary" class="font-weight-bold" v-on="on">
							<v-icon>link</v-icon>
							12
						</v-btn>
					</template>
					<span>Всього сторінок</span>
				</v-tooltip>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn text color="primary" class="font-weight-bold" v-on="on">
							<v-icon>insert_drive_file</v-icon>
							250
						</v-btn>
					</template>
					<span>Всього документів</span>
				</v-tooltip>
				<v-divider vertical class="ml-4 "></v-divider>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn text class="font-weight-bold" v-on="on">
							<v-icon>access_time</v-icon>
							03:12
						</v-btn>
					</template>
					<span>Всього затраченого часу</span>
				</v-tooltip>

				<v-divider vertical></v-divider>
				<v-spacer></v-spacer>
				<v-icon>mdi-wifi-strength-4</v-icon>
				<v-icon>mdi-signal-cellular-outline</v-icon>
				<v-icon>mdi-battery</v-icon>
				<span>Завершено</span>
			</v-system-bar>
			<v-row class="task">
				<v-col class="commands">
					<view-command
						:number="1"
						name="waitElement"
						:params="{ selector: '.ticket-item.new__ticket.t .item.ticket-title a' }"
					></view-command>
					<view-command
						:number="2"
						:running="true"
						name="waitAjax"
						:params="{ commands: [] }"
					></view-command>
					<view-command :number="3" name="loop" :params="{ commands: [] }"></view-command>
					<view-command
						:number="4"
						name="getText"
						:params="{
							key: 'link',
							attribute: 'href',
							selector: '.ticket-item.new__ticket.t$i .item.ticket-title a',
						}"
					></view-command>
				</v-col>
				<v-col class="preview">
					2
				</v-col>
			</v-row>
		</v-container>
	</v-content>
</template>
<script>
import ViewCommand from '../components/ViewCommand';
export default {
	components: {
		ViewCommand,
	},
};
</script>
<style lang="less">
.task {
	.commands {
	}
}
</style>
