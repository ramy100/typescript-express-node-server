import { GraphQLScalarType, Kind } from "graphql";

export const dateTime = {
  DateTime: new GraphQLScalarType({
    name: "DateTime",
    description: "Date time scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
    serialize(value) {
      const date = new Date(value);
      return date.toLocaleString(); // value sent to the client
    },
  }),
};
