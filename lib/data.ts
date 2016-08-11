import { GraphQLSchema, GraphQLObjectType, GraphQLScalar } from 'graphql';

type ItemType = {
    href: string,
    text: string,
}

type SectionType = {
    title: string,
    items: ItemType[],
}

function createItem(type: GraphQLObjectType | GraphQLScalar): ItemType {
    return {
        href: '#type/' + (type.name as string).toLowerCase(),
        text: type.name,
    };
}

function createSection(name: string): SectionType {
    return {
        title: name,
        items: []
    };
}

function createSchemaSection(schema: GraphQLSchema): SectionType {

    let schemaSection = {
        title: 'Schema',
        items: []
    };

    let query = schema.getQueryType();
    let mutation = schema.getMutationType();
    let subscription = schema.getSubscriptionType();

    if (query)
        schemaSection.items.push(createItem(query));

    if (mutation)
        schemaSection.items.push(createItem(mutation));

    if (subscription)
        schemaSection.items.push(createItem(subscription));

    return schemaSection;
}

export function creteNavigationData(schema: GraphQLSchema) {

    let types = schema.getTypeMap();

    let sections = createSchemaSection(schema);
    let scalars = createSection('Scalars');
    let enums = createSection('Objecs');
    let objects = createSection('Objecs');
    let interfaces = createSection('Interfaces');
    let unions = createSection('Unions');
    let inputs = createSection('Input Objects');
    let others = createSection('Others');

    Object
        .keys(types)
        .forEach((name) => {
            let type = types[name];
            switch (type.constructor.name) {

                case 'GraphQLScalarType':
                    scalars.items.push(createItem(type));
                    break;

                case 'GraphQLEnumType':
                    enums.items.push(createItem(type));
                    break;

                case 'GraphQLObjectType':
                    objects.items.push(createItem(type));
                    break;

                case 'GraphQLInterfaceType':
                    interfaces.items.push(createItem(type));
                    break;

                case 'GraphQLUnionType':
                    unions.items.push(createItem(type));
                    break;

                case 'GraphQLInputObjectType':
                    inputs.items.push(createItem(type));
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
            enums,
            objects,
            interfaces,
            unions,
            inputs,
            others
        ].filter((section: SectionType) => section.items.length > 0)
    };
}