import { GraphQLSchema, GraphQLObjectType, GraphQLType } from 'graphql';
import * as marked from 'marked';

type NavItemType = {
    href: string,
    text: string,
    isActive: boolean,
}

type NavSectionType = {
    title: string,
    items: NavItemType[],
}

type DocSectionType = {
    title: string,
    description: string,
};


export type SectionDefinitionType = {
    title: string;
    description: string;
}

export type SectionCreator = (type: any) => SectionDefinitionType;

export class DataTranslator {

    baseUrl: string;

    schema: GraphQLSchema;

    sectionCreators: SectionCreator[];

    constructor(schema: GraphQLSchema, sectionCreators: SectionCreator[], baseUrl: string) {
        this.schema = schema;
        this.baseUrl = baseUrl;
        this.sectionCreators = sectionCreators;
    }

    getUrl(type: GraphQLType): string {
        return this.baseUrl + (type.name as string).toLowerCase() + '.doc.html';
    }

    getNavItem(type: GraphQLType, isActive: boolean): NavItemType {
        return {
            href: this.getUrl(type),
            text: type.name,
            isActive
        };
    }

    getNavSection(name: string): NavSectionType {
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
            schemaSection.items.push(this.getNavItem(query, query === onType));

        if (mutation)
            schemaSection.items.push(this.getNavItem(mutation, mutation === onType));

        if (subscription)
            schemaSection.items.push(this.getNavItem(subscription, subscription === onType));

        return schemaSection;
    }

    getMainData(type: GraphQLType) {
        return {
            title: type.name,
            description: marked(type.description || ''),
            sections: this.sectionCreators
                .map(creator => creator(type))
                .filter((result) => Boolean(result)),
        };
    }

    getNavigationData(onType: GraphQLType) {

        let types = this.schema.getTypeMap();

        let sections = this.getSchemaNavSection(onType);
        let scalars = this.getNavSection('Scalars');
        let enums = this.getNavSection('Enums');
        let objects = this.getNavSection('Objects');
        let interfaces = this.getNavSection('Interfaces');
        let unions = this.getNavSection('Unions');
        let inputs = this.getNavSection('Input Objects');
        let others = this.getNavSection('GraphQL');

        Object
            .keys(types)
            .forEach((name) => {

                let type = types[name];

                if (name[0] === '_' && name[1] === '_') {
                    others.items.push(this.getNavItem(type, type === onType));

                } else {
                    switch (type.constructor.name) {

                        case 'GraphQLScalarType':
                            scalars.items.push(this.getNavItem(type, type === onType));
                            break;

                        case 'GraphQLEnumType':
                            enums.items.push(this.getNavItem(type, type === onType));
                            break;

                        case 'GraphQLObjectType':
                            objects.items.push(this.getNavItem(type, type === onType));
                            break;

                        case 'GraphQLInterfaceType':
                            interfaces.items.push(this.getNavItem(type, type === onType));
                            break;

                        case 'GraphQLUnionType':
                            unions.items.push(this.getNavItem(type, type === onType));
                            break;

                        case 'GraphQLInputObjectType':
                            inputs.items.push(this.getNavItem(type, type === onType));
                            break;

                        default:
                            others.items.push(this.getNavItem(type, type === onType));
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