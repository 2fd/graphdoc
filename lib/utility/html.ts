import {
    TypeRef,
    InputValue
} from '../interface';

import { LIST, NON_NULL } from './introspection';

const EM_SIZE = 14;

function htmlLines(html: string): number {

    let count = 0;
    let position = 0;

    while (position !== -1) {
        position = html.indexOf('</li><li>', position + 1);
        count++;
    }

    return count;
};

function padding(html: string): string {

    const lines = htmlLines(html);
    const orderOfMagnitude = lines.toString().length;

    return (orderOfMagnitude * EM_SIZE + EM_SIZE).toString() + 'px';
};

class HTML {

    code(code: string): string {
        return `<code class="highlight"><ul class="code" style="padding-left:${padding(code)}">${code}</ul></code>`;
    }

    highlight(text: string): string {
        return `<strong>${text}</strong>`;
    }

    sup(text: string): string {
        return ` <sup>${text}</sup>`;
    }

    line(code: string): string {
        return `<li>${code}</li>`;
    }

    tab(code: string): string {
        return `<span class="tab">${code}</span>`;
    }

    keyword(keyword: string): string {
        return `<span class="keyword operator ts">${keyword}</span>`;
    }

    comment(comment: string): string {
        return `<span class="comment line"># ${comment}</span>`;
    }

    identifier(type: TypeRef): string {
        return `<span class="identifier">${type.name}</span>`;
    }

    parameter(arg: InputValue): string {
        return `<span class="variable parameter">${arg.name}</span>`;
    }

    property(name: string): string {
        return `<span class="meta">${name}</span>`;
    }

    useIdentifier(type: TypeRef, toUrl: string): string {
        switch (type.kind) {
            case LIST:
                return '[' + this.useIdentifier(type.ofType as TypeRef, toUrl) + ']';

            case NON_NULL:
                return this.useIdentifier(type.ofType as TypeRef, toUrl) + '!';

            default:
                return `<a class="support type" href="${toUrl}">${type.name}</a>`;
        }
    }

    value(val: string): string {
        return val[0] === '"' ?
            `<span class="string">${val}</span>` :
            `<span class="constant numeric">${val}</span>`;
    }
}


export const html = new HTML;

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