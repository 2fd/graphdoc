export interface PluginConstructor {
    new (
        document: Schema,
        graphdocPackage: any,
        projectPackage: any
    ): PluginInterface;
}

export interface PluginInterface {
    getNavigations?: (buildForType?: string) => NavigationSectionInterface[] | PromiseLike<NavigationSectionInterface[]>;
    getDocuments?: (buildForType?: string) => DocumentSectionInterface[] | PromiseLike<DocumentSectionInterface[]>;
    getHeaders?: (buildForType?: string) => string[] | PromiseLike<string[]>;
    getAssets?: () => string[] | Promise<string[]>;
}

export interface PluginImplementedInterface {
    document: Schema;
    url: refToUrl;
    queryType: SchemaType | null;
    mutationType: SchemaType | null;
    subscriptionType: SchemaType | null;
}

export interface NavigationSectionInterface {
    title: string;
    items: NavigationItemInterface[];
}

export interface NavigationItemInterface {
    href: string;
    text: string;
    isActive: boolean;
}

export interface DocumentSectionInterface {
    title: string;
    description: string;
}

/**
 * Convert TypeRef
 */
type refToUrl = (typeName: TypeRef) => string;

/**
 * Introspection types
 */
type Introspection = {
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
    kind?: string,
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
    defaultValue: string | number | null,
}

type Field = Description & Deprecation & {
    args: InputValue[],
    type: TypeRef
}

type TypeRef = Description & {
    ofType?: TypeRef
}