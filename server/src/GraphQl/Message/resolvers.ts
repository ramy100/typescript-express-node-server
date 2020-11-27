import { MessagesGraphQl } from "./Message";
import MessageModel from "../../models/Message";
import { withFilter } from "apollo-server";

const Query = {
  messages: async () => {
    const soso = await MessageModel.find({}).populate(["from", "to"]);
    console.log(soso);
    return soso;
  },
};

const Mutation = {
  sendMessage: (_: any, { friendId, content }: any, { userId, pubsub }: any) =>
    MessagesGraphQl.sendMessage(userId, friendId, content, pubsub),
};

export const Subscription = {
  chatMessages: {
    // Additional event labels can be passed to asyncIterator creation
    subscribe: withFilter(
      (_, __, { pubsub }) => pubsub.asyncIterator("NEW_CHAT_MESSAGE"),
      (payload, variables, context) => {
        console.log(payload);
        return payload.chatMessages.to.id == context.userId;
      }
    ),
  },
};

export const MessagesResolver = {
  Query,
  Mutation,
  Subscription,
};
