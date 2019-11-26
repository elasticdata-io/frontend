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
					<command-factory
						v-for="(command, index) in commands"
						:key="index"
						:number="index + 1 + ''"
						:cmd="command.cmd"
						:running="command.running"
						:params="command.params"
					></command-factory>
				</v-col>
				<v-col class="preview">
					2
				</v-col>
			</v-row>
		</v-container>
	</v-content>
</template>
<script>
import CommandFactory from '../components/commands/CommandFactory';
export default {
	components: {
		CommandFactory,
	},
	data: () => ({
		commands: [
			{
				cmd: 'url',
				params: {
					urls: [
						'http://rst.ua/oldcars/?task=newresults&results=1&saled=0&notcust=&sort=5&city=0&from=sform&start=40',
					],
				},
			},
			{
				cmd: 'loop',
				running: true,
				params: {
					maxIterations: 50,
					commands: [
						{
							cmd: 'pause',
							params: {
								timeout: 3,
							},
						},
						{
							cmd: 'waitElement',
							params: {
								selector: "//a[@id='next-page']",
								timeout: 30,
							},
						},
						{
							cmd: 'scrollTo',
							params: {
								position: 'top',
							},
						},
						{
							cmd: 'scrollTo',
							params: {
								position: 'top',
							},
						},
						{
							cmd: 'loop',
							params: {
								commands: [
									{
										cmd: 'getText',
										params: {
											key: 'link',
											attribute: 'href',
											selector:
												"//h3[@class='rst-ocb-i-h']/span[contains(text(), 'продам')]/../../../a[@class='rst-ocb-i-a']$i",
											prefix: 'http://rst.ua',
										},
									},
								],
							},
						},
						{
							cmd: 'click',
							params: {
								selector: "//a[@id='next-page']/..",
							},
						},
					],
				},
			},
		],
	}),
};
</script>
<style lang="less">
.task {
	.commands {
	}
}
</style>
