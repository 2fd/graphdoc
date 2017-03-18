import { SchemaLoader, Introspection } from '../interface';
import { query as introspectionQuery } from '../utility';
import { resolve } from 'path';
import { readFile } from '../utility/fs';
import { buildSchema, parse, execute } from 'graphql';

export type TIDLSchemaLoaderOptions = {
    schemaFile: string
};

export const idlSchemaLoader: SchemaLoader = function (options: TIDLSchemaLoaderOptions) {

    const schemaPath = resolve(options.schemaFile);

    return readFile(schemaPath)
        .then((idl: string) => execute(
            buildSchema(idl),
            parse(introspectionQuery)
        ))
        .then((introspection: Introspection) => introspection.data.__schema);
};