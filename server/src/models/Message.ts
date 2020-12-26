import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: { createdAt: "created_at" } }
);

const MessageModel = mongoose.model("message", messagesSchema);

export default MessageModel;
