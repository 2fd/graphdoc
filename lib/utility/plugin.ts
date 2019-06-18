import url from "url";
import {
  DeepTypeRef,
  Description,
  Directive,
  DocumentSectionInterface,
  NavigationItemInterface,
  NavigationSectionInterface,
  PluginInterface,
  Schema,
  SchemaType,
  TypeRef
} from "../interface";
import { getFilenameOf } from "./introspection";

/**
 * Plugin Base implementation
 */
export abstract class Plugin {
  static collect<T>(collection: T[][]): T[] {
    let result: T[] = [];

    collection.forEach(item => {
      if (Array.isArray(item)) {
        result = result.concat(item);
      }
    });

    return result;
  }

  static async collectNavigations(
    plugins: PluginInterface[],
    buildForType?: string
  ): Promise<NavigationSectionInterface[]> {
    const navigationCollection = await Promise.all<
      NavigationSectionInterface[]
    >(
      plugins.map(plugin => {
        return plugin.getNavigations
          ? plugin.getNavigations(buildForType)
          : (null as any);
      })
    );

    return Plugin.collect(navigationCollection);
  }

  static async collectDocuments(
    plugins: PluginInterface[],
    buildForType?: string
  ): Promise<DocumentSectionInterface[]> {
    const navigationCollection = await Promise.all<DocumentSectionInterface[]>(
      plugins.map(plugin => {
        return plugin.getDocuments
          ? plugin.getDocuments(buildForType)
          : (null as any);
      })
    );

    return Plugin.collect(navigationCollection);
  }

  static async collectHeaders(
    plugins: PluginInterface[],
    buildForType?: string
  ): Promise<string[]> {
    const headerCollection = await Promise.all<string[]>(
      plugins.map(plugin => {
        return plugin.getHeaders
          ? plugin.getHeaders(buildForType)
          : (null as any);
      })
    );

    return Plugin.collect(headerCollection);
  }

  static async collectAssets(plugins: PluginInterface[]): Promise<string[]> {
    const assetCollection = await Promise.all<string[]>(
      plugins.map(plugin => {
        return plugin.getAssets ? plugin.getAssets() : (null as any);
      })
    );

    return Plugin.collect(assetCollection);
  }

  queryType: SchemaType | null = null;

  mutationType: SchemaType | null = null;

  subscriptionType: SchemaType | null = null;

  typeMap: { [name: string]: SchemaType } = {};

  directiveMap: { [name: string]: Directive } = {};

  // getNavigations?: (buildForType?: string) => NavigationSectionInterface[] | PromiseLike<NavigationSectionInterface[]>;
  // getDocuments?: (buildForType?: string) => DocumentSectionInterface[] | PromiseLike<DocumentSectionInterface[]>;
  // getHeaders?: (buildForType?: string) => string[] | PromiseLike<string[]>;
  // getAssets?: () => string[] | PromiseLike<string[]>;

  constructor(
    public document: Schema,
    public projectPackage: any,
    public graphdocPackage: any
  ) {
    this.document.types = this.document.types
      ? this.document.types.sort(sortTypes)
      : [];

    this.document.directives = this.document.directives
      ? this.document.directives.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        )
      : [];

    this.document.types.forEach(type => {
      this.typeMap[type.name || ""] = type;
    });

    this.document.directives.forEach(directive => {
      this.directiveMap[directive.name || ""] = directive;
    });

    if (document.queryType) {
      this.queryType = this.typeMap[document.queryType.name || ""];
    }

    if (document.mutationType) {
      this.mutationType = this.typeMap[document.mutationType.name || ""];
    }

    if (document.subscriptionType) {
      this.subscriptionType = this.typeMap[
        document.subscriptionType.name || ""
      ];
    }
  }

  url(type: DeepTypeRef | TypeRef | Description): string {
    return url.resolve(
      this.projectPackage.graphdoc.baseUrl,
      getFilenameOf(type)
    );
  }
}

/**
 * NavigationSectionInterface short implementation
 */
// tslint:disable-next-line:max-classes-per-file
export class NavigationSection implements NavigationSectionInterface {
  constructor(public title: string, public items: NavigationItem[] = []) {}
}

/**
 * NavigationItemInterface short implementation
 */
// tslint:disable-next-line:max-classes-per-file
export class NavigationItem implements NavigationItemInterface {
  constructor(
    public text: string,
    public href: string,
    public isActive: boolean
  ) {}
}

/**
 * DocumentSectionInterface short implementation
 */
// tslint:disable-next-line:max-classes-per-file
export class DocumentSection implements DocumentSectionInterface {
  constructor(public title: string, public description: string) {}
}

function priorityType(type: SchemaType): number {
  const name = type.name || "";
  if (name[0] === "_" && name[1] === "_") {
    return 2;
  } else if (name[0] === "_") {
    return 1;
  } else {
    return 0;
  }
}

export function sortTypes(a: SchemaType, b: SchemaType): number {
  const priorityA = priorityType(a);
  const priorityB = priorityType(b);

  if (priorityA === priorityB) {
    return (a.name || "").localeCompare(b.name || "");
  } else {
    return priorityA - priorityB;
  }
}
