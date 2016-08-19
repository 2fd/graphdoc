import {StarWarsSchema} from './schema';
import {build} from '../lib/build';

build({
    schema: StarWarsSchema,
    templateDir: './template/slds',
    buildDir: './build'
});