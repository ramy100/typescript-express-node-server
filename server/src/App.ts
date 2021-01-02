// import express from "express";
import Database from "./Classes/Db";
import { ApolloServer, AuthenticationError, PubSub } from "apollo-server";
import { resolvers, typeDefs } from "./GraphQl/root";
import AuthorizeUser from "./Classes/Users/AuthorizeUsers";
import { redisGetAsync } from "./Classes/RedisClient";

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    let token: string | undefined;
    let decoded;
    if (connection) {
      token = connection?.context?.Authorization?.split(" ")[1];
    } else {
      token = req?.headers?.authorization?.split(" ")[1];
    }
    if (token) {
      const exists = await redisGetAsync(token);
      if (exists) decoded = AuthorizeUser.verifyUser(token);
    }
    if (connection && !decoded?.userId)
      throw new AuthenticationError("Unauthorized");

    return { userId: decoded?.userId, token, pubsub };
  },
});

const db = new Database();
db.ConnectToMongoDb();

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
