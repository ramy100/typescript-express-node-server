import { gql } from "apollo-server";
import { MessagesResolver, messageTypeDefs } from "./Message";
import { dateTime } from "./ScalarTypes/dateTime";
import { UserResolvers, UserTypeDefs } from "./User";

const typeDef = gql`
  scalar DateTime
  type Mutation
  type Query
`;

const Supscription = gql`
  type Subscription {
    friendRequestRecieved: FriendRequest
    chatMessages: Message!
  }
`;

export const typeDefs = [typeDef, Supscription, UserTypeDefs, messageTypeDefs];

export const resolvers = [dateTime, UserResolvers, MessagesResolver];
