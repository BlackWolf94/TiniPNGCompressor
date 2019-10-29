import tinify from "tinify";
import {FileHelper} from "./helper/FileHelper";
import chalk from "chalk";
import * as figlet from "figlet";
import {Bar} from "cli-progress";
import * as dotenv from 'dotenv';
import {join, normalize} from 'path';
import * as path from "path";
dotenv.config();

tinify.key = process.env.API_KEY;

console.log(chalk.red(figlet.textSync('TINI PNG helper cli', { horizontalLayout: 'full' })));


const fromDir = "runtime/origin";
const toDir = "runtime/out";

const files: string[] = [];

const addFile = async (file: string): Promise<void> => {
    files.push(file)
};

const scanFiles = async (folder: string) => {
    const contentFiles = await FileHelper.readDir(folder);
    for (let i in contentFiles) {
        const file = contentFiles[i];
        const _path = `${folder}/${file}`;
        await (!FileHelper.isDir(_path) ? addFile(_path) : scanFiles(_path));
    }

};



(async () => {
    await FileHelper.createDir(fromDir);
    await scanFiles(fromDir);
    const progress = new Bar({});

    console.log(chalk.green(`Compress files:`));

    progress.start(files.length, 0);
    for(let i in files){
        const file = files[i];

        try {
            const source = tinify.fromFile(join(__dirname, '..', file));
            await FileHelper.createDir(path.dirname(file.replace(fromDir, toDir)));
            await source.toFile(join(__dirname, '..', file.replace(fromDir, toDir)));
        }catch (e) {
            console.log(chalk.red(e));
        }

        progress.update(Number(i) + 1);
    }
    progress.stop();

    console.log(chalk.green(`DONE!`));
})();


