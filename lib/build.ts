import { GraphQLSchema } from 'graphql';
import { resolve } from 'path';
import { render } from 'mustache';
import { readTemplate, writeFile, createBuildFolder } from './fs';
import { DataTranslator } from './data';
import { serializeFunction, parseLiteralFunction, parseValueFunction } from './section/code';
import { printTypeFunction } from './section/print';

let pack = require('../package.json');

type BuildOptions = {
    schema: GraphQLSchema;
    templateDir: string;
    buildDir: string;
    baseUrl?: string;
    icon?: string;
    documentSections?: sectionCreator[];
};

type Partials = {
    index: string,
    main: string,
    nav: string,
}

let defaulIcon = (baseUrl: string) => '<header class="slds-theme--alt-inverse slds-text-heading--medium slds-p-around--large">'
    + '<a href="' + baseUrl + '" >Schema types</a>'
    + '</header>';

export function build(options: BuildOptions) {

    let schema = options.schema;
    let baseUrl = baseUrl || './';
    let buildDir = resolve(options.buildDir);
    let templateDir = resolve(options.templateDir);
    let icon = options.icon || defaulIcon(baseUrl);
    let documentSections = options.documentSections || [];
    let sectionCreators = [
        printTypeFunction,
        serializeFunction,
        parseValueFunction,
        parseLiteralFunction,
    ];

    let dataTranslator = new DataTranslator(schema, sectionCreators, baseUrl);

    return createBuildFolder(buildDir, templateDir)
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
                footer: templates[3],
                icon
            };
        })
        .then((partials: Partials) => {

            let data = Object.assign(
                {},
                pack,
                dataTranslator.getNavigationData() ,
                dataTranslator.getMainData(schema)
            );

            return writeFile(
                resolve(buildDir, 'index.html')
                render(partials.index, data, partials)
            ).then(() => partials);
        })
        .then((partials: Partials) => {

            let types = schema.getTypeMap();

            let writing = Object
                .keys(types)
                .map(name => {

                    let type = types[name];
                    let path = resolve(buildDir, dataTranslator.getUrl(type));
                    let data = Object.assign(
                        {},
                        pack,
                        dataTranslator.getNavigationData(type),
                        dataTranslator.getMainData(type)
                    );

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