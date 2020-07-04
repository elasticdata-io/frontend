# scraper-frontend

## Project setup

* ```'/worker/*'``` - https://github.com/sergeytkachenko/scraper-worker-ts
* ```'/api/*'``` - https://github.com/sergeytkachenko/scraper-service
* ```'/api/ws/*'``` - websockets of https://github.com/sergeytkachenko/scraper-service

### Develop only frontend

* Change content of file ```vue.config.js```
```
module.exports = {
	devServer: {
		host: 'localhost',
		proxy: {
			'/worker/*': {
				target: 'https://elasticdata.io',
				changeOrigin: true,
                autoRewrite: true,
			},
			'/api/*': {
				target: 'https://elasticdata.io',
				changeOrigin: true,
				autoRewrite: true,
			},
			'/api/ws/*': {
				target: 'https://elasticdata.io',
				changeOrigin: true,
				autoRewrite: true,
				ws: true,
			},
		},
	},
};

```
* ``npm install``
* ```npm run dev```
### Develop frontend and worker

#### Run worker

* clone project https://github.com/sergeytkachenko/scraper-worker-ts
* run worker project 
    * ```cd scraper-worker-ts```
    * ``npm install``
    * ```npm run dev```

#### Run frontend

* run frontend
    * ```cd scraper-frontend```
    * change content of file ```vue.config.js```
```
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
				target: 'https://elasticdata.io',
				changeOrigin: true,
				autoRewrite: true,
			},
			'/api/ws/*': {
				target: 'https://elasticdata.io',
				changeOrigin: true,
				autoRewrite: true,
				ws: true,
			},
		},
	},
};
```
* ``npm install``
* ```npm run dev```