import * as marked from 'marked';
import { PluginInterface, SchemaType, Directive } from '../interface';

export function createData(projectPackage: any, graphdocPackage: any, plugins: PluginInterface[], type?: SchemaType | Directive): any {


    function reduceHeaders(items: any[], plugin: PluginInterface) {
        return items.concat(plugin.getHeaders(type && type.name));
    }

    function reduceNavigations(items: any[], plugin: PluginInterface) {
        return items.concat(plugin.getNavigations(type && type.name));
    }

    function reduceDocuments(items: any[], plugin: PluginInterface) {
        return items.concat(plugin.getDocuments(type && type.name));
    }

    return Object.assign(
        {},
        projectPackage,
        {
            title: (type && type.name) || projectPackage.graphdoc.title || 'Graphql schema documentation',
            description: type ? marked(type.description || '') : projectPackage.description,
            graphdoc: Object.assign({}, graphdocPackage, projectPackage.graphdoc),
            headers: plugins.reduce(reduceHeaders, []),
            navs: plugins.reduce(reduceNavigations, []),
            sections: plugins.reduce(reduceDocuments, []),
        }
    );

}