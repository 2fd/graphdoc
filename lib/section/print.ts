import { isNullish } from '../utility';
import { DocumentPlugin } from '../interface';
import { astFromValue } from 'graphql/utilities/astFromValue';
import { print } from 'graphql/language/printer';
import { GraphQLSchema } from 'graphql/type/schema';
import { GraphQLType } from 'graphql/type/definition';
import {
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLUnionType,
  GraphQLEnumType,
  GraphQLInputObjectType,
} from 'graphql/type/definition';
import { GraphQLString } from 'graphql/type/scalars';
import { DEFAULT_DEPRECATION_REASON } from 'graphql/type/directives';

function isSpecDirective(directiveName: string): boolean {
  return (
    directiveName === 'skip' ||
    directiveName === 'include' ||
    directiveName === 'deprecated'
  );
}

function isDefinedType(typename: string): boolean {
  return !isIntrospectionType(typename) && !isBuiltInScalar(typename);
}

function isIntrospectionType(typename: string): boolean {
  return typename.indexOf('__') === 0;
}

function isBuiltInScalar(typename: string): boolean {
  return (
    typename === 'String' ||
    typename === 'Boolean' ||
    typename === 'Int' ||
    typename === 'Float' ||
    typename === 'ID'
  );
}

export class DocumentSchemaPlugin implements DocumentPlugin {

  title: string;

  constructor(title) {
    this.title = title;
  }

  getSections(type: GraphQLType | GraphQLSchema) {

    let definition = (type instanceof GraphQLSchema) ?
      this.schema(type) :
      this.type(type);

    if (definition)
      return {
        title: this.title,
        description: '<pre>' + definition + '</pre>'
      };

    return null;
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

  deprecated(fieldOrEnumVal): string {

    const reason = fieldOrEnumVal.deprecationReason;

    if (isNullish(reason)) {
      return '';
    }

    if (reason === '' || reason === DEFAULT_DEPRECATION_REASON) {
      return ' @deprecated';
    }

    return ' @deprecated(reason: ' + this.value(reason, GraphQLString) + ')';
  }

  directive(directive) {
    return 'directive @' + directive.name + this.args(directive) +
      ' on ' + directive.locations.join(' | ');
  }

  enum(type: GraphQLEnumType): string {
    const values = type.getValues();
    return `enum ${type.name} {\n` +
      values.map(v => '  ' + v.name + this.deprecated(v)).join('\n') + '\n' +
      '}';
  }

  field(field): string {
    return '  ' + field.name + this.args(field) + ': ' +
      String(field.type) + this.deprecated(field);
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

  filteredSchema(
    schema: GraphQLSchema,
    directiveFilter: (type: string) => boolean,
    typeFilter: (type: string) => boolean
  ): string {
    const directives = schema
      .getDirectives()
      .filter(directive => directiveFilter(directive.name));
    const typeMap = schema
      .getTypeMap();
    const types = Object
      .keys(typeMap)
      .filter(typeFilter)
      .sort((name1, name2) => name1.localeCompare(name2))
      .map(typeName => typeMap[typeName]);

    return []
      .concat(
      this.schemaDefinition(schema),
      directives.map(directive => this.directive(directive)),
      types.map((type) => this.type(type))
      )
      .join('\n\n') + '\n';
  }

  inputObject(type: GraphQLInputObjectType): string {
    const fieldMap = type.getFields();
    const fields = Object.keys(fieldMap).map(fieldName => fieldMap[fieldName]);
    return `input ${type.name} {\n` +
      fields.map(f => '  ' + this.inputValue(f)).join('\n') + '\n' +
      '}';
  }

  inputValue(arg) {

    const defaultValue = isNullish(arg.defaultValue) ?
      '' : ' = ' + this.value(arg.defaultValue, arg.type);

    return arg.name + ': ' + String(arg.type) + defaultValue;
  }

  interfaces(type: GraphQLInterfaceType): string {
    return `interface ${type.name} {\n` +
      this.fields(type) + '\n' +
      '}';
  }

  object(type: GraphQLObjectType): string {

    const interfaces = type.getInterfaces();
    const implementedInterfaces = interfaces.length ?
      ' implements ' + interfaces.map(i => i.name).join(', ') : '';

    return `type ${type.name}${implementedInterfaces} {\n` +
      this.fields(type) + '\n' +
      '}';
  }

  scalar(type: GraphQLScalarType): string {
    return `scalar ${type.name}`;
  }

  schema(schema: GraphQLSchema): string {
    return this.filteredSchema(schema, n => !isSpecDirective(n), isDefinedType);
  }

  schemaDefinition(schema: GraphQLSchema): string {
    const operationTypes = [];

    const queryType = schema.getQueryType();
    if (queryType) {
      operationTypes.push(`  query: ${queryType.name}`);
    }

    const mutationType = schema.getMutationType();
    if (mutationType) {
      operationTypes.push(`  mutation: ${mutationType.name}`);
    }

    const subscriptionType = schema.getSubscriptionType();
    if (subscriptionType) {
      operationTypes.push(`  subscription: ${subscriptionType.name}`);
    }

    return `schema {\n${operationTypes.join('\n')}\n}`;
  }

  type(type: GraphQLType): string {

    if (type instanceof GraphQLScalarType) {
      return this.scalar(type);

    } else if (type instanceof GraphQLObjectType) {
      return this.object(type);

    } else if (type instanceof GraphQLInterfaceType) {
      return this.interfaces(type);

    } else if (type instanceof GraphQLUnionType) {
      return this.union(type);

    } else if (type instanceof GraphQLEnumType) {
      return this.enum(type);

    } else if (type instanceof GraphQLInputObjectType) {
      return this.inputObject(type);
    }

    return null;
  }

  union(type: GraphQLUnionType): string {
    return `union ${type.name} = ${type.getTypes().join(' | ')}`;
  }

  value(value: any, type: GraphQLType): string {
    return print(astFromValue(value, type);
  }
}
