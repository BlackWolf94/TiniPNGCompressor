import * as fs from 'fs';
import { dirname } from 'path';
import * as rimraf from 'rimraf';

export class FileHelper {
    static readFile(fileName: string): Promise<string> {
        return new Promise<string>((resolve) => {
            if (!fs.existsSync(fileName)) {
                resolve(null);
                return;
            }

            fs.readFile(fileName, 'utf8', (error, contents) => {
                if (error) {
                    resolve(null);
                    return;
                }
                resolve(contents);
            });
        });
    }

    static createDir(dirName: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            if (fs.existsSync(dirName)) {
                resolve(true);
                return;
            }

            fs.mkdir(dirName, { recursive: true }, (err) => {
                if (err) {
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        });
    }

    static writeFile(fileName: string, content: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            await this.createDir(dirname(fileName));
            fs.writeFile(fileName, content, 'utf8', (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(true);
            });
        });
    }

    static removeFile(fileName: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            if (!fs.existsSync(fileName)) {
                resolve(true);
                return;
            }

            fs.unlink(fileName, (error) => {
                if (error) {
                    resolve(false);
                }
                resolve(true);
            });
        });
    }

    static readDir(folder: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            fs.readdir(folder, (error, files) => {
                if (error) {
                    resolve([]);
                }
                resolve(files);
            });
        });
    }

    static removeDir(folder: string): Promise<any> {
        return new Promise((resolve) => {
            rimraf(folder, resolve);
        });
    }

    static isDir(path: string): boolean {
        const inf = fs.lstatSync(path);
        return inf.isDirectory();
    }

    static fileInfo(path: string): boolean {
        const inf = fs.lstatSync(path);
        return inf.isDirectory();
    }
}