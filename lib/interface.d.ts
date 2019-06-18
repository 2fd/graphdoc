/**
 * PluginConstructor
 */
export interface PluginConstructor {
  new (
    document: Schema,
    graphdocPackage: any,
    projectPackage: any
  ): PluginInterface;
}

/**
 * PluginInterface
 */
export interface PluginInterface {
  /**
   * Return  section elements that is going to be
   * inserted into the side navigation bar.
   *
   * @example plain javascript:
   * [
   *  {
   *      title: 'Schema',
   *      items: [
   *          {
   *              text: 'Query',
   *              href: './query.doc.html',
   *              isActive: false
   *          },
   *          // ...
   *  }
   *  // ...
   * ]
   *
   * @example with graphdoc utilities:
   * import { NavigationSection, NavigationItem } from 'graphdoc/lib/utility';
   *
   * [
   *  new NavigationSection('Schema', [
   *      new NavigationItem('Query', ./query.doc.html', false)
   *  ]),
   *  // ...
   * ]
   *
   * @param {string} [buildForType] -
   *  the name of the element for which the navigation section is being generated,
   *  if it is `undefined it means that the index of documentation is being generated
   */
  getNavigations?: (
    buildForType?: string
  ) => NavigationSectionInterface[] | PromiseLike<NavigationSectionInterface[]>;

  /**
   * Return  section elements that is going to be
   * inserted into the main section.
   *
   * @example plain javascript:
   * [
   *  {
   *      title: 'GraphQL Schema definition',
   *      description: 'HTML'
   *  },
   *  // ...
   * ]
   *
   * @example with graphdoc utilities:
   * import { DocumentSection } from 'graphdoc/lib/utility';
   *
   * [
   *  new DocumentSection('GraphQL Schema definition', 'HTML'),
   *  // ...
   * ]
   *
   * @param {string} [buildForType] -
   *  the name of the element for which the navigation section is being generated,
   *  if it is `undefined it means that the index of documentation is being generated
   *
   */
  getDocuments?: (
    buildForType?: string
  ) => DocumentSectionInterface[] | PromiseLike<DocumentSectionInterface[]>;

  /**
   * Return a list of html tags that is going to be
   * inserted into the head tag of each page.
   *
   * @example
   *  [
   *      '<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>',
   *      '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">',
   *  ]
   */
  getHeaders?: (buildForType?: string) => string[] | PromiseLike<string[]>;

  /**
   * Return a list of absolute path to files that is going to be
   * copied to the assets directory.
   *
   * Unlike the previous methods that are executed each time that a page generated,
   * this method is called a single time before starting to generate the documentation
   *
   * @example
   * [
   *  '/local/path/to/my-custom-style.css',
   *  '/local/path/to/my-custom-image.png',
   * ]
   *
   * there's will be copied to
   * /local/path/to/my-custom-style.css -> [OUTPUT_DIRECTORY]/assets/my-custom-style.css
   * /local/path/to/my-custom-image.png -> [OUTPUT_DIRECTORY]/assets/my-custom-image.png
   *
   * If you want to insert styles or scripts to the documentation,
   * you must combine this method with getHeaders
   *
   * @example
   * getAssets(): ['/local/path/to/my-custom-style.css']
   * getHeaders(): ['<link href="assets/my-custom-style.css" rel="stylesheet">']
   */
  getAssets?: () => string[] | PromiseLike<string[]>;
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
type GraphQLIntrospection = {
  data: {
    __schema: Schema;
  };
};
type ApolloIntrospection = {
  __schema: Schema;
};
type Introspection = GraphQLIntrospection | ApolloIntrospection;

type Schema = {
  queryType: Description | null;
  mutationType: Description | null;
  subscriptionType: Description | null;
  types: SchemaType[];
  directives: Directive[];
};

type Description = {
  name: string;
  description: string | null;
  kind?: string;
};

type Deprecation = {
  isDeprecated: boolean;
  deprecationReason: string | null;
};

type SchemaType = Description & {
  fields: Field[] | null;
  inputFields: InputValue[] | null;
  interfaces: TypeRef[] | null;
  enumValues: EnumValue[] | null;
  possibleTypes: TypeRef[] | null;
  kind: string;
};

type Directive = Description & {
  locations: string[];
  args: InputValue[];
};

type EnumValue = Description & Deprecation;

type InputValue = Description & {
  type: DeepTypeRef | TypeRef;
  defaultValue: string | number | null;
};

type Field = Description &
  Deprecation & {
    args: InputValue[];
    type: DeepTypeRef | TypeRef;
  };

type TypeRef = {
  name: string;
  description: string | null;
  kind: string;
  ofType: null;
};

type DeepTypeRef = {
  name: string | null;
  description: null;
  kind: "LIST" | "NON_NULL" | string;
  ofType: DeepTypeRef | TypeRef;
};

export interface SchemaLoader {
  (options: any): Promise<Schema>;
}
