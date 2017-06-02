import * as marked from 'marked';
import * as slug from 'slug';
import { Plugin } from './plugin';
import {
    PluginInterface,
    TypeRef,
    NavigationSectionInterface,
    DocumentSectionInterface
} from '../interface';

 export function slugTemplate() {
    return function(text, render) {
        return slug(render(text)).toLowerCase();
    };
}

export type TemplateData = {
    title: string,
    type?: TypeRef,
    description: string,
    headers: string,
    navigations: NavigationSectionInterface[],
    documents: DocumentSectionInterface[],
    projectPackage: any,
    graphdocPackage: any,
    slug: typeof slugTemplate,
};

type Headers = string[];
type Navs = NavigationSectionInterface[];
type Docs = DocumentSectionInterface[];

export async function createData(
    projectPackage: any,
    graphdocPackage: any,
    plugins: PluginInterface[],
    type?: TypeRef
): Promise<TemplateData> {

    const name = type && type.name;
    const [headers, navigations, documents]: [Headers, Navs, Docs] = await Promise.all([
        Plugin.collectHeaders(plugins, name),
        Plugin.collectNavigations(plugins, name),
        Plugin.collectDocuments(plugins, name),
    ]);

    const title = name ||
        projectPackage.graphdoc.title ||
        'Graphql schema documentation';

    const description = type ?
        marked(type.description || '') :
        projectPackage.description;

    return {
        title,
        type,
        description,
        headers: headers.join(''),
        navigations,
        documents,
        projectPackage,
        graphdocPackage,
        slug: slugTemplate
    };
}