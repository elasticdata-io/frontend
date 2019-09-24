module.exports = {
	devServer: {
		host: 'localhost',
		proxy: {
			'/api/*': {
				target: 'http://localhost:8085',
				changeOrigin: true,
				autoRewrite: true,
			},
			'/ws/*': {
				target: 'http://localhost:8085',
				changeOrigin: true,
				autoRewrite: true,
			},
		},
	},
};
