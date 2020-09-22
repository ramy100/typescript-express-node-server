import express from "express";
import dotenv from "dotenv";
import Database from "./Classes/Db";
dotenv.config();

const app = express();

const mongoDbConfig = {
  dbName: process.env.DB_NAME,
  dbUserName: process.env.DB_USER,
  dbUserPassword: process.env.DB_USER_PASS,
  dbClusterName: process.env.DB_CLUSTER_NAME,
};

const db = new Database(mongoDbConfig);
db.ConnectToMongoDb();

app.get("", (req, res) => {
  res.send("Hello world");
});

app.listen(3000, () => {
  console.log("listening to port 3000");
});
