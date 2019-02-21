import { MulterOptions } from '@nestjs/common/interfaces/external/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as moment from 'moment';
import { clientPubDir } from '@shared/config';
import { normalize } from 'path';

const mkdirp = require('mkdirp');

export const multerConfig: MulterOptions = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            const filename = file.originalname.replace(extname(file.originalname), '');
            const uploadPath = normalize(`${clientPubDir}/uploads/${moment().format('Y')}/${moment().format('MM')}/${moment().format('DD')}/${filename}/tmp`);
            mkdirp.sync(uploadPath);
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(null, `${file.originalname}`);
        },
    }),
};
