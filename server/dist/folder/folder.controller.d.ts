import { Folder } from './folder.model';
import { FolderService } from './folder.service';
import { FolderDto } from './folder.dto';
export declare class FolderController {
    private readonly folderService;
    constructor(folderService: FolderService);
    createFolder(user: any, body: FolderDto): Promise<FolderDto & Folder>;
    getAll(): Promise<Folder[]>;
    update(id: any, body: FolderDto | any): Promise<{
        success: boolean;
        message: string;
    }>;
}
