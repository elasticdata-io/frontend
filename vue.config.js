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
				target: 'http://localhost:3000',
				changeOrigin: true,
				autoRewrite: false,
				pathRewrite: {
					'^/worker': '', //remove /service/api
				},
			},
			'^/api/': {
				target: 'http://localhost:8085',
				changeOrigin: true,
				autoRewrite: true,
			},
			'^/api/ws/': {
				target: 'http://localhost:8085',
				changeOrigin: true,
				autoRewrite: true,
				ws: true,
			},
		},
	},
};
