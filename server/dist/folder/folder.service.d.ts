import { Repository, FindOneOptions } from 'typeorm';
import { Folder } from './folder.model';
import { FolderDto } from './folder.dto';
export declare class FolderService {
    private folderRepository;
    constructor(folderRepository: Repository<Folder>);
    getAll(): Promise<Folder[]>;
    create(data: FolderDto): Promise<FolderDto & Folder>;
    updateMany(condition?: FindOneOptions<Folder>, data?: FolderDto): Promise<void>;
    updateWhere(condition: any, data: FolderDto): Promise<void>;
}
