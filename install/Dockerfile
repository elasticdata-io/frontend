FROM node AS build
WORKDIR /var/www/frontend/app
COPY . /var/www/frontend
RUN rm -rf node_modules
RUN npm ci
RUN npm run build

FROM nginx:1.12.2 AS final
WORKDIR /usr/share/nginx/html
COPY . /tmp/
RUN rm /etc/nginx/conf.d/default.conf
RUN cp /tmp/install/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /var/www/frontend/app/dist .
EXPOSE 80