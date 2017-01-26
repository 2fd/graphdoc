import * as path from 'path';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import {toPromise} from './promise';


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
};

/**
 * Execute fs.read as Promise
 */
export function readFile(filename: string, encoding: string = 'utf8'): Promise<string> {

    return toPromise(fs.readFile, [filename, encoding]);
}

/**
 * Execute fs.write as Promise
 */
export function writeFile(filename: string, data: string): Promise<void> {

    return toPromise(fs.writeFile, [filename, data]);
}

/**
 * remove build directory
 */
export function removeBuildDirectory(buildDirectory: string): Promise<void> {
    return toPromise(fse.remove, [buildDirectory]);
}

/**
 * Create build directory from a templete directory
 */
export function createBuildDirectory(buildDirectory: string, templateDirectory: string, assets: string[]): Promise<void> {

    // read directory
    return toPromise(fs.readdir, [templateDirectory])

        // ignore *.mustache templates
        .then(files => files.filter(file => path.extname(file) !== '.mustache'))

        // copy recursive
        .then(files => {

            let copyAll = files.map((file: string) => toPromise(
                fse.copy,
                [path.resolve(templateDirectory, file), path.resolve(buildDirectory, file)]
            ));

            return Promise.all(copyAll);
        })

        // create assets directory
        .then(files => {
            return toPromise(fs.mkdir, [path.resolve(buildDirectory, 'assets')]);
        })

        // copy assets
        .then(() => {
            let copyAll = assets.map((asset: string) => toPromise(
                fse.copy,
                [asset, path.resolve(buildDirectory, 'assets', path.basename(asset))]
            ));

            return Promise.all(copyAll);
        });
}