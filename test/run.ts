import {build} from '../lib/build';

build({
    schema: require('./schema.json').data.__schema,
    templateDir: './template/slds',
    buildDir: './build'
});