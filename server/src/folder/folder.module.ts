import { Module } from '@nestjs/common';
import { FolderController } from './folder.controller';
import { FolderService } from './folder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from './folder.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([Folder])
  ],
  controllers: [FolderController],
  providers: [FolderService]
})
export class FolderModule { }
