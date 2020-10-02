import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({
  from: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
  to: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
  content: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

const MessageModel = mongoose.model("message", messagesSchema);

export default MessageModel;
