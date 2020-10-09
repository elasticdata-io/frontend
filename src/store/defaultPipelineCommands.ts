export default {
    version: '2.0',
	commands: [
		{
			cmd: 'openurl',
            link: 'http://google.com.ua',
		},
        {
          cmd: 'type',
          selector: 'input[name="q"]',
          text: 'pizza'
        },
        {
            cmd: 'click',
            selector: 'input[name="btnK"]',
        },
		{
			cmd: 'loop',
            commands: [
                {
                    cmd: 'gettext',
                    selector: 'div.g{$i} a',
                    attribute: 'href',
                    key: 'link'
                },
                {
                    cmd: 'gettext',
                    selector: 'div.g{$i} h3',
                    key: 'name'
                }
            ]
		},
	],
};
