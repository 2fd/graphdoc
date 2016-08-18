import { GraphQLSchema, GraphQLObjectType, GraphQLType } from 'graphql';
import { DocumentSection, NavigationItem, DocumentPlugin } from './interface';

export class DataTranslator {

    baseUrl: string;

    schema: GraphQLSchema;

    plugins: DocumentPlugin[];

    constructor(schema: GraphQLSchema, plugins: SectionCreator[], baseUrl: string) {
        this.schema = schema;
        this.baseUrl = baseUrl;
        this.plugins = plugins;
    }

    getUrl(type: GraphQLType): string {
        return this.baseUrl + (type.name as string).toLowerCase() + '.doc.html';
    }

    getNavigationItem(type: GraphQLType, isActive: boolean): NavigationItem {
        return {
            href: this.getUrl(type),
            text: type.name,
            isActive
        };
    }

    getNavigationSection(name: string): NavigationSection {
        return {
            title: name,
            items: []
        };
    }

    getSchemaNavSection(onType: GraphQLType): NavSectionType {

        let schemaSection: NavSectionType = this.getNavSection('Schema');
        let query = this.schema.getQueryType();
        let mutation = this.schema.getMutationType();
        let subscription = this.schema.getSubscriptionType();

        if (query)
            schemaSection.items.push(this.getNavigationItem(query, query === onType));

        if (mutation)
            schemaSection.items.push(this.getNavigationItem(mutation, mutation === onType));

        if (subscription)
            schemaSection.items.push(this.getNavigationItem(subscription, subscription === onType));

        return schemaSection;
    }

    getMainData(type: GraphQLType, name: string) {
        return {
            title: name || type.name,
            description: type.description,
            sections: this.plugins
                .filter((result) => Boolean(result)),
        };
    }

    getNavigationData(onType: GraphQLType) {

        let types = this.schema.getTypeMap();

        let sections = this.getSchemaNavigationSection(onType);
        let scalars = this.getNavigationSection('Scalars');
        let enums = this.getNavigationSection('Enums');
        let objects = this.getNavigationSection('Objects');
        let interfaces = this.getNavigationSection('Interfaces');
        let unions = this.getNavigationSection('Unions');
        let inputs = this.getNavigationSection('Input Objects');
        let others = this.getNavigationSection('GraphQL');

        Object
            .keys(types)
            .forEach((name) => {

                let type = types[name];

                if (name[0] === '_' && name[1] === '_') {
                    others.items.push(this.getNavigationItem(type, type === onType));

                } else {
                    switch (type.constructor.name) {

                        case 'GraphQLScalarType':
                            scalars.items.push(this.getNavigationItem(type, type === onType));
                            break;

                        case 'GraphQLEnumType':
                            enums.items.push(this.getNavigationItem(type, type === onType));
                            break;

                        case 'GraphQLObjectType':
                            objects.items.push(this.getNavigationItem(type, type === onType));
                            break;

                        case 'GraphQLInterfaceType':
                            interfaces.items.push(this.getNavigationItem(type, type === onType));
                            break;

                        case 'GraphQLUnionType':
                            unions.items.push(this.getNavigationItem(type, type === onType));
                            break;

                        case 'GraphQLInputObjectType':
                            inputs.items.push(this.getNavigationItem(type, type === onType));
                            break;

                        default:
                            others.items.push(this.getNavigationItem(type, type === onType));
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
            ].filter((section: NavSectionType) => section.items.length > 0)
        };
    }
}