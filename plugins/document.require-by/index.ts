import { resolve } from 'path';
import * as striptags from 'striptags';
import {
    SCALAR,
    OBJECT,
    INPUT_OBJECT,
    INTERFACE,
    ENUM,
    UNION,
    Plugin,
    getTypeOf,
} from '../../lib/utility';
import {
    PluginInterface,
    DocumentSectionInterface,
    Schema,
    SchemaType,
} from '../../lib/interface';

// Fix signature
const stript: typeof striptags.default = striptags as any;

export default class RequireByPlugin extends Plugin implements PluginInterface {

    requireBy: Map<string, SchemaType[]>;

    constructor(
        public document: Schema,
        public projectPackage: any,
        public graphdocPackage: any,
    ) {
        super(document, projectPackage, graphdocPackage);

        this.requireBy = new Map();

        if (Array.isArray(document.types))
            document.types.forEach((type: SchemaType) => {
                switch (type.kind) {

                    // Scalars and enums have no dependencies
                    case SCALAR:
                    case ENUM:
                        return;

                    case OBJECT:
                    case INTERFACE:
                    case UNION:
                    case INPUT_OBJECT:
                        this.getDependencies(type)
                            .forEach((curr: string) => {
                                let deps = this.requireBy.get(curr) || [];
                                deps.push(type);
                                this.requireBy.set(curr, deps);
                            });
                        break;
                }
            });
    }

    getAssets() {
        return [
            resolve(__dirname, 'require-by.css')
        ];
    }

    getDependencies(type: SchemaType): string[] {

        let deps: string[] = [];

        if (Array.isArray(type.interfaces) && type.interfaces.length > 0) {
            type.interfaces
                .forEach(i => deps.push(i.name));
        }

        if (Array.isArray(type.fields) && type.fields.length > 0) {
            type.fields
                .forEach(field => {
                    deps.push(getTypeOf(field.type).name);

                    if (Array.isArray(field.args) && field.args.length > 0) {
                        field.args
                            .forEach(arg => {
                                deps.push(getTypeOf(arg.type).name);
                            });
                    }
                });
        }

        if (Array.isArray(type.inputFields) && type.inputFields.length > 0) {
            type.inputFields
                .forEach(field => {
                    deps.push(getTypeOf(field.type).name);
                });
        }

        if (type.kind !== INTERFACE && Array.isArray(type.possibleTypes) && type.possibleTypes.length > 0) {
            type.possibleTypes
                .forEach(t => {
                    deps.push(getTypeOf(t).name);
                });
        }

        return deps;
    }

    getDescription(type: SchemaType): string {
        return '<li>' +
            '<a href="' + this.url(type) + '" title="' +
            type.name + ' - ' + stript(type.description).replace(/"/gi, '&quot;') +
            '">' +
            type.name + '<em>' + type.description + '</em>' +
            '</a>' +
            '<li>';
    }

    getDocuments(buildForType?: string): DocumentSectionInterface[] {

        if (!buildForType)
            return [];

        const requireBy = this.requireBy.get(buildForType);

        if (!Array.isArray(requireBy) || requireBy.length === 0)
            return [{
                title: 'Required by',
                description: '<div class="require-by anyone">' +
                'This element is not required by anyone' +
                '</div>',
            }];

        let used = new Set();

        return [{
            title: 'Required by',
            description: '<ul class="require-by">' +
            requireBy
                .filter((t) => {
                    return used.has(t.name) ?
                        false : used.add(t.name);
                })
                .map(t => this.getDescription(t))
                .join('') +
            '</ul>',
        }];
    }

    getHeaders(): string[] {
        return [
            '<link type="text/css" rel="stylesheet" href="./assets/require-by.css" />',
        ];
    }
}
