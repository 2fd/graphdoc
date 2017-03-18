import { SchemaLoader, Introspection } from '../interface';
import { query as introspectionQuery } from '../utility';
import * as request from 'request';

export type THttpSchemaLoaderOptions = {
    endpoint: string,
    headers: string[],
    queries: string[],
};

export const httpSchemaLoader: SchemaLoader = function (options: THttpSchemaLoaderOptions) {

    let requestOptions = {
        url: options.endpoint,
        method: 'POST',
        json: true,
        body: { query: introspectionQuery }
    } as any;

    requestOptions.headers = options.headers.reduce((result: any, header: string) => {
        const [name, value] = header.split(': ', 2);
        result[name] = value;
        return result;
    }, {});

    requestOptions.qs = options.queries.reduce((result: any, query: string) => {
        const [name, value] = query.split('=', 2);
        result[name] = value;
        return result;
    }, {});

    return new Promise((resolve, reject) => {
        request(requestOptions, (err, _, introspection: Introspection) => err ?
            reject(err) : resolve(introspection.data.__schema));
    });
};