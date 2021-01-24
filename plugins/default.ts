import {
  DocumentSectionInterface,
  NavigationSectionInterface,
  PluginInterface,
  Schema,
} from "../lib/interface";
import { Plugin } from "../lib/utility";
import RequireByPlugin from "./document.require-by";
import DocumentSchema from "./document.schema";
import NavigationDirective from "./navigation.directive";
import NavigationEnum from "./navigation.enum";
import NavigationInput from "./navigation.input";
import NavigationInterfaces from "./navigation.interface";
import NavigationObject from "./navigation.object";
import NavigationScalar from "./navigation.scalar";
import NavigationSchema from "./navigation.schema";
import NavigationUnion from "./navigation.union";

export default class NavigationDirectives
  extends Plugin
  implements PluginInterface {
  plugins: PluginInterface[];

  constructor(document: Schema, graphdocPackage: any, projectPackage: any) {
    super(document, graphdocPackage, projectPackage);
    this.plugins = [
      new NavigationSchema(document, graphdocPackage, projectPackage),
      new NavigationScalar(document, graphdocPackage, projectPackage),
      new NavigationEnum(document, graphdocPackage, projectPackage),
      new NavigationInterfaces(document, graphdocPackage, projectPackage),
      new NavigationUnion(document, graphdocPackage, projectPackage),
      new NavigationObject(document, graphdocPackage, projectPackage),
      new NavigationInput(document, graphdocPackage, projectPackage),
      new NavigationDirective(document, graphdocPackage, projectPackage),
      new DocumentSchema(document, graphdocPackage, projectPackage),
      new RequireByPlugin(document, graphdocPackage, projectPackage),
    ];
  }

  getNavigations(buildForType?: string): Promise<NavigationSectionInterface[]> {
    return Plugin.collectNavigations(this.plugins, buildForType);
  }

  getDocuments(buildForType?: string): Promise<DocumentSectionInterface[]> {
    return Plugin.collectDocuments(this.plugins, buildForType);
  }

  getHeaders(buildForType?: string): Promise<string[]> {
    return Plugin.collectHeaders(this.plugins, buildForType);
  }

  getAssets(): Promise<string[]> {
    return Plugin.collectAssets(this.plugins);
  }
}
