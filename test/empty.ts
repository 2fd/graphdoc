import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';

const pack = require('../package.json');

export const EmptySchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: 'Root query',
        fields: {
            version: {
                type: new GraphQLNonNull(GraphQLString),
                resolve: () => pack.version
            }
        }
    })
});

const app = require('express')();
const graphqlHTTP = require('express-graphql');
app.use('/graphql', graphqlHTTP({
    schema: EmptySchema,
    graphiql: true
}));
app.listen(4000);