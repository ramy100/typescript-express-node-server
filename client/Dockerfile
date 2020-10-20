# specify the node base image with your desired version node:<version>
FROM node:12.19.0-slim

RUN mkdir /client

WORKDIR /client

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . ./client

CMD [ "npm","start" ]