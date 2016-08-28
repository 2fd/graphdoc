import { Schema, DocumentSectionInterface, NavigationSectionInterface, NavigationItemInterface, refToUrl, SchemaType, TypeRef, InputValue, EnumValue, Directive } from './interface';

export const LIST = 'LIST';
export const NON_NULL = 'NON_NULL';
export const SCALAR = 'SCALAR';
export const OBJECT = 'OBJECT';
export const INTERFACE = 'INTERFACE';
export const UNION = 'UNION';
export const ENUM = 'ENUM';
export const INPUT_OBJECT = 'INPUT_OBJECT';

export function getTypeOf(type: TypeRef): TypeRef {

  while (type.kind === LIST || type.kind === NON_NULL)
    type = type.ofType as TypeRef;

  return type;
}

export function split(text: string, len: number): string[] {

    return text
        .split(/\s+/)
        .reduce((result: string[], word: string) => {

            let last = result.length - 1;
            let lineLen = result[last].length;

            if (lineLen === 0) {
                result[last] = word;

            } else if (lineLen < len) {
                result[last] = result[last] + ' ' + word;

            } else {
                result.push(word);
            }

            return result;

        }, ['']);
}

function codeLines(html: string): number {

    const len = html.length;
    let count = 0;
    let position = -1;

    do {
        position = html.indexOf('</li><li>', position + 1);
        count++;
    } while (position !== -1);

    return count;
};

function codePadding(html: string): number {

    let lines = codeLines(html);

    return String((String(lines).length * 14) + 14) + 'px';
};

export const html = {
    code: (code: string) => `<code class="highlight"><ul class="code" style="padding-left:${codePadding(code)}">${code}</ul></code>`,
    sup: (text: string) => ` <sup>${text}</sup>`,
    line: (code: string) => `<li>${code}</li>`,
    tab: (code: string) => `<span class="tab">${code}</span>`,
    keyword: (keyword: string) => `<span class="keyword operator ts">${keyword}</span>`,
    comment: (comment: string) => `<span class="comment line"># ${comment}</span>`,
    identifier: (type: TypeRef) => `<span class="identifier">${type.name}</span>`,
    parameter: (arg: InputValue) => `<span class="variable parameter">${arg.name}</span>`,
    property: (name: string) => `<span class="meta">${name}</span>`,
    useIdentifier: (type: TypeRef, toUrl: string): string => {
        switch (type.kind) {
            case LIST:
                return '[' + html.useIdentifier(type.ofType as TypeRef, toUrl) + ']';

            case NON_NULL:
                return html.useIdentifier(type.ofType as TypeRef, toUrl) + '!';

            default:
                return `<a class="support type" href="${toUrl}">${type.name}</a>`;
        }
    },
    value: (val: string) => val[0] === '"' ?
        `<span class="string">${val}</span>` :
        `<span class="constant numeric">${val}</span>`,
}

export class Plugin implements PluginInterface {

    document: Schema;

    url: refToUrl;

    queryType: SchemaType | null = null;

    mutationType: SchemaType | null = null;

    subscriptionType: SchemaType | null = null;

    constructor(document: Schema, urlResolver: refToUrl) {
        this.document = document;
        this.url = urlResolver;

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