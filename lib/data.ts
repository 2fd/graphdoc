import * as marked from 'marked';
import { GraphQLSchema, GraphQLObjectType, GraphQLType } from 'graphql';
import { DocumentSection, NavigationItem, NavigationSection, DocumentPlugin, ResolveURL } from './interface';

function note(text: string): string {
    return ' <sup>' + text.toUpperCase() + '</sup>';
}

export class DataTranslator {

    schema: GraphQLSchema;

    plugins: DocumentPlugin[];

    url: ResolveURL;

    includeNative: boolean;

    constructor(schema: GraphQLSchema, plugins: DocumentPlugin[], url: ResolveURL) {
        this.url = url;
        this.schema = schema;
        this.plugins = plugins;
    }

    getNavigationItem(type: GraphQLType, isActive: boolean): NavigationItem {
        return {
            href: this.url(type),
            text: type.name as string,
            isActive
        };
    }

    getNativeNavigationItem(type: GraphQLType, isActive: boolean): NavigationItem {

        let title: string = type.name as string;

        switch (type.constructor.name) {

            case 'GraphQLScalarType':
                title += note('scalar');
                break;

            case 'GraphQLEnumType':
                title += note('enum');
                break;

            case 'GraphQLObjectType':
                title += note('object');
                break;

            case 'GraphQLInterfaceType':
                title += note('interface');
                break;

            case 'GraphQLUnionType':
                title += note('union');
                break;

            case 'GraphQLInputObjectType':
                title += note('input');
                break;

            default:
                title += note('other');
                break;
        }

        return {
            href: this.url(type),
            text: title,
            isActive
        };
    }

    getNavigationSection(name: string): NavigationSection {
        return {
            title: name,
            items: []
        };
    }

    getSchemaNavigationSection(onType?: GraphQLType): NavigationSection {

        let schemaSection: NavigationSection = this.getNavigationSection('Schema');
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

    getTypeData(type: GraphQLType) {
        return {
            title: type.name,
            description: marked(type.description || ''),
            sections: this.plugins
                .map(plugin => plugin.getTypeSection(type))
                .filter((result) => Boolean(result)),
        };
    }

    getSchemaData(schema: GraphQLSchema, name: string, description: string) {
        return {
            title: name,
            description: marked(description),
            sections: this.plugins
                .map(plugin => plugin.getIndexSection(schema))
                .filter((result) => Boolean(result)),
        };
    }

    getNativeSchemaData(schema: GraphQLSchema, name: string, description: string) {
        return {
            title: name,
            description: marked(description),
            sections: this.plugins
                .map(plugin => plugin.getNativeSection(schema))
                .filter((result) => Boolean(result)),
        };
    }

    getNavigationData(onType?: GraphQLType) {

        let types = this.schema.getTypeMap();

        let sections = this.getSchemaNavigationSection(onType);
        let scalars = this.getNavigationSection('Scalars');
        let enums = this.getNavigationSection('Enums');
        let objects = this.getNavigationSection('Objects');
        let interfaces = this.getNavigationSection('Interfaces');
        let unions = this.getNavigationSection('Unions');
        let inputs = this.getNavigationSection('Input Objects');
        let others = this.getNavigationSection('Others');
        let gql = this.getNavigationSection('GraphQL');

        Object
            .keys(types)
            .forEach((name) => {

                let type = types[name];

                if (name[0] === '_' && name[1] === '_') {
                    gql.items.push(this.getNativeNavigationItem(type, type === onType));

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
                gql,
                others,
            ].filter((section: NavigationSection) => section.items.length > 0)
        };
    }
}