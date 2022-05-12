<template>
	<v-form v-model="valid">
		<v-simple-table class="setup-table">
			<template v-slot:default>
				<thead>
					<tr>
						<th class="text-left">
							Правило
						</th>
						<th class="text-left">
							Поле
						</th>
						<th class="text-left">
							Дія
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="item in rules" :key="item.id">
						<td>
							<v-select
								:items="predefinedRules"
								v-model="item.ruleId"
								item-text="caption"
								item-value="id"
								required
							></v-select>
						</td>
						<td>
							<v-text-field v-model="item.property" required></v-text-field>
						</td>
						<td>
							<v-btn small depressed color="secondary" icon @click="remove(item.id)">
								<v-icon>delete</v-icon>
							</v-btn>
						</td>
					</tr>
				</tbody>
			</template>
		</v-simple-table>
		<v-btn depressed small @click="add">
			<v-icon small class="pr-2">add_circle</v-icon>
			додати правило
		</v-btn>
		<v-btn depressed small @click="validate" class="ml-5">
			<v-icon small class="pr-2">check_circle</v-icon>
			валідувати правила
		</v-btn>
		<v-btn depressed small @click="save" class="ml-5 float-right" color="accent">
			<v-icon small class="pr-2">check_circle</v-icon>
			зберегти зміни
		</v-btn>
	</v-form>
</template>
<script type="ts">
import {StringGenerator} from "@/lib/string.generator";

export default {
    name: 'SetupAccumulateData',
    components: {},
    data: () => {
        return {
            valid: false,
            predefinedRules: [
                {
                    id: 1,
                    caption: 'збирати документи які містять ключ'
                },
                {
                    id: 2,
                    caption: 'ідентифікувати документ по унікальному ключу',
                }
            ],
            rules: [
                {
                    id: StringGenerator.generate(5),
                    ruleId: 1,
                    property: '*.video-link'
                },
                {
                    id: StringGenerator.generate(5),
                    ruleId: 2,
                    property: 'video-link'
                }
            ]
        }
    },
    methods: {
        remove(id) {
            this.rules = this.rules.filter(x => x.id !== id);
        },
        add() {
            this.rules = [
                ...this.rules,
                {
                    id: StringGenerator.generate(5)
                }
            ];
        },
        validate() {

        },
        save() {

        }
    }
}
</script>
<style lang="less" scoped>
.setup-table {
	margin-bottom: 20px;
}
</style>
