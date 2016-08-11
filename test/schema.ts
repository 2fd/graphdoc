import {GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLString} from 'graphql';

export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: 'Query description',
        fields: {
            timestamp: {
                description: 'Unix timestamp',
                type: GraphQLInt,
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