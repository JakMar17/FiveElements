FROM node:current-alpine3.20

RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY package*.json ./
COPY .env ./

RUN npm install

COPY --chown=node:node . .

CMD node --env-file=.env ./index.js