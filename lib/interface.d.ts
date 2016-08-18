import { GraphQLSchema } from 'graphql/type/schema';
import { GraphQLType } from 'graphql/type/definition';

export type NavigationSection = {
    title: string,
    items: NavigationItem[],
};

export type NavigationItem = {
    href: string,
    text: string,
    isActive: boolean,
}

export type DocumentSection = {
    title: string,
    description: string,
};

export interface DocumentPlugin {
    getSections(type: GraphQLType | GraphQLSchema): DocumentSection | null;
}

type ResolveURL = (type: GraphQLType | GraphQLSchema) => string;