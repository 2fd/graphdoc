import {
  BooleanFlag,
  Command,
  InputInterface,
  ListValueFlag,
  NoParams,
  OutputInterface,
  ValueFlag,
} from "@2fd/command";
import Bluebird from "bluebird";
import fs from "fs";
import glob from "glob";
import { render } from "mustache";
import path from "path";
import { PluginInterface, Schema, TypeRef } from "./interface";
import {
  httpSchemaLoader,
  idlSchemaLoader,
  jsonSchemaLoader,
  jsSchemaLoader,
} from "./schema-loader";
import { createData, getFilenameOf, Output, Plugin } from "./utility";
import {
  createBuildDirectory,
  readFile,
  removeBuildDirectory,
  resolve,
  writeFile,
} from "./utility/fs";

// tslint:disable-next-line:no-var-requires
const graphdocPackageJSON = require(path.resolve(__dirname, "../package.json"));

export interface IFlags {
  configFile: string;
  endpoint: string;
  headers: string[];
  queries: string[];
  schemaFile: string;
  plugins: string[];
  template: string;
  data: any;
  output: string;
  force: boolean;
  verbose: boolean;
  version: boolean;
}

export interface IPartials {
  [name: string]: string | undefined;
  index?: string;
}

export interface IProjectPackage {
  graphdoc: IFlags;
}

export type Input = InputInterface<IFlags, {}>;

export class GraphQLDocumentGenerator extends Command<IFlags, {}> {
  public description =
    graphdocPackageJSON.description + " v" + graphdocPackageJSON.version;

  public params = new NoParams();

  public flags = [
    new ValueFlag(
      "configFile",
      ["-c", "--config"],
      "Configuration file [./package.json].",
      String,
      "./package.json"
    ),
    new ValueFlag(
      "endpoint",
      ["-e", "--endpoint"],
      'Graphql http endpoint ["https://domain.com/graphql"].'
    ),
    new ListValueFlag(
      "headers",
      ["-x", "--header"],
      'HTTP header for request (use with --endpoint). ["Authorization: Token cb8795e7"].'
    ),
    new ListValueFlag(
      "queries",
      ["-q", "--query"],
      'HTTP querystring for request (use with --endpoint) ["token=cb8795e7"].'
    ),
    new ValueFlag(
      "schemaFile",
      ["-s", "--schema", "--schema-file"],
      'Graphql Schema file ["./schema.json"].'
    ),
    new ListValueFlag(
      "plugins",
      ["-p", "--plugin"],
      "Use plugins [default=graphdoc/plugins/default]."
    ),
    new ValueFlag(
      "template",
      ["-t", "--template"],
      "Use template [default=graphdoc/template/slds]."
    ),
    new ValueFlag("output", ["-o", "--output"], "Output directory."),
    new ValueFlag(
      "data",
      ["-d", "--data"],
      "Inject custom data.",
      JSON.parse,
      {}
    ),
    new ValueFlag("baseUrl", ["-b", "--base-url"], "Base url for templates."),
    new BooleanFlag(
      "force",
      ["-f", "--force"],
      "Delete outputDirectory if exists."
    ),
    new BooleanFlag("verbose", ["-v", "--verbose"], "Output more information."),
    new BooleanFlag("version", ["-V", "--version"], "Show graphdoc version."),
  ];

  public async action(input: Input, out: OutputInterface) {
    const output = new Output(out, input.flags);

    try {
      if (input.flags.version) {
        return output.out.log("graphdoc v%s", graphdocPackageJSON.version);
      }

      // Load project info
      const projectPackageJSON: IProjectPackage = await this.getProjectPackage(
        input
      );

      // Load Schema
      const schema: Schema = await this.getSchema(projectPackageJSON);

      // Load plugins
      const plugins: PluginInterface[] = this.getPluginInstances(
        projectPackageJSON.graphdoc.plugins,
        schema,
        projectPackageJSON,
        graphdocPackageJSON
      );

      projectPackageJSON.graphdoc.plugins.forEach((plugin) =>
        output.info("use plugin", plugin)
      );

      // Collect assets
      const assets: string[] = await Plugin.collectAssets(plugins);
      assets.forEach((asset) =>
        output.info("use asset", path.relative(process.cwd(), asset))
      );

      // Ensure Ourput directory
      output.info(
        "output directory",
        path.relative(process.cwd(), projectPackageJSON.graphdoc.output)
      );
      await this.ensureOutputDirectory(
        projectPackageJSON.graphdoc.output,
        projectPackageJSON.graphdoc.force
      );

      // Create Output directory
      await createBuildDirectory(
        projectPackageJSON.graphdoc.output,
        projectPackageJSON.graphdoc.template,
        assets
      );

      // Collect partials
      const partials: IPartials = await this.getTemplatePartials(
        projectPackageJSON.graphdoc.template
      );
      // Render index.html
      output.info("render", "index");
      await this.renderFile(projectPackageJSON, partials, plugins);

      // Render types
      const renderTypes = ([] as any[])
        .concat(schema.types || [])
        .concat(schema.directives || [])
        .map((type: TypeRef) => {
          output.info("render", type.name || "");
          return this.renderFile(projectPackageJSON, partials, plugins, type);
        });

      const files = await Promise.all(renderTypes);
      output.ok(
        "complete",
        String(files.length + 1 /* index.html */) + " files generated."
      );
    } catch (err) {
      output.error(err);
    }
  }

  public async ensureOutputDirectory(dir: string, force: boolean) {
    try {
      const stats = fs.statSync(dir);

      if (!stats.isDirectory()) {
        return Promise.reject(
          new Error("Unexpected output: " + dir + " is not a directory.")
        );
      }

      if (!force) {
        return Promise.reject(
          new Error(dir + " already exists (delete it or use the --force flag)")
        );
      }

      return removeBuildDirectory(dir);
    } catch (err) {
      return err.code === "ENOENT" ? Promise.resolve() : Promise.reject(err);
    }
  }

  public getProjectPackage(input: Input) {
    let packageJSON: any & { graphdoc: any };

    try {
      packageJSON = require(path.resolve(input.flags.configFile));
    } catch (err) {
      packageJSON = {};
    }

    packageJSON.graphdoc = { ...(packageJSON.graphdoc || {}), ...input.flags };

    if (packageJSON.graphdoc.data) {
      const data = packageJSON.graphdoc.data;
      packageJSON.graphdoc = { ...data, ...packageJSON.graphdoc };
    }

    if (packageJSON.graphdoc.plugins.length === 0) {
      packageJSON.graphdoc.plugins = ["graphdoc/plugins/default"];
    }

    packageJSON.graphdoc.baseUrl = packageJSON.graphdoc.baseUrl || "./";
    packageJSON.graphdoc.template = resolve(
      packageJSON.graphdoc.template || "graphdoc/template/slds"
    );
    packageJSON.graphdoc.output = path.resolve(packageJSON.graphdoc.output);
    packageJSON.graphdoc.version = graphdocPackageJSON.version;

    if (!packageJSON.graphdoc.output) {
      return Promise.reject(
        new Error("Flag output (-o, --output) is required")
      );
    }

    return Promise.resolve(packageJSON);
  }

  public getPluginInstances(
    paths: string[],
    schema: Schema,
    projectPackageJSON: object,
    pluginGraphdocPackageJSON: object
  ): PluginInterface[] {
    return paths.map((p) => {
      const absolutePaths = resolve(p);
      const plugin = require(absolutePaths).default;

      return typeof plugin === "function"
        ? // plugins as constructor
          new plugin(schema, projectPackageJSON, pluginGraphdocPackageJSON)
        : // plugins plain object
          plugin;
    });
  }

  public async getTemplatePartials(templateDir: string): Promise<IPartials> {
    const partials: IPartials = {};
    const files: string[] = await Bluebird.promisify(
      (
        pattern: string,
        options: glob.IOptions,
        cb: (err: Error, matches: string[]) => void
      ) => glob(pattern, options, cb)
    )("**/*.mustache", { cwd: templateDir });

    await Promise.all(
      files.map((file) => {
        const name = path.basename(file, ".mustache");
        return readFile(path.resolve(templateDir, file), "utf8").then(
          (content) => (partials[name] = content)
        );
      })
    );

    if (!partials.index) {
      throw new Error(
        `The index partial is missing (file ${path.resolve(
          templateDir,
          "index.mustache"
        )} not found).`
      );
    }

    return partials;
  }

  public async getSchema(projectPackage: IProjectPackage): Promise<Schema> {
    if (projectPackage.graphdoc.schemaFile) {
      const schemaFileExt = path.extname(projectPackage.graphdoc.schemaFile);
      switch (schemaFileExt) {
        case ".json":
          return jsonSchemaLoader(projectPackage.graphdoc);
        case ".gql":
        case ".gqls":
        case ".graphqls":
        case ".graphql":
          return idlSchemaLoader(projectPackage.graphdoc);
        case ".js":
          return jsSchemaLoader(projectPackage.graphdoc);
        default:
          return Promise.reject(
            new Error("Unexpected schema extension name: " + schemaFileExt)
          );
      }
    } else if (projectPackage.graphdoc.endpoint) {
      return httpSchemaLoader(projectPackage.graphdoc);
    } else {
      return Promise.reject(
        new Error(
          "Endpoint (--endpoint, -e) or Schema File (--schema, -s) are require."
        )
      );
    }
  }

  public async renderFile(
    projectPackageJSON: IProjectPackage,
    partials: IPartials,
    plugins: PluginInterface[],
    type?: TypeRef
  ) {
    const templateData = await createData(
      projectPackageJSON,
      graphdocPackageJSON,
      plugins,
      type
    );
    const file = type ? getFilenameOf(type) : "index.html";
    const filePath = path.resolve(projectPackageJSON.graphdoc.output, file);
    return writeFile(
      filePath,
      render(partials.index as string, templateData, partials)
    );
  }
}
