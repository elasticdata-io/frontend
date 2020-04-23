export default class CommandsAnalyzedStructure {
	static getSortingWithLevel(commandsAnalyzed, pipelineCommands) {
		let commands = JSON.parse(JSON.stringify(commandsAnalyzed));
		pipelineCommands = JSON.parse(JSON.stringify(pipelineCommands));
		const structure = {};
		const level = 0;
		CommandsAnalyzedStructure._setParentChild(pipelineCommands, structure, level);
		commands = CommandsAnalyzedStructure._setParent(commands, structure);
		commands = CommandsAnalyzedStructure._setLevel(commands, structure);
		commands = CommandsAnalyzedStructure._sorting(commands);
		commands = CommandsAnalyzedStructure._setNumber(commands);
		commands = CommandsAnalyzedStructure._fixJson(commands);
		return commands;
	}

	static _setParent(commands, structure) {
		return commands.map(x => {
			const parent = structure[x.uuid];
			if (parent) {
				x.parentUuid = parent.parentUuid;
			}
			return x;
		});
	}

	static _setLevel(commands, structure) {
		do {
			commands.forEach(x => {
				const parent = structure[x.uuid];
				if (!parent) {
					x.level = 0;
					return;
				}
				if (parent.level !== undefined) {
					x.level = parent.level + 1;
				}
			});
		} while (commands.find(x => x.level === undefined));
		return commands;
	}

	static _setNumber(commands) {
		let rootCounter = 1;
		commands.forEach(x => {
			const parentUuid = x.parentUuid;
			if (!parentUuid) {
				const number = rootCounter++;
				x.number = number.toString();
			}
		});
		return commands;
	}

	static _fixJson(commands) {
		commands.forEach(x => {
			if (!x.json.context) {
				delete x.json.context;
			}
			x.json.data_context = x.dataContext;
			// x.json.startOnUtc = x.startOnUtc;
			// x.json.endOnUtc = x.endOnUtc;
		});
		return commands;
	}

	static _sorting(commands) {
		let originArr = Array.from(commands);
		const targetArr = [];
		do {
			const origin = originArr.shift();
			if (!origin) {
				break;
			}
			const parentUuid = origin.parentUuid;
			if (!parentUuid) {
				targetArr.push(origin);
				continue;
			}
			const hasParent = targetArr.find(x => x.uuid === parentUuid) !== undefined;
			if (hasParent) {
				targetArr.push(origin);
				continue;
			}
			const parent = originArr.find(x => {
				const dataContext = x.dataContext || '';
				const originDataContext = origin.dataContext || '';
				return x.uuid === parentUuid && originDataContext.includes(dataContext);
			});
			targetArr.push(parent);
			targetArr.push(origin);
			originArr = originArr.filter(x => x !== parent);
		} while (originArr.length > 0);
		return targetArr;
	}

	static _setParentChild(pipelineCommands, structure, level) {
		pipelineCommands.forEach(x => {
			if (x.commands) {
				x.commands.forEach(y => {
					structure[y.uuid] = {
						parentUuid: x.uuid,
						level: level,
					};
				});
				CommandsAnalyzedStructure._setParentChild(x.commands, structure, level + 1);
			}
		});
	}
}
