// import express from "express";
import dotenv from "dotenv";
import Database from "./Classes/Db";
import { ApolloServer, AuthenticationError } from "apollo-server";
import { resolvers, typeDefs } from "./GraphQl/root";
import AuthorizeUser from "./Classes/Users/AuthorizeUsers";
dotenv.config();
import { redisGetAsync } from "./Classes/RedisClient";

const mongoDbConfig = {
  dbName: process.env.DB_NAME,
  dbUserName: process.env.DB_USER,
  dbUserPassword: process.env.DB_USER_PASS,
  dbClusterName: process.env.DB_CLUSTER_NAME,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    let token: string | undefined;
    let decoded;
    if (connection) {
      token = connection?.context?.authorization?.split(" ")[1];
    } else {
      token = req?.headers?.authorization?.split(" ")[1];
    }
    if (token) {
      const exists = await redisGetAsync(token);
      if (exists) decoded = AuthorizeUser.verifyUser(token);
    }
    if (connection && !decoded?.userId)
      throw new AuthenticationError("Unauthorized");

    return { userId: decoded?.userId, token };
  },
});

const db = new Database(mongoDbConfig);
db.ConnectToMongoDb();

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
