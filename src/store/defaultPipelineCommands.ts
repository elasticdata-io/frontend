export default {
	commands: [
		{
			cmd: 'url',
			params: {
				urls: ['http://google.com.ua'],
			},
		},
		{
			cmd: 'getText',
			params: {
				key: 'header',
				selector: 'h1',
			},
		},
	],
};
