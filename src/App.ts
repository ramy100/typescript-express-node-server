// import express from "express";
import dotenv from "dotenv";
import Database from "./Classes/Db";
import { ApolloServer } from "apollo-server";
import { resolvers, typeDefs } from "./GraphQl/root";
dotenv.config();

// const app = express();

const mongoDbConfig = {
  dbName: process.env.DB_NAME,
  dbUserName: process.env.DB_USER,
  dbUserPassword: process.env.DB_USER_PASS,
  dbClusterName: process.env.DB_CLUSTER_NAME,
};

const server = new ApolloServer({ typeDefs, resolvers });

const db = new Database(mongoDbConfig);
db.ConnectToMongoDb();

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
