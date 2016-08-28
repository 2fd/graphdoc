import * as marked from 'marked';
import { resolve } from 'path';
import { render } from 'mustache';
import { getTypeOf } from './utility';
import { readTemplate, writeFile, createBuildFolder } from './fs';
import {
    PluginInterface,
    DocumentSectionInterface,
    NavigationSectionInterface,
    Schema,
    TypeRef,
} from './interface';

let pack = require('../package.json');

type BuildOptions = {
    schema: Schema;
    templateDir: string;
    buildDir: string;
    baseUrl?: string;
    icon?: string;
};

type Partials = {
    index: string,
    main: string,
    nav: string,
    footer: string,
}

export function build(options: BuildOptions) {

    let schema = options.schema;
    let baseUrl = options.baseUrl || './';
    let buildDir = resolve(options.buildDir);
    let templateDir = resolve(options.templateDir);
    let resolveUrl = (t: TypeRef) => {

        let type: TypeRef = getTypeOf(t);
        let name = (type.name as string).toLowerCase();

        if (name[0] === '_' && name[1] === '_')
            return baseUrl + name.slice(2) + '.spec.html';

        return baseUrl + name + '.doc.html';
    };

    let plugins: PluginInterface[] = [
        require('./plugins/navigation.schema').default,
        require('./plugins/navigation.scalar').default,
        require('./plugins/navigation.enum').default,
        require('./plugins/navigation.interface').default,
        require('./plugins/navigation.union').default,
        require('./plugins/navigation.object').default,
        require('./plugins/navigation.input').default,
        require('./plugins/navigation.directive').default,
        require('./plugins/document.schema').default,
    ].map(Plugin => new Plugin(schema, resolveUrl));

    let pluginsAssets: string[] = plugins.reduce(
        (assets: string[], plugin: PluginInterface) => assets.concat(plugin.getAssets()),
        []
    );

    return createBuildFolder(buildDir, templateDir, pluginsAssets)
        .then(() => Promise.all([
            readTemplate(resolve(templateDir, 'index.mustache'), 'utf8'),
            readTemplate(resolve(templateDir, 'main.mustache'), 'utf8'),
            readTemplate(resolve(templateDir, 'nav.mustache'), 'utf8'),
            readTemplate(resolve(templateDir, 'footer.mustache'), 'utf8'),
        ]))
        .then((templates: string[]) => {
            return {
                index: templates[0],
                main: templates[1],
                nav: templates[2],
                footer: templates[3]
            };
        })
        .then((partials: Partials) => {

            let data = {
                title: 'Graphql schema documentation',
                description: pack.description,
                version: pack.version,
                homepage: pack.homepage,
                baseUrl: baseUrl,
                headers: plugins.reduce(
                    (items: string[], plugin: PluginInterface) => items
                        .concat(plugin.getHeaders()),
                    []
                ),
                navs: plugins.reduce(
                    (items: NavigationSectionInterface[], plugin: PluginInterface) => items
                        .concat(plugin.getNavigations()),
                    []
                ),
                sections: plugins.reduce(
                    (items: DocumentSectionInterface[], plugin: PluginInterface) => items
                        .concat(plugin.getDocuments()),
                    []
                )
            };

            return writeFile(
                resolve(buildDir, 'index.html'),
                render(partials.index, data, partials)
            ).then(() => partials);
        })
        .then((partials: Partials) => {

            let writing = []
                .concat(schema.types)
                .concat(schema.directives)
                .map(type => {

                    let path = resolve(buildDir, resolveUrl(type));
                    let data = {
                        title: type.name,
                        description: marked(type.description || ''),
                        version: pack.version,
                        homepage: pack.homepage,
                        baseUrl: baseUrl,
                        headers: plugins.reduce(
                            (items: string[], plugin: PluginInterface) => items
                                .concat(plugin.getHeaders(type.name)),
                            []
                        ),
                        navs: plugins.reduce(
                            (items: NavigationSectionInterface[], plugin: PluginInterface) => items
                                .concat(plugin.getNavigations(type.name)),
                            []
                        ),
                        sections: plugins.reduce(
                            (items: DocumentSectionInterface[], plugin: PluginInterface) => items
                                .concat(plugin.getDocuments(type.name)),
                            []
                        )
                    };

                    return writeFile(
                        path,
                        render(partials.index, data, partials)
                    ).then(() => path);
                });

            return Promise.all(writing);
        })
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
}