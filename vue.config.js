module.exports = {
	devServer: {
		host: 'localhost',
		proxy: {
			'/worker/*': {
				target: 'http://localhost:3000',
				changeOrigin: true,
				autoRewrite: true,
			},
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
