import {
    Schema,
    PluginInterface,
    DocumentSectionInterface,
    NavigationSectionInterface,
    NavigationItemInterface,
    refToUrl,
    SchemaType,
    TypeRef,
} from '../interface';

import { getTypeOf, LIST, NON_NULL } from './introspection';

/**
 * Plugin Base implementation
 */
export class Plugin implements PluginInterface {

    document: Schema;

    url: refToUrl;

    graphdocPackage: any;

    projectPackage: any;

    queryType?: SchemaType;

    mutationType?: SchemaType;

    subscriptionType?: SchemaType;

    constructor(document: Schema, urlResolver: refToUrl, graphdocPackage: any, projectPackage: any) {
        this.document = document;
        this.url = urlResolver;
        this.graphdocPackage = graphdocPackage;
        this.projectPackage = projectPackage;

        if (document.queryType) {
            this.queryType = this.document.types
                .find((type) => type.name === document.queryType.name);
        }

        if (document.mutationType) {
            this.mutationType = this.document.types
                .find((type) => type.name === document.mutationType.name);
        }

        if (document.subscriptionType) {
            this.subscriptionType = this.document.types
                .find((type) => type.name === document.subscriptionType.name);
        }

        this.document.types = this.document.types.sort(sortTypes);
        this.document.directives = this.document.directives.sort((a, b) => a.name.localeCompare(b.name));

    }

    getNavigations(buildForType?: string): NavigationSectionInterface[] {
        return [];
    }

    getDocuments(buildForType?: string): DocumentSectionInterface[] {
        return [];
    }
    getHeaders(buildForType?: string): string[] {
        return [];
    }

    getAssets(): string[] {
        return [];
    }
}

export class NavigationSection implements NavigationSectionInterface {
    title: string;
    items: NavigationItemInterface[];

    constructor(title: string, items: NavigationItem[] = []) {
        this.title = title;
        this.items = items;
    }
}
export class NavigationItem implements NavigationItemInterface {

    text: string;
    href: string;
    isActive: boolean;

    constructor(text, href, isActive) {
        this.text = text;
        this.href = href;
        this.isActive = isActive;
    }
}

/**
 * 
 */
export function resolveUrlFor(baseUrl: string) {

    return function resolveUrl(type: TypeRef): string {

        const name = (getTypeOf(type).name as string).toLowerCase();

        if (name[0] === '_' && name[1] === '_')
            return baseUrl + name.slice(2) + '.spec.html';

        return baseUrl + name + '.doc.html';
    };
};

function priorityType(type: SchemaType): number {

    return (
        0 /* initial priority */ |
        (type.name[0] === '_' ? 1 : 0) /* protected type priority */ |
        (type.name[0] === '_' && type.name[1] === '_' ? 2 : 0) /* spec type priority */
    );
}

export function sortTypes(a: SchemaType, b: SchemaType): number {

    const priorityA = priorityType(a);
    const priorityB = priorityType(b);

    console.log(priorityA);
    console.log(priorityB);

    if (priorityA === priorityB) {
        return a.name.localeCompare(b.name);
    } else {
        return priorityA - priorityB;
    }


}