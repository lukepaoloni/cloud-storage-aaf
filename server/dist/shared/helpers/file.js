"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const moment = require("moment");
const path_1 = require("path");
const config_1 = require("../config");
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
exports.getFilename = file => {
    return file.originalname.replace(path_1.extname(file.originalname), '');
};
exports.getUploadPath = () => {
    return path_1.normalize(`${config_1.clientPubDir}/uploads/${moment().format('Y')}/${moment().format('MM')}/${moment().format('DD')}/`);
};
exports.getPublicPath = (path) => {
    if (path) {
        return path_1.normalize(`${config_1.clientPubDir}/${path}`);
    }
    return path_1.normalize(`${config_1.clientPubDir}/`);
};
exports.mkUploadDir = (filePath) => {
    mkdirp.sync(filePath);
};
exports.remove = (path) => {
    rimraf.sync(path);
};
exports.move = (oldPath, newPath) => {
    fs.renameSync(oldPath, newPath);
};
//# sourceMappingURL=file.js.map