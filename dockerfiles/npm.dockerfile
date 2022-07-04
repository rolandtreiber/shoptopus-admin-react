FROM node:13.7

WORKDIR /usr/src/app

RUN ls
COPY package*.json ./app

RUN ls

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]