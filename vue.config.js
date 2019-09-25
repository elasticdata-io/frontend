module.exports = {
	devServer: {
		host: 'localhost',
		proxy: {
			'/api/*': {
				target: 'http://app.elasticdata.io',
				changeOrigin: true,
				autoRewrite: true,
			},
			'/ws/*': {
				target: 'http://app.elasticdata.io',
				changeOrigin: true,
				autoRewrite: true,
			},
		},
	},
};
