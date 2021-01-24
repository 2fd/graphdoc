import { resolve } from "path";
import {
  ApolloIntrospection,
  GraphQLIntrospection,
  Introspection,
  Schema,
  SchemaLoader,
} from "../interface";

export interface IJsonSchemaLoaderOptions {
  schemaFile: string;
}

export const jsonSchemaLoader: SchemaLoader = (
  options: IJsonSchemaLoaderOptions
) => {
  try {
    const schemaPath = resolve(options.schemaFile);
    const introspection: Introspection = require(schemaPath);
    const schema: Schema =
      (introspection as ApolloIntrospection).__schema ||
      (introspection as GraphQLIntrospection).data.__schema;
    return Promise.resolve(schema);
  } catch (err) {
    return Promise.reject(err);
  }
};
