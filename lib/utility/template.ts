import * as marked from 'marked';
import { Plugin } from './plugin';
import { PluginInterface, SchemaType, Directive } from '../interface';

export function createData(
    projectPackage: any,
    graphdocPackage: any,
    plugins: PluginInterface[],
    type?: SchemaType | Directive
) {

    const name = type && type.name;
    return Promise
        .all([
            Plugin.collectHeaders(plugins, name),
            Plugin.collectNavigations(plugins, name),
            Plugin.collectDocuments(plugins, name),
        ])
        .then(([headers, navigations, documents]) => {

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