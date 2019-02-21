import * as fs from 'fs';
import * as moment from 'moment';
import { extname, normalize, join } from 'path';
import { clientPubDir } from '../config';

const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

export const getFilename = file => {
    return file.originalname.replace(extname(file.originalname), '');
};

export const getUploadPath = () => {
    return normalize(`${clientPubDir}/uploads/${moment().format('Y')}/${moment().format('MM')}/${moment().format('DD')}/`);
};

export const getPublicPath = (path?: string) => {
    if (path) {
        return normalize(`${clientPubDir}/${path}`);
    }
    return normalize(`${clientPubDir}/`);
};

export const mkUploadDir = (filePath: string) => {
    mkdirp.sync(filePath);
};

export const remove = (path: string) => {
    rimraf.sync(path);
};

export const move = (oldPath, newPath) => {
    fs.renameSync(oldPath, newPath);
};
