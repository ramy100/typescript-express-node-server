import mongoose from "mongoose";

export default class Database {
  private connectionUrl: string = "";
  constructor(
    private connectionConfig: {
      dbUserName: string | undefined;
      dbUserPassword: string | undefined;
      dbName: string | undefined;
      dbClusterName?: string | undefined;
    }
  ) {}

  async ConnectToMongoDb() {
    const {
      dbUserName,
      dbUserPassword,
      dbClusterName,
      dbName,
    } = this.connectionConfig;
    this.connectionUrl = `mongodb+srv://${dbUserName}:${dbUserPassword}@${dbClusterName}.m1ihh.mongodb.net/${dbName}?retryWrites=true&w=majority`;

    try {
      await mongoose.connect(this.connectionUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      });
      console.log("Connected to db");
    } catch (error) {
      console.log(error.message);
    }
  }
}
