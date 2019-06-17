import marked from "marked";
import slug from "slug";
import {
  DocumentSectionInterface,
  NavigationSectionInterface,
  PluginInterface,
  TypeRef
} from "../interface";
import { Plugin } from "./plugin";

export function slugTemplate() {
  return (text, render) => slug(render(text)).toLowerCase();
}

export interface ITemplateData {
  title: string;
  type?: TypeRef;
  description: string;
  headers: string;
  navigations: NavigationSectionInterface[];
  documents: DocumentSectionInterface[];
  projectPackage: any;
  graphdocPackage: any;
  slug: typeof slugTemplate;
}

type Headers = string[];
type Navs = NavigationSectionInterface[];
type Docs = DocumentSectionInterface[];

export async function createData(
  projectPackage: any,
  graphdocPackage: any,
  plugins: PluginInterface[],
  type?: TypeRef
): Promise<ITemplateData> {
  const name = (type && type.name) || "";
  const [headers, navigations, documents]: [
    Headers,
    Navs,
    Docs
  ] = await Promise.all([
    Plugin.collectHeaders(plugins, name),
    Plugin.collectNavigations(plugins, name),
    Plugin.collectDocuments(plugins, name)
  ]);

  const title =
    name || projectPackage.graphdoc.title || "Graphql schema documentation";

  const description = type
    ? marked(type.description || "")
    : projectPackage.description;

  return {
    title,
    type,
    description,
    headers: headers.join(""),
    navigations,
    documents,
    projectPackage,
    graphdocPackage,
    slug: slugTemplate
  };
}
