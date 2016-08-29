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

import {getTypeOf, LIST, NON_NULL} from './introspection';

/**
 * Plugin Base implementation
 */
export class Plugin implements PluginInterface {

    document: Schema;

    url: refToUrl;

    graphdocPackage: any;

    projectPackage: any;

    queryType: SchemaType | null = null;

    mutationType: SchemaType | null = null;

    subscriptionType: SchemaType | null = null;

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