/**
 *
 */
export interface NavigationPluginInterface {
    getSections(buildForType?: string): NavigationSectionInterface[];
}

export interface NavigationSectionInterface {
    title: string;
    items: NavigationItemInterface[];
};

export interface NavigationItemInterface {
    href: string;
    text: string;
    isActive: boolean;
}

/**
 *
 */
export interface DocumentPluginInterface {
    getSections(): DocumentSectionInterface[];
}

export interface DocumentSectionInterface {
    title: string;
    description: string;
};

/**
 * Convert TypeRef
 */
type nameToUrl = (typeName: string) => string;

/**
 * Introspection types
 */
type Retrospection = {
    data: {
        __schema: Schema
    }
}

type Schema = {
    queryType: Description,
    mutationType: Description,
    subscriptionType: Description,
    types: SchemaType[],
    directives: Directive[]
}

type Description = {
    name: string,
    description: string,
    kind: string,
}

type Deprecation = {
    isDeprecated: boolean,
    deprecationReason: string,
}

type SchemaType = Description & {
    fields: Field[]
    inputFields: InputValue[],
    interfaces: TypeRef[],
    enumValues: EnumValue[],
    possibleTypes: TypeRef[],
}

type Directive = Description & {
    locations: string[],
    args: InputValue[]
}

type EnumValue = Description & Deprecation;

type InputValue = Description & {
    type: TypeRef,
    defaultValue: string | number,
}

type Field = Description & Deprecation &  {
    args: InputValue[],
    type: TypeRef
}

type TypeRef = Description & {
    ofType?: TypeRef
}