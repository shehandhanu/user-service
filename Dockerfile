FROM node:16-alpine
WORKDIR /app
COPY . .
RUN npm install
COPY . /app
EXPOSE 4000
CMD [ "npm", "run", "dev" ]
