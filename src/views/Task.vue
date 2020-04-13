<template>
	<v-content>
		<link href="https://fonts.googleapis.com/css?family=Karla&display=swap" rel="stylesheet" />
		<v-container>
			<v-system-bar color="white" lights-out height="40">
				<v-btn depressed small @click="back">
					<v-icon class="mr-2">keyboard_backspace</v-icon>
					назад
				</v-btn>
				<v-divider vertical class="ml-4 "></v-divider>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn text color="secondary" class="font-weight-bold" v-on="on">
							<v-icon>link</v-icon>
							{{ totalPages }}
						</v-btn>
					</template>
					<span>Всього сторінок</span>
				</v-tooltip>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn text color="primary" class="font-weight-bold" v-on="on">
							<v-icon>insert_drive_file</v-icon>
							{{ totalKeys }}
						</v-btn>
					</template>
					<span>Всього зібраних ключів</span>
				</v-tooltip>
				<v-divider vertical class="ml-4 "></v-divider>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn text class="font-weight-bold" v-on="on">
							<v-icon>access_time</v-icon>
							{{ totalTime }}
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
				<v-col class="commands" cols="6">
					<v-card>
						<command-factory
							v-for="(command, index) in commands"
							:key="index"
							:number="index + 1 + ''"
							:cmd="command.cmd"
							:running="command.running"
							:params="command.params"
							:success="command.success"
						></command-factory>
					</v-card>
				</v-col>
				<v-col class="preview" cols="6">
					<v-card>
						<v-tabs v-model="tab">
							<v-tab key="data">Данні</v-tab>
							<v-tab key="snapshot">snapshots</v-tab>
						</v-tabs>
						<v-tabs-items v-model="tab">
							<v-tab-item key="data">
								<v-card flat>
									<v-card-text>{{ taskData }}</v-card-text>
								</v-card>
							</v-tab-item>
							<v-tab-item key="snapshot">
								<v-card flat>
									<v-card-text>
										<iframe
											width="100%"
											src="https://vuetifyjs.com/ru/components/tabs/"
											height="300"
											style="border: 1px solid #ddd;"
										/>
									</v-card-text>
								</v-card>
							</v-tab-item>
						</v-tabs-items>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-content>
</template>
<script>
import CommandFactory from '../components/commands/CommandFactory';
import {
	FETCH_TASK,
	FETCH_TASK_COMMANDS_INFORMATION,
	FETCH_TASK_DATA,
} from '../store/task/actions';
import { TASK, TASK_COMMANDS_INFORMATION, TASK_DATA } from '../store/task/getters';
import moment from 'moment';
import { flatten } from 'flat';
import { mapGetters } from 'vuex';

export default {
	components: {
		CommandFactory,
	},
	data: () => ({
		commands1: [
			{
				cmd: 'loop',
				params: {
					maxIterations: 300,
					commands: [
						{
							cmd: 'url',
							params: {
								source: {
									class: 'fromHttp',
									url:
										'https://app.elasticdata.io/api/pipeline/data/5dc9578eba087e0001815e29',
									property: 'link',
								},
								timeout: 30,
							},
						},
						{
							cmd: 'getUrl',
							params: {
								key: 'post_url',
							},
						},
						{
							cmd: 'condition',
							params: {
								ifCommand: {
									cmd: 'waitElement',
									params: {
										selector:
											"//div[contains(@class, 'link-phone')]/span[contains(text(), 'Показать')]",
										timeout: 30,
									},
								},
								trueCommands: [
									{
										cmd: 'getText',
										params: {
											key: 'post_id',
											selector:
												"//div//small[contains (text(), 'Номер объявления')]",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'brand',
											selector:
												"//table[contains(@class,'details')]//th[contains(text(),'Марка')]/..//strong",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'model',
											selector:
												"//table[contains(@class,'details')]//th[contains(text(),'Модель')]/..//strong",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'year',
											selector:
												"//table[contains(@class,'details')]//th[contains(text(),'Год выпуск')]/..//strong",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'body',
											selector:
												"//table[contains(@class,'details')]//th[contains(text(),'Тип кузова')]/..//strong",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'odometer',
											selector:
												"//table[contains(@class,'details')]//th[contains(text(),'Пробег')]/..//strong",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'engine',
											selector:
												"//table[contains(@class,'details')]//th[contains(text(),'Объем двигателя')]/..//strong",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'fuel',
											selector:
												"//table[contains(@class,'details')]//th[contains(text(),'Вид топлива')]/..//strong",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'transmission',
											selector:
												"//table[contains(@class,'details')]//th[contains(text(),'Коробка передач')]/..//strong",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'color',
											selector:
												"//table[contains(@class,'details')]//th[contains(text(),'Цвет')]/..//strong",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'options',
											selector:
												"//table[contains(@class,'details')]//th[contains(text(),'Доп. опции')]/..//strong",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'seller_city',
											selector:
												"//div[@class='offer-titlebox__details']//a[@class='show-map-link']",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'post_date',
											required: false,
											selector:
												"//div//a[contains (text(), 'Опубликовано')]/..",
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'description',
											selector:
												"//div[contains(@class,'descriptioncontent')]//div[@id='textContent']",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'price',
											selector: "//div[@class='price-label']/strong",
											required: false,
										},
									},
									{
										cmd: 'waitElement',
										params: {
											selector:
												"//div[contains(@class, 'link-phone')]/span[contains(text(), 'Показать')]",
										},
									},
									{
										cmd: 'click',
										params: {
											selector:
												"//div[contains(@class, 'link-phone')]/span[contains(text(), 'Показать')]",
											timeout: 10,
										},
									},
									{
										cmd: 'pause',
										params: {
											timeout: 2,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'seller_phones',
											selector:
												"//div[contains(@class, 'link-phone')]//strong[@class='xx-large']",
											required: false,
										},
									},
								],
							},
						},
					],
				},
			},
		],
		commandsWithLoop: [
			{
				cmd: 'loop',
				params: {
					maxIterations: 2000,
					commands: [
						{
							cmd: 'url',
							params: {
								source: {
									class: 'fromHttp',
									url:
										'https://app.elasticdata.io/api/pipeline/data/5dcaa91aba087e0001815e61',
									property: 'link',
								},
								timeout: 60,
							},
						},
						{
							cmd: 'getUrl',
							params: {
								key: 'post_url',
							},
						},
						{
							cmd: 'getText',
							params: {
								key: 'brand',
								selector: "//div[@id='rst-page-oldcars-tree-block']/a[3]",
								required: false,
								timeout: 15,
							},
						},
						{
							cmd: 'getText',
							params: {
								key: 'checkElementData',
								selector:
									"//div[@id='rst-page-oldcars-item']//table[@class='rst-uix-table-superline']//td[contains(text(),'Цена')]",
								required: false,
							},
						},
						{
							cmd: 'getText',
							params: {
								key: 'checkElementList',
								selector:
									"//ul[@class='rst-uix-list-superline']/li/span[contains(text(),'Цена')]",
								required: false,
							},
						},
						{
							cmd: 'getText',
							params: {
								key: 'brand_model',
								selector: "//div[@id='rst-page-oldcars-tree-block']/a[4]",
								required: false,
							},
						},
						{
							cmd: 'getText',
							params: {
								key: 'seller_name',
								selector: '.rst-page-oldcars-item-option-block-container stong',
								required: false,
							},
						},
						{
							cmd: 'condition',
							params: {
								ifCommand: {
									cmd: 'checkData',
									params: {
										key: 'checkElementList',
										operator: 'isnotempty',
									},
								},
								trueCommands: [
									{
										cmd: 'getText',
										params: {
											key: 'price_usd',
											selector:
												"//ul[@class='rst-uix-list-superline']/li/span[contains(text(),'Цена')]/..//span[@class='rst-uix-grey']",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'year',
											selector:
												"//ul[@class='rst-uix-list-superline']//span[contains(text(),'Год выпуска')]/..//a[@class='rst-uix-black rst-uix-bold']",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'odometer',
											selector:
												"//ul[@class='rst-uix-list-superline']//span[contains(text(),'Год выпуска')]/..//span[contains(text(),'пробег')]",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'fuel',
											selector:
												"//ul[@class='rst-uix-list-superline']//span[contains(text(),'Двигатель')]/..//span[@class='rst-uix-grey']",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'engine',
											selector:
												"//ul[@class='rst-uix-list-superline']//span[contains(text(),'Двигатель')]/../span/strong",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'transmission',
											selector:
												"//ul[@class='rst-uix-list-superline']//span[contains(text(),'КПП')]/../span/strong",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'body',
											selector:
												"//ul[@class='rst-uix-list-superline']//span[contains(text(),'Тип кузова')]/../span/strong",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'color',
											selector:
												"//ul[@class='rst-uix-list-superline']//span[contains(text(),'Тип кузова')]/..//span",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'seller_city',
											selector:
												"//ul[@class='rst-uix-list-superline']//span[contains(text(),'(город - ')]/a",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'post_date',
											selector:
												"//ul[@class='rst-uix-list-superline']//span[contains(text(),'обновлено')]/following-sibling::span",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'post_id',
											selector:
												"//div/p[contains(text(), '№ этого объявления:')]/strong",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'description',
											selector:
												"//div[contains(@class, 'rst-page-oldcars-item-option-block')]//h3[contains(text(),'Описание:')]/../div",
											required: false,
										},
									},
								],
							},
						},
						{
							cmd: 'condition',
							params: {
								ifCommand: {
									cmd: 'checkData',
									params: {
										key: 'checkElementData',
										operator: 'isnotempty',
									},
								},
								trueCommands: [
									{
										cmd: 'getText',
										params: {
											key: 'price_usd',
											selector:
												"//div[@id='rst-page-oldcars-item']//table[@class='rst-uix-table-superline']//td[contains(text(),'Цена')]/..//span[@class='rst-uix-grey']",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'year',
											selector:
												"//div[@id='rst-page-oldcars-item']//table[@class='rst-uix-table-superline']//td[contains(text(),'Год выпуска')]/..//a[@class='rst-uix-black rst-uix-bold']",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'odometer',
											selector:
												"//div[@id='rst-page-oldcars-item']//table[@class='rst-uix-table-superline']//td[contains(text(),'Год выпуска')]/..//span[@class='rst-uix-grey']",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'fuel',
											selector:
												"//div[@id='rst-page-oldcars-item']//table[@class='rst-uix-table-superline']//td[contains(text(),'Год выпуска')]/..//span[@class='rst-uix-grey']",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'engine',
											selector:
												"//div[@id='rst-page-oldcars-item']//table[@class='rst-uix-table-superline']//td[contains(text(),'Двигатель')]/..//strong",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'transmission',
											selector:
												"//div[@id='rst-page-oldcars-item']//table[@class='rst-uix-table-superline']//td[contains(text(),'КПП')]/..//strong",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'body',
											selector:
												"//div[@id='rst-page-oldcars-item']//table[@class='rst-uix-table-superline']//td[contains(text(),'Тип кузова')]/..//strong",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'color',
											selector:
												"//div[@id='rst-page-oldcars-item']//table[@class='rst-uix-table-superline']//td[contains(text(),'Тип кузова')]/..//span",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'seller_city',
											selector:
												"//div[@id='rst-page-oldcars-item']//table[@class='rst-uix-table-superline']//td[contains(text(),'Область')]/..//span[contains(text(), 'город')]/a",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'post_date',
											selector:
												"//div[@id='rst-page-oldcars-item']//table[@class='rst-uix-table-superline']//td[contains(text(),'обновлено')]/following-sibling::td",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'post_id',
											selector:
												"//div/p[contains(text(), '№ этого объявления:')]/strong",
											required: false,
										},
									},
									{
										cmd: 'getText',
										params: {
											key: 'description',
											selector:
												"//div[contains(@class, 'rst-page-oldcars-item-option-block')]//h3[contains(text(),'Описание:')]/../div",
											required: false,
										},
									},
								],
							},
						},
					],
				},
			},
		],
		tab: null,
	}),
	computed: {
		...mapGetters(`task`, {
			task: TASK,
			taskData: TASK_DATA,
			taskCommandsInformation: TASK_COMMANDS_INFORMATION,
		}),
		commandAnalyzed: function() {
			const taskCommandsInformation = this.taskCommandsInformation || { analyzed: [] };
			const analyzed = taskCommandsInformation.analyzed || [];
			return analyzed.sort((a, b) => {
				const aTime = new Date(a.startOnUtc).getTime();
				const bTime = new Date(b.startOnUtc).getTime();
				if (aTime > bTime) {
					return 1;
				}
				if (aTime < bTime) {
					return -1;
				}
				return 0;
			});
		},
		commands: function() {
			return this.commandAnalyzed.map(x => {
				return {
					params: {
						...x.json,
						data_context: x.dataContext,
					},
					success: x.status === 'success',
					cmd: x.json.cmd,
				};
			});
		},
		totalTime: function() {
			const commandAnalyzed = this.commandAnalyzed;
			if (commandAnalyzed.length === 0) {
				return;
			}
			const firstCommand = commandAnalyzed[0];
			const lastCommand = commandAnalyzed[commandAnalyzed.length - 1];
			const start = moment.utc(firstCommand.startOnUtc);
			const end = moment.utc(lastCommand.endOnUtc);
			const diff = end.diff(start);
			return moment.utc(diff).format('HH:mm:ss');
		},
		flattenData: function() {
			return flatten(this.taskData || []);
		},
		totalKeys: function() {
			const flattenData = this.flattenData;
			return Object.keys(flattenData).length;
		},
		totalPages: function() {
			const commandAnalyzed = this.commandAnalyzed;
			if (commandAnalyzed.length === 0) {
				return;
			}
			return commandAnalyzed.filter(x => x.json.cmd === 'openurl').length;
		},
	},
	methods: {
		back() {
			this.$router.back();
		},
	},
	created: async function() {
		await this.$store.dispatch(`task/${FETCH_TASK}`, this.taskId);
		await this.$store.dispatch(`task/${FETCH_TASK_COMMANDS_INFORMATION}`);
		await this.$store.dispatch(`task/${FETCH_TASK_DATA}`);
	},
	props: {
		taskId: {
			type: String,
		},
	},
};
</script>
<style lang="less">
.task {
	.commands {
	}
}
</style>
