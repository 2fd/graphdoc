import * as path from 'path';
import { readFile as read, writeFile as write, readdir, mkdir } from 'fs';
import { copyRecursive } from 'fs.extra';

function readDir(path: string): Promise<string[]> {
    return new Promise((resolve, reject) => readdir(
        path,
        (err: Error, files: string[]) => err ?
            reject(err) : resolve(files)
    ));
}

function copy(origin, destiny): Promise<void> {

    return new Promise((resolve, reject) => copyRecursive(
        origin,
        destiny,
        (err: Error) => err ?
            reject(err) : resolve()
    ));
}

export function createBuildFolder(buildDir: string, templateDir: string, assets: string[]): Promise<void> {

    // read directory
    return readDir(templateDir)

        // ignore *.mustache templates
        .then(files => files.filter(file => path.extname(file) !== '.mustache'))

        // copy recursive
        .then(files => {

            let copyAll = files.map((file: string) => copy(
                path.resolve(templateDir, file),
                path.resolve(buildDir, file)
            ));

            return Promise.all(copyAll);
        })

        // create assets directory
        .then(files => {

            return new Promise((resolve, reject) => mkdir(
                path.resolve(buildDir, 'assets'),
                (err) => {
                    err ? reject(err) : resolve();
                }
            ));
        })

        // copy assets
        .then(() => {

            let copyAll = assets.map((asset: string) => copy(
                asset,
                path.resolve(buildDir, 'assets')
            ));

            return Promise.all(copyAll);
        });
}

export function readTemplate(filename: string, encoding: string): Promise<Buffer | string> {

    return new Promise((resolve, reject) => read(
        filename,
        encoding,
        (err: Error, template: string) => err ?
            reject(err) : resolve(template)
    ));
}

export function writeFile(filename: string, data: string): Promise<void> {

    return new Promise((resolve, reject) => write(
        filename,
        data,
        (err: Error) => err ?
            reject(err) : resolve()
    ));
}