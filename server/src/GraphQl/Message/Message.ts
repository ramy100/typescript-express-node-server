import UserModel from "../../models/User";
import { GqlResponse } from "../../Classes/GqlResponse/GqlResponse";
import MessageModel from "../../models/Message";

export const MessagesGraphQl = {
  readMessages: async (userId: string, friendId: string, pageNum: number) => {
    if (!userId || !friendId)
      return new GqlResponse("User Not Found!", undefined, 404, false);
    const messagePerPage = 5;
    try {
      const messages = await MessageModel.find({
        from: { $in: [userId, friendId] },
        to: { $in: [userId, friendId] },
      })
        .sort("-created_at")
        .limit(messagePerPage)
        .skip(pageNum * messagePerPage);
      return messages;
    } catch (error) {
      console.log(error.message);
      return new GqlResponse("server error!", undefined, 500, false);
    }
  },
  sendMessage: async (
    userId: string,
    friendId: string,
    content: string,
    pubsub: any
  ) => {
    if (!userId || !friendId)
      return new GqlResponse("User Not Found!", undefined, 404, false);

    try {
      const currentUser = await UserModel.findById(userId);
      const friend = await UserModel.findById(friendId);

      if (!currentUser || !friend)
        return new GqlResponse("User Not Found!", undefined, 404, false);

      if (
        !currentUser.friends.includes(friendId) ||
        !friend.friends.includes(userId)
      )
        return new GqlResponse("You Are Not Friends!", undefined, 403, false);

      const newMessage = new MessageModel({
        from: userId,
        to: friendId,
        content,
      });
      await newMessage.save();
      const message = {
        ...newMessage.toJSON(),
        from: currentUser,
        to: friend,
        id: newMessage._id,
      };
      pubsub.publish("NEW_CHAT_MESSAGE", {
        chatMessages: message,
      });
      return new GqlResponse("Message Sent Successfully!", message, 200, true);
    } catch (error) {
      console.log(error);
      return new GqlResponse("server error!", undefined, 500, false);
    }
  },
  deleteMessage: (userId: string, messageId: string) => {},
};
