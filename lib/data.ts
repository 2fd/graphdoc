import { DocumentSection, NavigationItem, NavigationSection, DocumentPlugin, ResolveURL, Schema, TypeRef } from './interface';
import { SCALAR, OBJECT, ENUM, INPUT_OBJECT, INTERFACE, UNION, getTypeOf } from './introspection';

function sup(text: string): string {
    return ' <sup>' + text.toUpperCase() + '</sup>';
}



export class Data {

    schema: Schema;

    plugins: DocumentPlugin[];

    url: ResolveURL;

    includeNative: boolean;

    constructor(schema: Schema, plugins: DocumentPlugin[], url: ResolveURL) {
        this.url = url;
        this.schema = schema;
        this.plugins = plugins;
    }

    getNavigationItem(type: TypeRef, isActive: boolean): NavigationItem {

        type = getTypeOf(type);

        return {
            href: this.url(type),
            text: type.name,
            isActive
        };
    }

    getNativeNavigationItem(type: TypeRef, isActive: boolean): NavigationItem {

        type = getTypeOf(type);

        return {
            href: this.url(type),
            text: type.name + sup(type.kind),
            isActive
        };
    }

    getNavigationSection(name: string): NavigationSection {
        return {
            title: name,
            items: []
        };
    }

    getSchemaNavigationSection(onType?: string): NavigationSection {

        let schemaSection: NavigationSection = this.getNavigationSection('Schema');

        if (this.schema.queryType)
            schemaSection.items.push(this.getNavigationItem(this.schema.queryType, this.schema.queryType.name === onType));

        if (this.schema.mutationType)
            schemaSection.items.push(this.getNavigationItem(this.schema.mutationType, this.schema.mutationType.name === onType));

        if (this.schema.subscriptionType)
            schemaSection.items.push(this.getNavigationItem(this.schema.mutationType, this.schema.mutationType.name === onType));

        return schemaSection;
    }

    getTypeData(type: TypeRef) {

        const t = getTypeOf(type);

        return {
            title: t.name,
            description: marked(t.description || ''),
            sections: this.plugins
                .map(plugin => plugin.getTypeSection(type))
                .filter((result) => Boolean(result)),
        };
    }

    getSchemaData(name: string, description: string) {
        return {
            title: name,
            description: marked(description),
            sections: this.plugins
                .map(plugin => plugin.getIndexSection(this.schema))
                .filter((result) => Boolean(result)),
        };
    }

    getNativeSchemaData(name: string, description: string) {
        return {
            title: name,
            description: marked(description),
            sections: this.plugins
                .map(plugin => plugin.getNativeSection(this.schema))
                .filter((result) => Boolean(result)),
        };
    }

    getNavigationData(onType?: string) {

        let types = this.schema.types;
        let navs = {
            SCHEMA: this.getSchemaNavigationSection(onType),
            [SCALAR]: this.getNavigationSection('Scalars'),
            [ENUM]: this.getNavigationSection('Enums'),
            [OBJECT]: this.getNavigationSection('Objects'),
            [INTERFACE]: this.getNavigationSection('Interfaces'),
            [UNION]: this.getNavigationSection('Unions'),
            [INPUT_OBJECT]: this.getNavigationSection('Input Objects'),
            GQL: this.getNavigationSection('GraphQL'),
        };

        types
            .forEach((type) => {

                if (type.name[0] === '_' && type.name[1] === '_') {
                    navs.GQL.items.push(this.getNativeNavigationItem(type, type.name === onType));

                } else if (navs[type.kind]) {
                    navs[type.kind].items.push(this.getNavigationItem(type, type.name === onType));

                } else {
                    navs.OTHER.items.push(this.getNavigationItem(type, type.name === onType))
                }
            });

        return {
            navs: Object.keys(navs)
                .map(name => navs[name])
                .filter(section => section.items.length > 0)
        };
    }
}