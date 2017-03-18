import {writeFileSync} from 'fs';
import {printSchema} from 'graphql';
import {StarWarsSchema} from './schema';
writeFileSync(__dirname + '/starwars.graphql', printSchema(StarWarsSchema));