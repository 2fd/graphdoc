import Bluebird from "bluebird";
import request from "request";
import {
  ApolloIntrospection,
  GraphQLIntrospection,
  Introspection,
  Schema,
  SchemaLoader,
} from "../interface";
import { query as introspectionQuery } from "../utility";

export interface IHttpSchemaLoaderOptions {
  endpoint: string;
  headers: string[];
  queries: string[];
}

async function r(options: request.OptionsWithUrl) {
  return new Bluebird<Schema>((resolve, reject) => {
    request(options, (error, res, body: Introspection | string) => {
      if (error) {
        return reject(error);
      }

      if ((res.statusCode as number) >= 400) {
        return reject(
          new Error(
            "Unexpected HTTP Status Code " +
              res.statusCode +
              " (" +
              res.statusMessage +
              ") from: " +
              options.url
          )
        );
      }

      if (typeof body === "string") {
        return reject(
          new Error(
            'Unexpected response from "' +
              options.url +
              '": ' +
              body.slice(0, 10) +
              "..."
          )
        );
      }

      return resolve(
        (body as ApolloIntrospection).__schema ||
          (body as GraphQLIntrospection).data.__schema
      );
    });
  });
}

export const httpSchemaLoader: SchemaLoader = async (
  options: IHttpSchemaLoaderOptions
) => {
  const requestOptions: request.OptionsWithUrl = {
    url: options.endpoint,
    method: "POST",
    body: { query: introspectionQuery },
    json: true,
  };

  requestOptions.headers = options.headers.reduce(
    (result: any, header: string) => {
      const [name, value] = header.split(": ", 2);
      result[name] = value;
      return result;
    },
    {}
  );

  requestOptions.qs = options.queries.reduce((result: any, query: string) => {
    const [name, value] = query.split("=", 2);
    result[name] = value;
    return result;
  }, {});

  return r(requestOptions);
};
