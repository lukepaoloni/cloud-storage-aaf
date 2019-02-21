import { Module, MulterModule } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './file.model';
import { User } from '../user/user.model';
import { FileRepository } from './file.repository';
import { UserRepository } from '../user/user.repository';
import { HistoryModule } from '../history/history.module';
import { multerConfig } from '../shared/multer-config';
import { TagModule } from 'src/tag/tag.module';

@Module({
    imports: [
        HistoryModule,
        TagModule,
        TypeOrmModule.forFeature([File, FileRepository, User, UserRepository]),
        MulterModule.register(multerConfig),
    ],
    controllers: [FileController],
    providers: [FileService],
    exports: [FileService, TypeOrmModule.forFeature([File, FileRepository])],
})
export class FileModule { }
