import { GraphQLSchema } from 'graphql';
import { resolve } from 'path';
import { render } from 'mustache';
import { readTemplate, writeFile, createBuildFolder } from './fs';
import { createNavigationData, createMainData, sectionCreator } from './data';

let pack = require('../package.json');



type BuildOptions = {
    schema: GraphQLSchema;
    templateDir: string;
    buildDir: string;
    icon?: string;
    documentSections?: sectionCreator[];
};

type Partials = {
    index: string,
    main: string,
    nav: string,
}

let defaulIcon = '<header class="slds-theme--alt-inverse slds-text-heading--medium slds-p-around--large">'
    + '<a href="./" >Schema types</a>'
    + '</header>';

export function build(options: BuildOptions) {

    let schema = options.schema;
    let buildDir = resolve(options.buildDir);
    let templateDir = resolve(options.templateDir);
    let icon = options.icon || defaulIcon;
    let documentSections = options.documentSections || [];

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
                createNavigationData(schema),
                createMainData(schema)
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
                    let path = resolve(buildDir, name.toLowerCase() + '.html');
                    let data = Object.assign(
                        {},
                        pack,
                        createNavigationData(schema, type),
                        createMainData(type)
                    );

                    return writeFile(
                        path
                        render(partials.index, data, partials)
                    ).then(() => path);
                });

            return Promise.all(writing);
        })
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
}



/*let data = {
    title: 'Grapql Title',
    navs: [],
    description: '',
    sections: [
        { title: 'Schema', code: '<pre>    scaler Int<pre>'}
    ]
};
*/
/*let map = schema.getTypeMap();*/
/*
data.navs.push({
    title: 'Others',
    items: Object.keys(map)
    .filter((name) => name[0] !== '_' && name[1] !== '_')
    .map((name) => {
        return {
            text: name,
            href: '#'
        };
    })
});*/

/*data.title = map.Int.name;
data.description = map.Int.description;
data.sections.push({
    title: 'serialize',
    code: '<pre>  ' + map.Int.serialize.toString() + '</pre>'
});*/

/*
Promise.all([
    readTemplate(resolve('./template/slds/index.mustache'),  'utf8'),
    readTemplate(resolve('./template/slds/nav.mustache'),    'utf8'),
    readTemplate(resolve('./template/slds/object.mustache'), 'utf8'),
    readTemplate(resolve('./template/slds/scalar.mustache'), 'utf8'),
    readTemplate(resolve('./template/slds/enum.mustache'),   'utf8'),
])
    .then((templates) => {
        console.log(templates);
        console.log(render(templates[1], creteNavigationData(schema)));
    })
    .catch((err) => console.log(err));*/