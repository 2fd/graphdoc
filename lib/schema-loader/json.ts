import { resolve } from "path";
import { Introspection, SchemaLoader } from "../interface";

export interface IJsonSchemaLoaderOptions {
  schemaFile: string;
}

export const jsonSchemaLoader: SchemaLoader = (
  options: IJsonSchemaLoaderOptions
) => {
  try {
    const schemaPath = resolve(options.schemaFile);
    const introspection: Introspection = require(schemaPath);
    return Promise.resolve(introspection.__schema || introspection.data.__schema);
  } catch (err) {
    return Promise.reject(err);
  }
};
