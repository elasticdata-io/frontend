module.exports = {
	devServer: {
		host: 'localhost',
		proxy: {
			'/api/ws/*': {
				target: 'http://localhost:8085',
				changeOrigin: true,
				autoRewrite: true,
			},
			'/api/*': {
				target: 'http://localhost:8085',
				changeOrigin: true,
				autoRewrite: true,
			},
		},
	},
};
