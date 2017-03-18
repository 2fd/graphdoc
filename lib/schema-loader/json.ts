import { SchemaLoader, Introspection } from '../interface';
import { resolve } from 'path';

export type TJsonSchemaLoaderOptions = {
    schemaFile: string
};

export const jsonSchemaLoader: SchemaLoader = function (options: TJsonSchemaLoaderOptions) {
    try {
        const schemaPath = resolve(options.schemaFile);
        const introspection: Introspection = require(schemaPath);
        return Promise.resolve(introspection.data.__schema);

    } catch (err) {
        return Promise.reject(err);
    }
};