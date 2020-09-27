import { gql } from "apollo-server";
import { UserResolvers, UserTypeDefs } from "./User";

const typeDef = gql`
  type Query
`;

export const typeDefs = [typeDef, UserTypeDefs];

export const resolvers = [UserResolvers];
