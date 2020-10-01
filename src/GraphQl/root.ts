import { gql } from "apollo-server";
import { UserResolvers, UserTypeDefs } from "./User";

const typeDef = gql`
  type Query
`;

const Supscription = gql`
  type Subscription {
    friendRequestRecieved: FriendRequest
  }
`;

export const typeDefs = [typeDef, Supscription, UserTypeDefs];

export const resolvers = [UserResolvers];
