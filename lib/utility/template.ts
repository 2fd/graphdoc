import * as marked from 'marked';
import { Plugin } from './plugin';
import {
    PluginInterface,
    TypeRef,
    NavigationSectionInterface,
    DocumentSectionInterface
} from '../interface';

export type TemplateData = {
    title: string,
    description: string,
    headers: string,
    navigations: NavigationSectionInterface[],
    documents: DocumentSectionInterface[],
    projectPackage: any,
    graphdocPackage: any,
}

export function createData(
    projectPackage: any,
    graphdocPackage: any,
    plugins: PluginInterface[],
    type?: TypeRef
): PromiseLike<TemplateData> {

    const name = type && type.name;
    type Resolve = [string[], NavigationSectionInterface[], DocumentSectionInterface[]];
    return Promise
        .all([
            Plugin.collectHeaders(plugins, name),
            Plugin.collectNavigations(plugins, name),
            Plugin.collectDocuments(plugins, name),
        ])
        .then(([headers, navigations, documents]: Resolve) => {

            const title = name ||
                projectPackage.graphdoc.title ||
                'Graphql schema documentation';

            const description = type ?
                marked(type.description || '') :
                projectPackage.description;

            return {
                title,
                description,
                headers: headers.join(''),
                navigations,
                documents,
                projectPackage,
                graphdocPackage,
            };
        });
}