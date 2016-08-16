import { GraphQLSchema, GraphQLObjectType, GraphQLScalar } from 'graphql';

type ItemType = {
    href: string,
    text: string,
}

type SectionType = {
    title: string,
    items: ItemType[],
}

function createItem(type: GraphQLObjectType | GraphQLScalar, isActive: boolean): ItemType {
    return {
        href: './' + (type.name as string).toLowerCase() + '.html',
        text: type.name,
        isActive
    };
}

function createSection(name: string): SectionType {
    return {
        title: name,
        items: []
    };
}

function createSchemaSection(schema: GraphQLSchema, onItem: any): SectionType {

    let schemaSection: SectionType = {
        title: 'Schema',
        items: []
    };

    let query = schema.getQueryType();
    let mutation = schema.getMutationType();
    let subscription = schema.getSubscriptionType();

    if (query)
        schemaSection.items.push(createItem(query, query === onItem));

    if (mutation)
        schemaSection.items.push(createItem(mutation, mutation === onItem));

    if (subscription)
        schemaSection.items.push(createItem(subscription, subscription === onItem));

    return schemaSection;
}

export function createNavigationData(schema: GraphQLSchema, onItem: any) {

    let types = schema.getTypeMap();

    let sections = createSchemaSection(schema, onItem);
    let scalars = createSection('Scalars');
    let enums = createSection('Enums');
    let objects = createSection('Objects');
    let interfaces = createSection('Interfaces');
    let unions = createSection('Unions');
    let inputs = createSection('Input Objects');
    let others = createSection('GraphQL');

    Object
        .keys(types)
        .forEach((name) => {

            let type = types[name];

            if (name[0] === '_' && name[1] === '_') {
                others.items.push(createItem(type, type === onItem));

            } else {
                switch (type.constructor.name) {

                    case 'GraphQLScalarType':
                        scalars.items.push(createItem(type, type === onItem));
                        break;

                    case 'GraphQLEnumType':
                        enums.items.push(createItem(type, type === onItem));
                        break;

                    case 'GraphQLObjectType':
                        objects.items.push(createItem(type, type === onItem));
                        break;

                    case 'GraphQLInterfaceType':
                        interfaces.items.push(createItem(type, type === onItem));
                        break;

                    case 'GraphQLUnionType':
                        unions.items.push(createItem(type, type === onItem));
                        break;

                    case 'GraphQLInputObjectType':
                        inputs.items.push(createItem(type, type === onItem));
                        break;

                    default:
                        others.items.push(createItem(type, type === onItem));
                        break;
                }
            }
        });

    return {
        navs: [
            sections,
            scalars,
            enums,
            objects,
            interfaces,
            unions,
            inputs,
            others
        ].filter((section: SectionType) => section.items.length > 0)
    };
}

export type sectionDefinition = {
    title:
    description: string
}

export type sectionCreator = (type: GraphQLObjectType | GraphQLScalar) => sectionDefinition;

export function createMainData(type: GraphQLObjectType | GraphQLScalar) {

    return {
        title: type.name,
        description: type.description,
        sections: [
            {
                title: 'Serialize function',
                description: '<pre>  ' +
                    (type.serialize ? type.serialize.toString() : '-- NO DATA --' )
                + '</pre>'
            }
        ]
    };

}