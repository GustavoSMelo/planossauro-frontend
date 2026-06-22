# Estágio 1: Build
FROM node:24.14-alpine AS build-stage
WORKDIR /webapp
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine

COPY --from=build-stage /webapp/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx /var/log/nginx /etc/nginx/conf.d

USER nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
