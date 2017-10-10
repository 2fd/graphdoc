import {
    TypeRef,
    InputValue
} from '../interface';

import { LIST, NON_NULL } from './introspection';

export class HTML {
    index = 1;

    code(code: string): string {
      return `<code class="highlight"><table class="code"><tbody>${code}</tbody></table></code>`;
    }

    highlight(text: string): string {
        return `<strong>${text}</strong>`;
    }

    sup(text: string): string {
        return ` <sup>${text}</sup>`;
    }

    line(code?: string): string {
        const row = this.index++;
        return `<tr class="row"><td id="L${row}" class="td-index">${row}</td><td id="LC${row}" class="td-code">${code || ''}</td></tr>`;
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

    useIdentifierLength(type: TypeRef, base: number = 0): number {
        switch (type.kind) {
            case LIST:
                return this.useIdentifierLength(type.ofType as TypeRef, base + 2);

            case NON_NULL:
                return this.useIdentifierLength(type.ofType as TypeRef, base + 1);

            default:
                return base + type.name.length;
        }
    }

    value(val: string): string {
        return val[0] === '"' ?
            `<span class="string">${val}</span>` :
            `<span class="constant numeric">${val}</span>`;
    }
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