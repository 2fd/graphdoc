import * as path from 'path';
import * as fs from 'fs';
import * as request from 'request';
import * as glob from 'glob';
import { render } from 'mustache';
import { query as introspectionQuery, Output, Plugin, getFilenameOf, createData } from './utility';
import { readFile, writeFile, createBuildDirectory, resolve, removeBuildDirectory } from './utility/fs';
import {
    PluginInterface,
    PluginConstructor,
    Schema,
    TypeRef,
    Introspection,
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

export type Params = {};

export type Flags = {
    configFile: string,
    endpoint: string,
    headers: string[],
    queries: string[],
    schemaFile: string,
    plugins: string[],
    template: string,
    data: any,
    output: string,
    force: boolean,
    verbose: boolean,
    version: boolean,
};

export type Partials = {
    [name: string]: string;
    index: string;
};

export type ProjectPackage = {
    graphdoc: Flags
}

export type Input = InputInterface<Flags, Params>;

export class GraphQLDocumentor extends Command<Flags, Params> {

    description = pack.description + ' v' + pack.version;

    params = new NoParams();

    flags = [
        new ValueFlag('configFile', ['-c', '--config'], 'Configuration file [./package.json].', String, './package.json'),
        new ValueFlag('endpoint', ['-e', '--endpoint'], 'Graphql http endpoint ["https://domain.com/graphql"].'),
        new ListValueFlag('headers', ['-x', '--header'], 'HTTP header for request (use with --endpoint). ["Authorization=Token cb8795e7"].'),
        new ListValueFlag('queries', ['-q', '--query'], 'HTTP querystring for request (use with --endpoint) ["token=cb8795e7"].'),
        new ValueFlag('schemaFile', ['-s', '--schema', '--schema-file'],
            'Graphql Schema file ["./schema.json"].'
        ),
        new ListValueFlag('plugins', ['-p', '--plugin'], 'Use plugins [default=graphdoc/plugins/default].'),
        new ValueFlag('template', ['-t', '--template'], 'Use template [default=graphdoc/template/slds].'),
        new ValueFlag('output', ['-o', '--output'], 'Output directory.'),
        new ValueFlag('data', ['-d', '--data'], 'Inject custom data.', JSON.parse, {}),
        new ValueFlag('baseUrl', ['-b', '--base-url'], 'Base url for templates.'),
        new BooleanFlag('force', ['-f', '--force'], 'Delete outputDirectory if exists.'),
        new BooleanFlag('verbose', ['-v', '--verbose'], 'Output more information.'),
        new BooleanFlag('version', ['-V', '--version'], 'Show graphdoc version.'),
    ];

    action(input: Input, out: OutputInterface) {

        const output = new Output(out, input.flags);
        const graphdocPackage = pack;
        let projectPackage: ProjectPackage;
        let schema: Schema;
        let plugins: PluginInterface[];
        let partials: Partials;
        let assets: string[];

        if (input.flags.version)
            return output.out.log('graphdoc v%s', graphdocPackage.version);

        function renderFile(type?: TypeRef) {
            return createData(projectPackage, graphdocPackage, plugins, type)
                .then(data => {

                    const file = type ? getFilenameOf(type) : 'index.html';
                    const filepath = path.resolve(projectPackage.graphdoc.output, file);
                    const relativeFilepath = path.relative(process.cwd(), filepath);

                    output.info('render', relativeFilepath);
                    return writeFile(filepath, render(partials.index, data, partials));
                });
        }

        // Load project info
        return this.getProjectPackage(input)
            .then(config => {
                projectPackage = config;
            })

            // Load Schema
            .then(() => this.getSchema(projectPackage))
            .then((introspection: Schema) => {
                schema = introspection;
            })

            // Load plugins
            .then(() => {
                projectPackage.graphdoc.plugins
                    .forEach(plugin => output.info('use plugin', plugin));

                return this.getPlugins(projectPackage.graphdoc.plugins);
            })
            .then((pluginContructors: PluginConstructor[]) => {
                plugins = pluginContructors
                    .map((Plugin) => new Plugin(schema, projectPackage, graphdocPackage));
            })

            // Collect assets
            .then(() => Plugin.collectAssets(plugins))
            .then((pluginAssets) => {
                assets = pluginAssets;
                assets
                    .forEach(asset => output.info('use asset', asset));
            })

            // Ensure Ourput directory
            .then(() => output.info('output directory', projectPackage.graphdoc.output))
            .then(() => this.ensureOutputDirectory(
                projectPackage.graphdoc.output,
                projectPackage.graphdoc.force,
            ))

            // Create Ourput directory
            .then(() => createBuildDirectory(
                projectPackage.graphdoc.output,
                projectPackage.graphdoc.template,
                assets
            ))

            // Collect partials
            .then(() => this.getTemplatePartials(
                projectPackage.graphdoc.template
            ))
            .then(p => {
                partials = p;
            })

            // Render index.html
            .then(() => renderFile())

            // Render [types | directives].html
            .then(() => ([] as TypeRef[])
                .concat(schema.types || [])
                .concat(schema.directives || [])
            )
            .then(types => Promise
                .all(types.map(t => renderFile(t)))
            )

            // Output resolve resolves
            .then(files => {
                output.ok('complete', String(files.length + 1) + ' files generated.');
            })

            .catch((err) => output.error(err));
    }

    ensureOutputDirectory(dir: string, force: boolean): Promise<void> {

        try {
            const stats = fs.statSync(dir);

            if (!stats.isDirectory())
                return Promise.reject(
                    new Error('Unexpected output: ' + dir + ' is not a directory.')
                );


            if (!force)
                return Promise.reject(
                    new Error(dir + ' already exists (delete it or use the --force flag)')
                );

            return removeBuildDirectory(dir);

        } catch (err) {
            return err.code === 'ENOENT' ?
                Promise.resolve() :
                Promise.reject(err);
        }
    }

    getTemplatePartials(templateDir: string): Promise<Partials> {

        return new Promise((resolve, reject) => {
            glob('**/*.mustache', { cwd: templateDir }, (err, files) => {
                return err ? reject(err) : resolve(files);
            });
        })
            .then((files: string[]) => {

                return Promise.all(
                    files.map(file => readFile(
                        path.resolve(templateDir, file), 'utf8'
                    ))
                )
                    .then((content: string[]) => {

                        let partials = {};

                        files
                            .forEach((file, i) => {
                                const name = path.basename(file, '.mustache');
                                partials[name] = content[i];
                            });

                        return partials as Partials;
                    });
            })
            .then((partials: Partials) => {

                if (partials.index)
                    return partials;

                return Promise.reject(
                    new Error(
                        'The index partial is missing (file ' +
                        path.resolve(templateDir, 'index.mustache') + ' not found).'
                    )
                );
            });
    }

    getProjectPackage(input: Input) {

        let packageJSON: any & { graphdoc: any };

        try {
            packageJSON = require(path.resolve(input.flags.configFile));
        } catch (err) {
            packageJSON = {};
        }

        packageJSON.graphdoc = Object.assign(packageJSON.graphdoc || {}, input.flags);

        if (packageJSON.graphdoc.data) {
            const data = packageJSON.graphdoc.data;
             packageJSON.graphdoc = Object.assign(data, packageJSON.graphdoc);
        }

        if (packageJSON.graphdoc.plugins.length === 0)
            packageJSON.graphdoc.plugins = ['graphdoc/plugins/default'];

        packageJSON.graphdoc.baseUrl = packageJSON.graphdoc.baseUrl || './';
        packageJSON.graphdoc.template = resolve(packageJSON.graphdoc.template || 'graphdoc/template/slds');
        packageJSON.graphdoc.output = path.resolve(packageJSON.graphdoc.output);
        packageJSON.graphdoc.version = pack.version;

        if (!packageJSON.graphdoc.output)
            return Promise.reject(
                new Error('Flag output (-o, --output) is required')
            );

        return Promise.resolve(packageJSON);
    }

    getPlugins(paths: string[]): PluginConstructor[] {
        return paths
            .map(path => resolve(path))
            .map(path => require(path).default);
    }

    getSchema(projectPackage: ProjectPackage): Promise<Schema> {

        if (projectPackage.graphdoc.schemaFile) {
            try {
                const schemaPath = path.resolve(projectPackage.graphdoc.schemaFile);
                const introspection: Introspection = require(schemaPath);
                return Promise.resolve(introspection.data.__schema);

            } catch (err) {
                return Promise.reject(err);
            }

        } else if (projectPackage.graphdoc.endpoint) {

            let options = {
                url: projectPackage.graphdoc.endpoint,
                method: 'POST',
                json: true,
                body: { query: introspectionQuery }
            } as any;

            options.headers = projectPackage.graphdoc.headers.reduce((result: any, header: string) => {
                const [name, value] = header.split(': ', 2);
                result[name] = value;
                return result;
            }, {});

            options.qs = projectPackage.graphdoc.queries.reduce((result: any, query: string) => {
                const [name, value] = query.split('=', 2);
                result[name] = value;
                return result;
            }, {});

            return new Promise((resolve, reject) => {
                request(options, (err, _, introspection: Introspection) => err ?
                    reject(err) : resolve(introspection.data.__schema));
            });

        } else {
            return Promise.reject(
                new Error('Endpoint (--endpoint, -e) or Schema File (--schema, -s) are require.')
            );
        }
    }
}
