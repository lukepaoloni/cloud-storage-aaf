"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = require("multer");
const path_1 = require("path");
const moment = require("moment");
const config_1 = require("@shared/config");
const path_2 = require("path");
const mkdirp = require('mkdirp');
exports.multerConfig = {
    storage: multer_1.diskStorage({
        destination: (req, file, cb) => {
            const filename = file.originalname.replace(path_1.extname(file.originalname), '');
            const uploadPath = path_2.normalize(`${config_1.clientPubDir}/uploads/${moment().format('Y')}/${moment().format('MM')}/${moment().format('DD')}/${filename}/tmp`);
            mkdirp.sync(uploadPath);
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(null, `${file.originalname}`);
        },
    }),
};
//# sourceMappingURL=multer-config.js.map