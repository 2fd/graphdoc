import * as path from 'path';
import {
    Schema,
    PluginImplementedInterface,
    PluginInterface,
    DocumentSectionInterface,
    NavigationSectionInterface,
    NavigationItemInterface,
    Directive,
    SchemaType,
    TypeRef,
} from '../interface';

import { getFilenameOf } from './introspection';

/**
 * Plugin Base implementation
 */
export class Plugin implements PluginInterface, PluginImplementedInterface {

    static collect<T>(collection: T[][]): T[] {

        let result: T[] = [];

        collection
            .forEach(item => {
                if (Array.isArray(item))
                    result = result.concat(item);
            });

        return result;
    }

    static collectNavigations(plugins: PluginInterface[], buildForType?: string): Promise<NavigationSectionInterface[]> {
        return Promise
            .all(plugins.map(plugin => {
                return plugin.getNavigations ?
                    plugin.getNavigations(buildForType) :
                    null as any;
            }))
            .then((navigationCollection) => Plugin.collect(navigationCollection));
    }

    static collectDocuments(plugins: PluginInterface[], buildForType?: string): Promise<DocumentSectionInterface[]> {
        return Promise
            .all(plugins.map(plugin => {
                return plugin.getDocuments ?
                    plugin.getDocuments(buildForType) :
                    null as any;
            }))
            .then((navigationCollection) => Plugin.collect(navigationCollection));
    }

    static collectHeaders(plugins: PluginInterface[], buildForType?: string): Promise<string[]> {
        return Promise
            .all(plugins.map(plugin => {
                return plugin.getHeaders ?
                    plugin.getHeaders(buildForType) :
                    null as any;
            }))
            .then((assetCollection) => Plugin.collect(assetCollection));
    }

    static collectAssets(plugins: PluginInterface[]): Promise<string[]> {
        return Promise
            .all(plugins.map(plugin => {
                return plugin.getAssets ?
                    plugin.getAssets() :
                    null as any;
            }))
            .then((assetCollection) => Plugin.collect(assetCollection));
    }

    queryType: SchemaType | null = null;

    mutationType: SchemaType | null = null;

    subscriptionType: SchemaType | null = null;

    typeMap: {
        [name: string]: SchemaType
    } = {};

    directiveMap: {
        [name: string]: Directive
    } = {};

    constructor(
        public document: Schema,
        public projectPackage: any,
        public graphdocPackage: any,
    ) {

        this.document.types = this.document.types ?
            this.document.types.sort(sortTypes) : [];

        this.document.directives = this.document.directives ?
            this.document.directives.sort((a, b) => a.name.localeCompare(b.name)) : [];

        this.document.types.forEach((type) => {
            this.typeMap[type.name] = type;
        });

        this.document.directives.forEach((directive) => {
            this.directiveMap[directive.name] = directive;
        });

        if (document.queryType) {
            this.queryType = this.typeMap[document.queryType.name];
        }

        if (document.mutationType) {
            this.mutationType = this.typeMap[document.mutationType.name];
        }

        if (document.subscriptionType) {
            this.subscriptionType = this.typeMap[document.subscriptionType.name];
        }
    }

    url(type: TypeRef): string {
        return path.resolve(this.projectPackage.graphdoc.baseUrl, getFilenameOf(type));
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

    if (priorityA === priorityB) {
        return a.name.localeCompare(b.name);
    } else {
        return priorityA - priorityB;
    }


}