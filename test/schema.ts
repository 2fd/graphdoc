import {GraphQLScalarType, GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLString} from 'graphql';

let Timestamp = new GraphQLScalarType({
    name: 'Timestamp',
    serialize: (value) => value,
    parseValue: (value) => value,
    parseLiteral: (ast) => ast.value,
});


export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: 'Query description',
        fields: {
            timestamp: {
                description: 'Unix timestamp',
                type: Timestamp,
                resolve: () => Date.now()
            },
            datetime: {
                description: 'ISO 8106',
                type: GraphQLString,
                resolve: () => (new Date).toJSON()
            }
        }
    })
});