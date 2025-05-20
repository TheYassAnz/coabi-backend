FROM node:23

WORKDIR /app

COPY package*.json /app
RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "start"]
