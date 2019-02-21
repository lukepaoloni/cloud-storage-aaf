import { FileDto } from './file.dto';
import { FileService } from './file.service';
import { IFile } from '@shared/interfaces/file';
import { File } from './file.model';
export declare class FileController {
    private readonly fileService;
    constructor(fileService: FileService);
    getAll(email: string): Promise<{
        _id: import("typeorm").ObjectID;
        title: string;
        name: string;
        type: string;
        size: number;
        url: string;
        path: string;
        original_author: import("../shared/interfaces/user.dto").UserDTO;
        history: import("../history").History[];
        tags: import("../tag/tag.dto").TagDTO[];
        status: "active" | "archived";
        version: number;
        currentUserCheckedIn: import("./dto/userFileStatus.dto").UserFileStatus;
        updated_at: Date;
    }[]>;
    archive(id: string, email: string, body: any): Promise<{
        success: boolean;
        message: string;
    }>;
    changeVersion(id: string, email: string, body: {
        version: number;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    uploadFiles(files: IFile[], email: any, body: Partial<FileDto>): Promise<any[]>;
    updateOneFile(id: string, file: IFile, email: any, body: Partial<FileDto>): Promise<{
        success: boolean;
        message: string;
        file: {
            _id: import("typeorm").ObjectID;
            title: string;
            name: string;
            type: string;
            size: number;
            url: string;
            path: string;
            original_author: import("../shared/interfaces/user.dto").UserDTO;
            history: import("../history").History[];
            tags: import("../tag/tag.dto").TagDTO[];
            status: "active" | "archived";
            version: number;
            currentUserCheckedIn: import("./dto/userFileStatus.dto").UserFileStatus;
            updated_at: Date;
        };
    }>;
    checkUserIn(id: string, email: string, body: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getOne(id: string): Promise<{
        id: import("typeorm").ObjectID;
        name: string;
        title: string;
        original_author: import("../shared/interfaces/user.dto").UserDTO;
        path: string;
        size: number;
        status: "active" | "archived";
        tags: import("../tag/tag.dto").TagDTO[];
        url: string;
        created_at: Date;
        updated_at: Date;
        currentUserCheckedIn: import("./dto/userFileStatus.dto").UserFileStatus;
        version: number;
        history: {
            id: import("typeorm").ObjectID;
            author: {
                id: import("typeorm").ObjectID;
                email: string;
                name: string;
            };
            size: number;
            version: number;
            created_at: Date;
        }[];
    }>;
    updateOne(id: string, data: Partial<FileDto>): Promise<{
        success: boolean;
        id: string;
        _id: import("typeorm").ObjectID;
        title: string;
        name: string;
        type: string;
        size: number;
        url: string;
        path: string;
        original_author: import("../shared/interfaces/user.dto").UserDTO;
        history: import("../history").History[];
        tags: import("../tag/tag.dto").TagDTO[];
        status: "active" | "archived";
        version: number;
        currentUserCheckedIn: import("./dto/userFileStatus.dto").UserFileStatus;
        updated_at: Date;
    }>;
    create(body: Partial<File>): Promise<File>;
    getFileHistory(id: string): Promise<import("../history").History[]>;
    getFileVersion(id: string): Promise<{
        version: number;
    }>;
    delete(id: string, email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    sync(): Promise<{
        success: boolean;
        message: string;
    }>;
}
