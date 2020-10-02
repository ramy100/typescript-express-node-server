// import express from "express";
import dotenv from "dotenv";
import Database from "./Classes/Db";
import { ApolloServer } from "apollo-server";
import { resolvers, typeDefs } from "./GraphQl/root";
import AuthorizeUser from "./Classes/Users/AuthorizeUsers";
import { IUser } from "./models/User";
dotenv.config();

const mongoDbConfig = {
  dbName: process.env.DB_NAME,
  dbUserName: process.env.DB_USER,
  dbUserPassword: process.env.DB_USER_PASS,
  dbClusterName: process.env.DB_CLUSTER_NAME,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, connection }) => {
    let token: string | undefined;
    if (connection) {
      token = connection?.context?.Authorization?.split(" ")[1];
    } else {
      token = req?.headers?.authorization?.split(" ")[1];
    }
    const currentUser = AuthorizeUser.verifyUser(token);
    return { currentUser };
  },
});

const db = new Database(mongoDbConfig);
db.ConnectToMongoDb();

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
