import { html } from '../utility';
import { DocumentPluginInterface, DocumentSectionInterface, nameToUrl} from '../interface';

export class SchemaDocumentPlugin implements DocumentPluginInterface {

  title: string;

  url: nameToUrl;

  constructor(title, url: nameToUrl) {
    this.title = title;
    this.url = url;
  }

  getSections(): DocumentSectionInterface[] {
    return [];
  }

  args(fieldOrDirectives): string {

    if (fieldOrDirectives.args.length === 0) {
      return '';
    }

    return '(' +
      fieldOrDirectives
        .args
        .map((arg) => this.inputValue(arg))
        .join(', ')
      + ')';
  }

  argDescription(arg: GraphQLArgument): string {

    if (arg.description) {
      return this.desc(arg.name + ': ' + arg.description);
    }

    return this.desc(arg.name + ': <strong><em>' + arg.description + '</em></strong>');
  }

  argsDescription(fieldOrDirectives): string {

    if (fieldOrDirectives.args.length === 0) {
      return '';
    }

    return '  ' + comment('Arguments') + '\n' +
      fieldOrDirectives
        .args
        .map((arg) => this.argDescription(arg))
        .join('  ' + comment('') + '\n');
  }

  deprecated(fieldOrEnumVal): string {

    const reason = fieldOrEnumVal.deprecationReason;

    if (isNullish(reason)) {
      return '';
    }

    if (reason === '' || reason === DEFAULT_DEPRECATION_REASON) {
      return ' ' + keyword('@deprecated');
    }

    return ' ' + keyword('@deprecated')
      + '( reason: ' + val(this.value(reason, GraphQLString)) + ' )';
  }

  desc(description: string): string {
    return description ?
      breakText(description, 50)
        .map(descriptionLine => '  ' + comment(descriptionLine))
        .join('\n') + '\n' :
      '';
  }

  directive(directive) {
    return keyword('directive')
      + ' ' + keyword('@' + directive.name) + this.args(directive) +
      ' on ' + directive.locations.map(location => keyword(location)).join(' | ');
  }

  enum(type: GraphQLEnumType): string {
    const values = type.getValues();
    return keyword('enum') + ' ' + identifier(type) + ' {\n'
      + values.map(v => '\n' + this.desc(v.description) + '  ' + property(v.name) + this.deprecated(v)).join('\n') + '\n' +
      '}';
  }

  field(field): string {

    const desc = [
      this.desc(field.description),
      this.argsDescription(field)
    ]
      .filter(d => Boolean(d))
      .join('  ' + comment('') + '\n');

    return '\n' + desc +
      '  ' + property(field.name) + this.args(field) + ': ' +
      useIdentifier(field.type, this.url(field.type)) + this.deprecated(field);
  }

  fields(type: GraphQLObjectType): string {

    const fieldMap = type.getFields();
    const fields = Object
      .keys(fieldMap)
      .map(fieldName => fieldMap[fieldName]);

    return fields
      .map(field => this.field(field))
      .join('\n');
  }

  definedSchema(schema: GraphQLSchema): string {
    const directives = schema
      .getDirectives();
    const typeMap = schema
      .getTypeMap();
    const types = Object
      .keys(typeMap)
      .sort((name1, name2) => name1.localeCompare(name2))
      .map(typeName => typeMap[typeName]);

    return [this.schemaDefinition(schema)]
      .concat(
      directives.map(directive => this.directive(directive)),
      types.map((type) => this.type(type) as string)
      )
      .join('\n\n') + '\n';
  }

  nativeSchema(schema: GraphQLSchema): string {
    const directives = schema
      .getDirectives()
      .filter(directive => isSpecDirective(directive.name));
    const typeMap = schema
      .getTypeMap();
    const types = Object
      .keys(typeMap)
      .filter(type => !isDefinedType(type))
      .sort((name1, name2) => name1.localeCompare(name2))
      .map(typeName => typeMap[typeName]);

    return []
      .concat(
      directives.map(directive => this.directive(directive)),
      types.map((type) => this.type(type) as string)
      )
      .join('\n\n') + '\n';
  }

  inputObject(type: GraphQLInputObjectType): string {
    const fieldMap = type.getFields();
    const fields = Object.keys(fieldMap).map(fieldName => fieldMap[fieldName]);
    return keyword('input') + ' ' + identifier(type) + ' {\n' +
      fields.map(f => '  ' + this.inputValue(f)).join('\n') + '\n' +
      '}';
  }

  inputValue(arg: GraphQLArgument) {

    const defaultValue = isNullish(arg.defaultValue) ?
      '' : ' = ' + this.value(arg.defaultValue, arg.type);

    return parameter(arg) + ': ' + useIdentifier(arg.type, this.url(arg.type)) + defaultValue;
  }

  interfaces(type: GraphQLInterfaceType): string {
    return keyword('interface') + ' ' + identifier(type) + ' {\n' +
      this.fields(type) + '\n' +
      '}';
  }

  object(type: GraphQLObjectType): string {

    const interfaces = type.getInterfaces();
    const implementedInterfaces = interfaces.length ?
      ' ' + keyword('implements') + ' '
      + interfaces
        .map(i => useIdentifier(i, this.url(i)))
        .join(', ') :
      '';

    return keyword('type') + ' ' + identifier(type) + implementedInterfaces + ' {\n' +
      this.fields(type) + '\n' +
      '}';
  }

  scalar(type: GraphQLScalarType): string {
    return keyword('scalar') + ' ' + identifier(type);
  }

  schema(schema: GraphQLSchema): string {
    return this.definedSchema(schema);
  }

  native(schema: GraphQLSchema): string {
    return this.nativeSchema(schema);
  }

  schemaDefinition(schema: GraphQLSchema): string {
    const operationTypes: string[] = [];

    const queryType = schema.getQueryType();
    if (queryType) {
      operationTypes.push('\n' + this.desc(queryType.description) + '  ' + property('query') + ': ' + useIdentifier(queryType, this.url(queryType)));
    }

    const mutationType = schema.getMutationType();
    if (mutationType) {
      operationTypes.push('\n' + this.desc(mutationType.description) + '  ' + property('mutation') + ': ' + useIdentifier(mutationType, this.url(mutationType)));
    }

    const subscriptionType = schema.getSubscriptionType();
    if (subscriptionType) {
      operationTypes.push('\n' + this.desc(subscriptionType.description) + '  ' + property('subscription') + ': ' + useIdentifier(subscriptionType, this.url(subscriptionType)));
    }

    return keyword('schema') + ` {\n${operationTypes.join('\n')}\n}`;
  }

  type(type: GraphQLType): string | null {

    switch(type.constructor.name) {
      case 'GraphQLScalarType':
        return this.scalar(type);

      case 'GraphQLObjectType':
        return this.object(type);

      case 'GraphQLInterfaceType':
        return this.interfaces(type);

      case 'GraphQLUnionType':
        return this.union(type);

      case 'GraphQLEnumType':
        return this.enum(type);

      case 'GraphQLInputObjectType':
        return this.inputObject(type);

      default:
        return null;
    }
  }

  union(type: GraphQLUnionType): string {
    return keyword('union') + `${type.name} = ${type.getTypes()
      .map(type => useIdentifier(type, this.url(type)))
      .join(' | ')}`;
  }

  value(value: any, type: GraphQLType): string {
    return val(print(astFromValue(value, type)));
  }
}
