import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module'
import { FileModule } from './file/file.module'
import { HistoryModule } from './history/history.module'
import { FolderModule } from './folder/folder.module';
import { TagModule } from './tag/tag.module';
import { AlgoliaModule } from './algolia/algolia.module';
@Module({
    imports: [
        TypeOrmModule.forRoot(),
        UserModule,
        FileModule,
        HistoryModule,
        FolderModule,
        TagModule,
        AlgoliaModule,
    ],
})
export class AppModule { }
