module.exports = {
	devServer: {
		host: 'localhost',
		proxy: {
			'/api/*': {
				target: 'https://app.elasticdata.io',
				changeOrigin: true,
				autoRewrite: true,
			},
			'/api/ws/*': {
				target: 'https://app.elasticdata.io',
				changeOrigin: true,
				autoRewrite: true,
				ws: true,
			},
		},
	},
};
