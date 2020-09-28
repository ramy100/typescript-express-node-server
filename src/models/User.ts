import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  registered_at: string;
  deactivated_at: string;
  friends: string[];
  friendRequests: string[];
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  avatar: {
    type: String,
  },
  registered_at: {
    type: Date,
    default: Date.now(),
  },
  deactivated_at: {
    type: Date,
  },
  friends: {
    type: [mongoose.Types.ObjectId],
    ref: "user",
  },
  friendRequests: {
    type: [mongoose.Types.ObjectId],
    ref: "user",
  },
});

const UserModel = mongoose.model<IUser>("user", userSchema);

export default UserModel;
