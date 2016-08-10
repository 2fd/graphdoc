import {readFile as read, writeFile as write} from 'fs';

export function readTemplate(filename: string, encoding: string): Promise<Buffer> {

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