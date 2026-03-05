FROM node:24.14-alpine
WORKDIR /app
COPY . .
RUN npm install
ENTRYPOINT [ "npm" ]
CMD ["run", "dev"]
EXPOSE 5173
