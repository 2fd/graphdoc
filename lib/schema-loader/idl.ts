import { buildSchema, execute, parse } from "graphql";
import { resolve } from "path";
import {
  ApolloIntrospection,
  GraphQLIntrospection,
  Introspection,
  SchemaLoader,
} from "../interface";
import { query as introspectionQuery } from "../utility";
import { readFile } from "../utility/fs";

export interface IIdlSchemaLoaderOptions {
  schemaFile: string;
}

export const idlSchemaLoader: SchemaLoader = async (
  options: IIdlSchemaLoaderOptions
) => {
  const schemaPath = resolve(options.schemaFile);
  const idl = await readFile(schemaPath, "utf8");
  const introspection = (await execute(
    buildSchema(idl),
    parse(introspectionQuery)
  )) as Introspection;

  return (
    (introspection as ApolloIntrospection).__schema ||
    (introspection as GraphQLIntrospection).data.__schema
  );
};
