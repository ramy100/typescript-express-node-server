import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export default class Database {
  constructor() {}

  async ConnectToMongoDb() {
    try {
      await mongoose.connect(process.env.DB_URI as string, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        authSource: "admin",
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
      });
      console.log("Connected to db");
    } catch (error) {
      console.log(error.message);
    }
  }
}
