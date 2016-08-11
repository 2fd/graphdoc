import {extname, resolve} from 'path';
import {readFile as read, writeFile as write, readdir} from 'fs';
import {copyRecursive} from 'fs.extra';

function readDir(path: string): Promise<string[]> {
    return new Promise((resolve, reject) => readdir(
        path,
        (err, files) => err ? reject(err) : resolve(files))
    );
}

function copy(origin, destiny): Promise<void> {
    return new Promise((resolve, reject) => {
        copyRecursive(origin, destiny, (err) => err ? reject(err) : resolve())
    });
}

export function createBuildFolder(buildDir: string, templateDir: string): Promise<void> {

    return readDir(templateDir)
        .then(files => files.filter(file => extname(file) !== '.mustache'))
        .then(files => {
            return Promise.all(files.map(
                (file) => copy(resolve(templateDir, file), resolve(buildDir, file))
            ));
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