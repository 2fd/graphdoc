import { DeepTypeRef, Description, TypeRef } from "../interface";

export const LIST = "LIST";
export const NON_NULL = "NON_NULL";
export const SCALAR = "SCALAR";
export const OBJECT = "OBJECT";
export const INTERFACE = "INTERFACE";
export const UNION = "UNION";
export const ENUM = "ENUM";
export const INPUT_OBJECT = "INPUT_OBJECT";

export function getTypeOf(t: DeepTypeRef | TypeRef): TypeRef {
  if (t.kind === LIST || t.kind === NON_NULL) {
    return getTypeOf((t as DeepTypeRef).ofType);
  }

  return t as TypeRef;
}

export function getFilenameOf(
  type: DeepTypeRef | TypeRef | Description
): string {
  const name =
    type.kind === LIST || type.kind === NON_NULL
      ? getTypeOf(type as DeepTypeRef).name.toLowerCase()
      : (type as Description).name.toLowerCase();

  if (name[0] === "_" && name[1] === "_") {
    return name.slice(2) + ".spec.html";
  }

  return name + ".doc.html";
}

const fullTypeFragment = `
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
  }`;

const inputValueFragment = `
  fragment InputValue on __InputValue {
    name
    description
    type { ...TypeRef }
    defaultValue
  }`;

const typeRefFragment = `
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
  }`;

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

  ${fullTypeFragment}
  ${inputValueFragment}
  ${typeRefFragment}
`;

export const queryRoot = `query IntrospectionQuery {
    __schema {
      queryType { name description kind}
      mutationType { name description kind }
      subscriptionType { name description kind }
    }
  }
`;

export const queryTypes = `query IntrospectionQuery {
    __schema {
      types {
        name
        kind
        description
        ...FullType
      }
    }
  }

  ${fullTypeFragment}
  ${inputValueFragment}
  ${typeRefFragment}
`;

export const queryDirectives = `query IntrospectionQuery {
    __schema {
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

  ${inputValueFragment}
  ${typeRefFragment}
`;
