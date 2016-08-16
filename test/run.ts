import {schema} from './schema';
import {build} from '../lib/build';

build({
    schema,
    templateDir: './template/slds',
    buildDir: './build'
});