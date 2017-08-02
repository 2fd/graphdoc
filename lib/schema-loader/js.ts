import { Introspection, SchemaLoader } from '../interface';
import { buildSchema, execute, parse } from 'graphql';

import { query as introspectionQuery } from '../utility';
import { resolve } from 'path';

export type TJsSchemaLoaderOptions = {
    schemaFile: string
};

export const jsSchemaLoader: SchemaLoader = async function (options: TJsSchemaLoaderOptions) {

    const schemaPath = resolve(options.schemaFile);
    let schemaModule = require(schemaPath);
    let schema: string;

    // check if exist default in module
    if (typeof schemaModule === 'object') {
        schemaModule = schemaModule.default
    }

    // check for array of definition
    if (Array.isArray(schemaModule)){
        schema = schemaModule.join('');

    // check for array array wrapped in a function
    } else if  (typeof schemaModule === 'function')  {
        schema = schemaModule().join('');

    } else {
        throw new Error(`Unexpected schema definition on "${schemaModule}", must be an array or function`)
    }

    const introspection = await execute(
        buildSchema(schema),
        parse(introspectionQuery)
    ) as Introspection;

    return introspection.data.__schema;
};