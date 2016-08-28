import { SchemaType, TypeRef, Directive } from './interface';

export const query = `query IntrospectionQuery {
    __schema {
      queryType { name description kind}
      mutationType { name description kind }
      subscriptionType { name description kind }
      types {
        name
        kind
        description
        ...FullType
      }
      directives {
        name
        description
        locations
        args {
          ...InputValue
        }
      }
    }
  }

  fragment FullType on __Type {
    fields(includeDeprecated: true) {
      name
      description
      args {
        ...InputValue
      }
      type {
        ...TypeRef
      }
      isDeprecated
      deprecationReason
    }
    inputFields {
      ...InputValue
    }
    interfaces {
      ...TypeRef
    }
    enumValues(includeDeprecated: true) {
      name
      description
      isDeprecated
      deprecationReason
    }
    possibleTypes {
      ...TypeRef
    }
  }

  fragment InputValue on __InputValue {
    name
    description
    type { ...TypeRef }
    defaultValue
  }

  fragment TypeRef on __Type {
    kind
    name
    description
    ofType {
      kind
      name
      description
      ofType {
        kind
        name
        description
        ofType {
          kind
          name
          description
          ofType {
            kind
            name
            description
            ofType {
              kind
              name
              description
              ofType {
                kind
                name
                description
                ofType {
                  kind
                  name
                  description
                }
              }
            }
          }
        }
      }
    }
  }
`;

function isSpecDirective(directive: Directive): boolean {
  return (
    directive.name === 'skip' ||
    directive.name === 'include' ||
    directive.name === 'deprecated'
  );
}

function isSpecType(type: SchemaType): boolean {
  return type.name.indexOf('__') === 0;
}

function isSpecScalar(type: SchemaType): boolean {
  return (
    type.name === 'String' ||
    type.name === 'Boolean' ||
    type.name === 'Int' ||
    type.name === 'Float' ||
    type.name === 'ID'
  );
}

function isDefinedType(type: SchemaType): boolean {
  return !isSpecType(type) && !isSpecScalar(type);
}
