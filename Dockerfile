FROM node:13-alpine

COPY . /nodero

WORKDIR /nodero

RUN apk --update add --no-cache python make g++
RUN npm ci

CMD ["node", "start-server.js"]
