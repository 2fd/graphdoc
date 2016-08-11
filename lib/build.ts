import {resolve} from 'path';
import {render} from 'mustache';
import {readTemplate, writeFile, createBuildFolder} from './fs';
import {creteNavigationData} from './data';


createBuildFolder(resolve('./build'), resolve('./template/slds'))
    .catch((err) => console.log(err));

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

//writeFileSync(resolve('./build/index.html'), render(template, data, {nav, main, icon}));