# specify the node base image with your desired version node:<version>
FROM node:14.15.1-alpine3.10

RUN mkdir /server

WORKDIR /server

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . ./server

CMD [ "npm","run","server" ]