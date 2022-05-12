const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
	configureWebpack: {
		plugins: [new MonacoWebpackPlugin()],
	},
	devServer: {
		host: 'localhost',
		proxy: {
			'^/worker-manager/': {
				target: 'http://localhost:3005',
				changeOrigin: true,
				autoRewrite: true,
			},
			'^/worker/': {
				target: 'https://app.elasticdata.io',
				changeOrigin: true,
				autoRewrite: false,
				pathRewrite: {
					'^/worker': '', //remove /service/api
				},
			},
			'^/api/': {
				target: 'https://app.elasticdata.io',
				changeOrigin: true,
				autoRewrite: true,
			},
			'^/api/ws/': {
				target: 'https://app.elasticdata.io',
				changeOrigin: true,
				autoRewrite: true,
				ws: true,
			},
		},
	},
};
