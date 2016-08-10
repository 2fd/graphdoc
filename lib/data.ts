import { GraphQLSchema, GraphQLObjectType, GraphQLScalar } from 'graphql';

function createItem(type: GraphQLObjectType | GraphQLScalar) {
    return {
        href: '#type/' + (type.name as string).toLowerCase(),
        text: type.name,
    };
}

export function creteNavData(schema: GraphQLSchema) {

    let types = schema.getTypeMap();
    let query = schema.getQueryType();
    let mutation = schema.getMutationType();
    let subscription = schema.getSubscriptionType();

    let schema = {
        title: 'Schema',
        items: []
    };

    if (query)
        schema.items.push(createItem(query));

    if (mutation)
        schema.items.push(createItem(mutation));

    if (subscription)
        schema.items.push(createItem(subscription));

    let scalars = {
        title: 'Scalars',
        items: []
    };

    let objects = {
        title: 'Objecs',
        items: []
    };

    let enums = {
        title: 'Objecs',
        items: []
    };

    let others = {
        title: 'Others',
        items: []
    };

    Object
        .keys(types)
        .forEach((name) => {
            let type = types[name];
            switch (type.constructor.name) {

                case 'GraphQLScalarType':
                    scalars.items.push(createItem(type));
                    break;

                case 'GraphQLObjectType':
                    objects.items.push(createItem(type));
                    break;

                case 'GraphQLEnumType':
                    enums.items.push(createItem(type));
                    break;

                default:
                    others.items.push(createItem(type));
                    break;
            }
        });

    return {
        navs: [
            schema,
            scalars,
            objects,
            enums,
            others
        ]
    };
}