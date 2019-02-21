import { Injectable } from '@nestjs/common';
import { Repository, FindConditions, FindOneOptions } from 'typeorm';
import { Folder } from './folder.model';
import { InjectRepository } from '@nestjs/typeorm';
import { FolderDto } from './folder.dto';

@Injectable()
export class FolderService {
    constructor(
        @InjectRepository(Folder)
        private folderRepository: Repository<Folder>
    ) { }

    public async getAll() {
        return await this.folderRepository.find()
    }

    public async create(data: FolderDto) {
        return await this.folderRepository.save(data)
    }

    public async updateMany(condition?: FindOneOptions<Folder>, data?: FolderDto) {
        let folders: Folder[]
        if (condition) {
            folders = await this.folderRepository.find(condition)
        } else {
            folders = await this.folderRepository.find()
        }
        for (let folder of folders) {
            if (data.path) {
                await this.folderRepository.update({ id: folder.id }, { path: data.path })
            }
        }
    }

    public async updateWhere(condition: any, data: FolderDto) {
        await this.folderRepository.update(condition, data)
    }
}
