import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import * as querystring from 'querystring';
import * as http from 'http';
import * as https from 'https';
import { render } from 'mustache';
import { resolveUrlFor, query } from './utility';
import { createData } from './utility/template';
import { readFile, writeFile, createBuildDirectory, resolve, removeBuildDirectory } from './utility/fs';
import {
    PluginInterface,
    Schema,
    SchemaType,
    Directive,
    Retrospection,
} from './interface';
import {
    Command,
    NoParams,
    ValueFlag,
    ListValueFlag,
    BooleanFlag,
    InputInterface,
    OutputInterface
} from '@2fd/command';

const pack = require(path.resolve(__dirname, '../package.json'));
const GREY = 'color:grey';
const GREEN = 'color:green';

export type Params = {};

export type Flags = {
    configFile: string,
    endpoint: string,
    heades: string[],
    queries: string[],
    schemaFile: string,
    plugins: string[],
    template: string,
    output: string,
    force: boolean,
    verbose: boolean,
    version: boolean,
};

export type Partials = {
    index: string,
    main: string,
    nav: string,
    footer: string,
}


export class GraphQLDocumentor extends Command<Flags, Params> {

    description = pack.description + ' v' + pack.version;

    params = new NoParams();

    flags = [
        new ValueFlag('configFile', ['-c', '--config'], 'Configuration file [./package.json].', String, './package.json'),
        new ValueFlag('endpoint', ['-e', '--endpoint'], 'Graphql http endpoint ["https://domain.com/graphql"].'),
        new ListValueFlag('heades', ['-x', '--header'], 'HTTP header for request (use with --endpoint). ["Authorization=Token cb8795e7"].'),
        new ListValueFlag('queries', ['-q', '--query'], 'HTTP querystring for request (use with --endpoint) ["token=cb8795e7"].'),
        new ValueFlag('schemaFile', ['-s', '--schema'], 'Graphql Schema file ["./schema.json"].'),
        new ListValueFlag('plugins', ['-p', '--plugin'], 'Use plugins [default=graphdoc/plugins/default].'),
        new ValueFlag('template', ['-t', '--template'], 'Use template [default=graphdoc/template/slds].', String, 'graphdoc/template/slds'),
        new ValueFlag('output', ['-o', '--output'], 'Output directory.'),
        new ValueFlag('baseUrl', ['-b', '--base-url'], 'Base url for templates.', String, './'),
        new BooleanFlag('force', ['-f', '--force'], 'Delete outputDirectory if exists.'),
        new BooleanFlag('verbose', ['-v', '--verbose'], 'Output more information.'),
        new BooleanFlag('version', ['-V', '--version'], 'Show graphdoc version.'),
    ];

    action(input: InputInterface<Flags, Params>, output: OutputInterface) {

        const graphdocPackage = pack;

        if (input.flags.version)
            return output.log('graphdoc v%s', graphdocPackage.version);

        const projectPackage = this.getProjectPackage(input, output);
        const config: any & Flags = projectPackage.graphdoc;
        const resolveUrl = resolveUrlFor(projectPackage.graphdoc.baseUrl);
        let schema: Schema = {} as any;
        let plugins: PluginInterface[] = [];

        function error(err: Error, output: OutputInterface) {

            output.error('');
            output.error('%c%s', 'color:red', err.message || err);
            if (config.verbose)
                output.error('%c%s', 'color:grey', err.stack || '    NO STACK');

            output.error('');
        }

        if (!config.output)
            return error(new Error('Output (--output, -o) is require'), output);

        this.getSchema(config, output)
            .then((result) => result.data.__schema)
            // Create plugins
            .then((result: Schema) => {

                schema = result;
                plugins = projectPackage.graphdoc.plugins
                    .map(path => {
                        if (config.verbose)
                            output.log('%c - plugin: %c%s', GREEN, GREY, path);

                        return resolve(path);
                    })
                    .map(path => require(path).default)
                    .map(Plugin => new Plugin(
                        result,
                        resolveUrl,
                        graphdocPackage,
                        projectPackage
                    ));
            })

            // Clear build folter
            .then(() => {

                try {
                    // throw Error if path not exits
                    fs.statSync(config.output);

                    if (!config.force) {
                        return Promise.reject(new Error(config.output + ' already exists (delete it or use the --force flag)'));

                    } else {
                        if (config.verbose) {
                            output.log('%c - deleting: %c%s', GREEN, GREY, config.output);
                        }

                        return removeBuildDirectory(config.output)
                            .then(() => config.output);
                    }

                } catch (err) {

                    if (err.code !== 'ENOENT')
                        return Promise.reject(err);
                }

                return config.output;
            })

            // Create build folder
            .then(() => {

                const assets: string[] = Array.prototype.concat.apply(
                    [],
                    plugins.map(plugin => plugin.getAssets()) as string[][]
                );

                if (config.verbose) {
                    output.log('%c - creating: %c%s', GREEN, GREY, config.output);
                }

                return createBuildDirectory(config.output, config.template, assets);
            })

            // readFile
            .then(() => {
                const files = [
                    'index.mustache',
                    'main.mustache',
                    'nav.mustache',
                    'footer.mustache',
                ]
                    .map(file => path.resolve(config.template, file))
                    .map(filepath => {
                        if (config.verbose)
                            output.log('%c - reading: %c%s', GREEN, GREY, filepath);

                        return readFile(filepath, 'utf8');
                    });

                return Promise.all(files);
            })
            .then((templates: string[]) => {
                return {
                    index: templates[0],
                    main: templates[1],
                    nav: templates[2],
                    footer: templates[3]
                };
            })
            .then((partials: Partials) => {

                const filepath = path.resolve(config.output, 'index.html');
                const data = createData(projectPackage, graphdocPackage, plugins);

                if (config.verbose)
                    output.log('%c - creating: %c%s', GREEN, GREY, filepath);

                return writeFile(filepath, render(partials.index, data, partials))
                    .then(() => partials);

            })
            .then((partials: Partials) => {

                let writing = ([] as Array<SchemaType | Directive>)
                    .concat(schema.types)
                    .concat(schema.directives)
                    .map(type => {

                        const filepath = path.resolve(config.output, resolveUrl(type));
                        const data = createData(projectPackage, graphdocPackage, plugins, type);

                        if (config.verbose)
                            output.log('%c - creating: %c%s', GREEN, GREY, filepath);

                        return writeFile(filepath, render(partials.index, data, partials))
                            .then(() => filepath);
                    });

                return Promise.all(writing);
            })
            .then(result => {
                output.log('%c[OK] created %d files', GREEN, result.length);
            })
            .catch((err: Error) => error(err, output));
    }

    getProjectPackage(input: InputInterface<Flags, Params>, output: OutputInterface) {

        let projectPackage: any & {
            graphdoc: Flags,
        };

        try {
            projectPackage = require(path.resolve(input.flags.configFile));
        } catch (err) {
            projectPackage = {};
        }

        projectPackage.graphdoc = Object.assign({}, projectPackage.graphdoc, input.flags);

        projectPackage.graphdoc.plugins = ['graphdoc/plugins/default']
            .concat(projectPackage.graphdoc.plugins);

        projectPackage.graphdoc.template = resolve(projectPackage.graphdoc.template);
        projectPackage.graphdoc.output = path.resolve(projectPackage.graphdoc.output);
        projectPackage.graphdoc.version = pack.version;

        return projectPackage;
    }

    getSchema(config: Flags, output: OutputInterface): Promise<Retrospection> {

        if (config.schemaFile) {

            if (config.verbose) {
                output.log('%c - loading schema: %c%s', 'color:green', 'color:grey', config.schemaFile);
            }

            return new Promise((resolve, reject) => {
                try {
                    const schemapath = path.resolve(config.schemaFile);
                    const schema: Schema = require(schemapath);
                    resolve(schema);
                } catch (err) {
                    reject(err);
                }
            });

        } else if (config.endpoint) {

            let options = url.parse(config.endpoint) as any;

            options.headers = config.heades.reduce((result: any, header: string) => {
                const [name, value] = header.split('=', 2);
                result[name] = value;
                return result;
            }, {});

            options.path = options.path + '?' + querystring.stringify(
                config.queries.reduce((result: any, query: string) => {
                    const [name, value] = query.split('=', 2);
                    result[name] = value;
                    return result;
                }, { query })
            );

            const endpoint = url.format(options);

            if (config.verbose) {
                output.log('%c - loading schema: %c%s', 'color:green', 'color:grey', endpoint);
            }

            return new Promise((resolve, reject) => {
                const req = ((options.protocol === 'https:' ? https : http) as typeof https)
                    .request(options, (res) => {

                        if (res.statusCode >= 400)
                            return reject(new Error(
                                '[' + res.statusCode + '] ' + res.statusMessage + ' on ' + endpoint
                            ));

                        let schema = '';
                        res.setEncoding('utf8');

                        res.on('data', (chunk) => {
                            schema += chunk;
                        });

                        res.on('end', () => resolve(schema));
                    });

                req.on('error', reject);
                req.end();
            })
                .then((result: string) => JSON.parse(result));

        } else {
            return Promise.reject(
                new Error('Endpoint (--endpoint, -e) or Schema File (--schemma,-s) are require.')
            );
        }

    }
}
