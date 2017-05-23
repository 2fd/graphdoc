import { SchemaLoader, Introspection } from '../interface';
import { query as introspectionQuery } from '../utility';
import { resolve } from 'path';
import { readFile } from '../utility/fs';
import { buildSchema, parse, execute } from 'graphql';

export type TIDLSchemaLoaderOptions = {
    schemaFile: string
};

export const idlSchemaLoader: SchemaLoader = async function (options: TIDLSchemaLoaderOptions) {

    const schemaPath = resolve(options.schemaFile);
    const idl = await readFile(schemaPath, 'utf8');
    const introspection = await execute(
        buildSchema(idl),
        parse(introspectionQuery)
    ) as Introspection;

    return introspection.data.__schema;
};