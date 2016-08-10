import {resolve} from 'path';
import {GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLString} from 'graphql';
import {render} from 'mustache';
import {readTemplate, writeFile} from './fs';
import {creteNavData} from './data';

export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: 'Query description',
        fields: {
            timestamp: {
                description: 'Unix timestamp',
                type: GraphQLInt,
                resolve: () => Date.now()
            },
            datetime: {
                description: 'ISO 8106',
                type: GraphQLString,
                resolve: () => (new Date).toJSON()
            }
        }
    })
});

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


Promise.all([
    readTemplate(resolve('./template/slds/index.mustache'),  'utf8'),
    readTemplate(resolve('./template/slds/nav.mustache'),    'utf8'),
    readTemplate(resolve('./template/slds/object.mustache'), 'utf8'),
    readTemplate(resolve('./template/slds/scalar.mustache'), 'utf8'),
    readTemplate(resolve('./template/slds/enum.mustache'),   'utf8'),
])
    .then((templates) => {
        console.log(templates);
        console.log(render(templates[1], creteNavData(schema)));
    })
    .catch((err) => console.log(err));

//writeFileSync(resolve('./build/index.html'), render(template, data, {nav, main, icon}));