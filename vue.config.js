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
				target: 'http://localhost:8085',
				changeOrigin: true,
				autoRewrite: true,
			},
			'/api/ws/*': {
				target: 'http://localhost:8085',
				changeOrigin: true,
				autoRewrite: true,
				ws: true,
			},
		},
	},
};
