import { resolve } from 'path';
import { SCALAR, OBJECT, INPUT_OBJECT, INTERFACE, ENUM, UNION, html, split, Plugin} from '../../utility';
import {
    refToUrl,
    PluginInterface,
    DocumentSectionInterface,
    Schema,
    SchemaType,
    Field,
    InputValue,
    EnumValue,
    Directive
} from '../../interface';

const MAX_CODE_LEN = 50;
const MAX_COMMENT_LEN = 80;

export default class SchemaPlugin  extends Plugin implements PluginInterface {

    getHeaders() {
        return [
            '<link href="https://fonts.googleapis.com/css?family=Ubuntu+Mono:400,700" rel="stylesheet">',
            '<link type="text/css" rel="stylesheet" href="./assets/code.css" />',
        ];
    }

    getAssets() {
        return [
            resolve(__dirname, 'code.css')
        ];
    }

    getDocuments(buildForType?: string): DocumentSectionInterface[] {

        const code = this.code(buildForType);

        if (code)
            return [{
                title: 'GraphQL Schema definition',
                description: html.code(code)
            }];

        return [];
    }

    code(buildForType?: string): string {

        if (!buildForType)
            return this.schema(this.document);

        const directive = this.document
            .directives
            .find((directive) => directive.name === (buildForType as string));

        if (directive)
            return this.directive(directive);

        const type = this.document
            .types
            .find((type) => type.name === (buildForType as string));

        if (type) {
            switch (type.kind) {

                case SCALAR:
                    return this.scalar(type);

                case OBJECT:
                    return this.object(type);

                case INTERFACE:
                    return this.interfaces(type);

                case UNION:
                    return this.union(type);

                case ENUM:
                    return this.enum(type);

                case INPUT_OBJECT:
                    return this.inputObject(type);
            }
        }

        return null;
    }

    arguments(fieldOrDirectives: Field | Directive): string {

        if (fieldOrDirectives.args.length === 0) {
            return '';
        }

        return '(' +
            fieldOrDirectives
                .args
                .map((arg) => this.inputValue(arg))
                .join(', ') +
            ')';
    }

    argumentDescription(arg: InputValue): string[] {

        const desc = arg.description === null ?
            '<strong><em>' + arg.description + '</em></strong>' : arg.description;

        return this.description(arg.name + ': ' + desc);
    }

    argumentsDescription(fieldOrDirectives: Field | Directive): string[] {

        if (fieldOrDirectives.args.length === 0) {
            return [];
        }

        const reduceArguments = (descriptions: string[], arg: InputValue) => descriptions.concat(this.argumentDescription(arg);

        return fieldOrDirectives.args
            .reduce(reduceArguments, [html.comment('Arguments')]);
    }

    deprecated(fieldOrEnumVal: Field | EnumValue): string {

        if (!fieldOrEnumVal.isDeprecated)
            return '';

        if (!fieldOrEnumVal.deprecationReason) {
            return html.keyword('@deprecated');
        }

        return html.keyword('@deprecated')
            + '( reason: ' + html.value('"' + fieldOrEnumVal.deprecationReason + '" ') + ' )';
    }

    description(description: string): string[] {

        if (description)
            return split(description, MAX_CODE_LEN)
                .map(descriptionLine => html.comment(descriptionLine));

        return [];
    }

    directive(directive: Directive): string {
        return html.line(
            html.keyword('directive') + ' ' +
            html.keyword('@' + directive.name) + this.arguments(directive) + ' on ' +
            directive.locations.map(location => html.keyword(location)).join(' | ')
        );
    }

    enum(type: SchemaType): string {

        const reduceEnumValues = (lines: string[], enumValue: EnumValue) => lines
            .concat(
            [''],
            this.description(enumValue.description),
            [html.property(enumValue.name) + this.deprecated(enumValue)],
        );

        return html.line(html.keyword('enum') + ' ' + html.identifier(type) + ' {') +
            type.enumValues
                .reduce(reduceEnumValues, [])
                .map(line => html.line(html.tab(line)))
                .join('') +
            html.line('}');
    }

    field(field: Field): string {

        const fieldDescription = this.description(field.description);
        const argumentsDescription = this.argumentsDescription(field);

        if (fieldDescription.length > 0 && argumentsDescription.length)
            fieldDescription.push(html.comment(''));

        return []
            .concat(fieldDescription)
            .concat(argumentsDescription)
            .concat([
                html.property(field.name) + this.arguments(field) + ': ' +
                html.useIdentifier(field.type, this.url(field.type)) + ' ' + this.deprecated(field)
            ])
            .map(line => html.line(html.tab(line)))
            .join('');
    }

    fields(type: SchemaType): string {

        return html.line('') +
            type.fields
                .map(field => this.field(field))
                .join(html.line(''));
    }

    inputObject(type: SchemaType): string {

        return html.line(html.keyword('input') + ' ' + html.identifier(type) + ' {') +
            this.inputValues(type.inputFields) +
            html.line('}');
    }

    inputValues(inputValues: InputValue[]): string {
        return inputValues
            .map(inputValue => html.line(this.inputValue(inputValue)))
            .join(html.line(''));
    }

    inputValue(arg: InputValue): string {

        const defaultValue = arg.defaultValue ?
            ' = ' + html.value(arg.defaultValue as string) : '';

        return html.parameter(arg) + ': ' + html.useIdentifier(arg.type, this.url(arg.type)) + defaultValue;
    }

    interfaces(type: SchemaType): string {

        return html.line(html.keyword('interface') + ' ' + html.identifier(type) + ' {') +
            this.fields(type) +
            html.line('}');
    }

    object(type: SchemaType): string {

        const interfaces = type.interfaces
            .map(i => html.useIdentifier(i, this.url(i)))
            .join(', ');

        const implemente = interfaces.length === 0 ? '' :
            ' ' + html.keyword('implements') + ' ' + interfaces;

        return html.line(html.keyword('type') + ' ' + html.identifier(type) + implemente + ' {') +
            this.fields(type) +
            html.line('}');
    }

    scalar(type: SchemaType): string {
        return html.line(html.keyword('scalar') + ' ' + html.identifier(type));
    }

    schema(schema: Schema): string {

        let definition = html.line(html.keyword('schema') + ' {');

        if (schema.queryType)
            definition += html.line('') +
                this.description(schema.queryType.description)
                    .map(line => html.line(html.tab(line)))
                    .join('') +

                html.line(html.tab(
                    html.property('query') + ': ' + html.useIdentifier(schema.queryType, this.url(schema.queryType))
                ));

        if (schema.mutationType)
            definition += html.line('') +

                this.description(schema.mutationType.description)
                    .map(line => html.line(html.tab(line)))
                    .join('') +

                html.line(html.tab(
                    html.property('mutation') + ': ' + html.useIdentifier(schema.mutationType, this.url(schema.queryType))
                ));

        if (schema.subscriptionType)
            definition += html.line('') +
                this.description(schema.subscriptionType.description)
                    .map(line => html.line(html.tab(line)))
                    .join('') +

                html.line(html.tab(
                    html.property('suscription') + ': ' + html.useIdentifier(schema.subscriptionType, this.url(schema.queryType))
                ));

        definition += html.line('}');

        const order = {
            [SCALAR]: '1',
            [ENUM]: '2',
            [INTERFACE]: '3',
            [UNION]: '4',
            [OBJECT]: '5',
            [INPUT_OBJECT]: '6',
        }

        return [definition]
           /* .concat(
            schema.directives
                .map((directive) => {
                    return html.line(html.comment('DIRECTIVE')) +
                        this.description(directive.description)
                        .map(line => html.line(line))
                        .join('') +
                        this.code(directive.name);
                }),
            schema.types
                .sort((a: SchemaType, b: SchemaType) => {
                    return order[a.kind].localeCompare(order[b.kind]);
                })
                .map((type) => {
                    return html.line(html.comment(type.kind)) +
                        this.description(type.description)
                        .map(line => html.line(line))
                        .join('') +
                        this.code(type.name);
                }))*/
            .join(html.line(''));

        /* return [this.schemaDefinition(schema)]
             .concat(
             directives.map(directive => this.directive(directive)),
             types.map((type) => this.type(type) as string)
             )
             .join('\n\n') + '\n';*/
    }

    union(type: SchemaType): string {

        return html.line(
            html.keyword('union') + ' ' + html.identifier(type) + ' = ' +
            type.possibleTypes
                .map(type => html.useIdentifier(type, this.url(type)))
                .join(' | ')
        );
    }
}
