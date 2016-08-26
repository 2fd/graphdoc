import { Schema, NavigationSectionInterface, NavigationItemInterface, nameToUrl, TypeRef, InputValue, EnumValue, Directive } from './interface';
import { LIST, NON_NULL } from './introspection';

export function breack(text: string, len: number): string[] {

    return text
        .split(/\s+/)
        .reduce((result: string[], word: string) => {

            let lineLen = result[result.length].length;

            if(lineLen === 0) {
                result[result.length] = word;

            } else if(lineLen < len) {
                result[result.length] = result[result.length] + ' ' + word;

            } else {
                result.push(word);
            }

            return  result;

        }, ['']);
}

export const html = {
    sup: (text: string) => ` <sup>${text}</sup>`,
    code: (code: string) => `<code class="code"><ul>${code}</ul></code>`,
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
                return '[' + this.useIdentifier(type.ofType as TypeRef, toUrl) + ']';

            case NON_NULL:
                return this.useIdentifier(type.ofType as TypeRef, toUrl) + '!';

            default:
                return `<a class="support type" href="${toUrl}">${type.name}</a>`;
        }
    },
    value: (val: string) => `<span class="string">${val}</span>`,
}

export class NavigationPlugin {

    schema: Schema;

    url: nameToUrl

    constructor(schema: Schema, urlResolver: nameToUrl) {
        this.schema = schema;
        this.url = urlResolver;
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
    isActive: boolean

    constructor(text, href, isActive) {
        this.text = text;
        this.href = href;
        this.isActive = isActive;
    }

}