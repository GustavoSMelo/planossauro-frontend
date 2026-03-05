FROM node:24.14-alpine

WORKDIR /app

COPY . .

RUN apk update
RUN apk add nginx

RUN npm install
RUN npm run build

RUN mkdir -p /usr/share/nginx/html
RUN cp -r /app/dist/* /usr/share/nginx/html/
RUN cp -r /app/nginx.conf /etc/nginx/http.d/default.conf

WORKDIR /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

EXPOSE 80
