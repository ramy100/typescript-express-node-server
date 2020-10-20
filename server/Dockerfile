# specify the node base image with your desired version node:<version>
FROM node:12.19.0-slim

RUN mkdir /server

WORKDIR /server

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . ./server

CMD [ "npm","run","server" ]