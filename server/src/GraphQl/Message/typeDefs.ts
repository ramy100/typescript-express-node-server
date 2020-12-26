import { gql } from "apollo-server";

export const messageTypeDefs = gql`
  type Message {
    id: ID!
    from: User!
    to: User!
    content: String!
    created_at: DateTime!
  }
  type chatMessages {
    id: ID!
    to: String!
    from: String!
    content: String!
    created_at: DateTime
  }
  type MessageResponse implements IResponse {
    code: Int!
    success: Boolean!
    message: String!
    data: Message
  }

  extend type Query {
    messages: [Message]
    readMessages(friendId: String, pageNum: Int): [chatMessages]
  }
  extend type Mutation {
    sendMessage(friendId: String, content: String): MessageResponse
  }
`;
