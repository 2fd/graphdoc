// tslint:disable-next-line:no-implicit-dependencies
import express from "express";
// tslint:disable-next-line:no-implicit-dependencies
import { graphqlHTTP } from "express-graphql";
import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import pack from "../package.json";

const app = express();

export const EmptySchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    description: "Root query",
    fields: {
      version: {
        type: new GraphQLNonNull(GraphQLString),
        resolve: () => pack.version,
      },
    },
  }),
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: EmptySchema,
    graphiql: true,
  })
);
app.listen(4000);
