import { SchemaLoader, Introspection } from '../interface';
import { resolve } from 'path';
import { buildSchema, parse, execute } from 'graphql';
import { query as introspectionQuery } from '../utility';



export type TJsSchemaLoaderOptions = {
    schemaFile: string
};

export const jsSchemaLoader: SchemaLoader = async function (options: TJsSchemaLoaderOptions) {

    const schemaPath = resolve(options.schemaFile);
    let schema = require(schemaPath);
    if (typeof schema === 'function') {
        schema = schema().join('');
    }

    const introspection = await execute(
        buildSchema(schema),
        parse(introspectionQuery)
    ) as Introspection;

    return introspection.data.__schema;

};