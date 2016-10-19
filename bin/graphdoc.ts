import {ArgvInput, ColorConsoleOutput} from '@2fd/command';
import {GraphQLDocumentor} from '../lib/command';


(new GraphQLDocumentor)
    .handle(new ArgvInput(process.argv), new ColorConsoleOutput);