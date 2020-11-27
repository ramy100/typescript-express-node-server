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
  }
  extend type Mutation {
    sendMessage(friendId: String, content: String): MessageResponse
  }
`;
