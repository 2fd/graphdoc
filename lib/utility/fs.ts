import * as path from 'path';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import * as Bluebird from 'bluebird';

/**
 * resolve
 *
 * transform a path relative to absolute, if relative
 * path start with `graphdoc/` return absolute path to
 * plugins directory
 */
const MODULE_BASEPATH = 'graphdoc/';

export function resolve(relative: string): string {

    if (relative.slice(0, MODULE_BASEPATH.length) === MODULE_BASEPATH)
        return path.resolve(__dirname, '../../', relative.slice(MODULE_BASEPATH.length));

    return path.resolve(relative);
}

/**
 * Execute fs.read as Promise
 */
export const readFile = Bluebird.promisify<string, string, string>(fs.readFile);
export const writeFile = Bluebird.promisify<string, string, string>(fs.writeFile);
export const copyAll = Bluebird.promisify<void, string, string>(fse.copy);
export const readDir = Bluebird.promisify<string[], string>(fs.readdir);
export const mkDir = Bluebird.promisify<string, string>(fs.mkdir as any);
export const removeBuildDirectory = Bluebird.promisify<void, string>(fse.remove as any);

/**
 * Create build directory from a templete directory
 */
export async function createBuildDirectory(buildDirectory: string, templateDirectory: string, assets: string[]) {

    // read directory
    const files = await readDir(templateDirectory);
    await Bluebird.all(files

        // ignore *.mustache templates
        .filter(file => path.extname(file) !== '.mustache')

        // copy recursive
        .map(file => copyAll(
            path.resolve(templateDirectory, file),
            path.resolve(buildDirectory, file),
        ))
    );

    // create assets directory
    await mkDir(path.resolve(buildDirectory, 'assets'));

    await Bluebird.all(assets
        .map(asset => copyAll(
            asset,
            path.resolve(buildDirectory, 'assets', path.basename(asset))
        ))
    );
}