import { FileRepository } from './file.repository';
import { FileDto } from './file.dto';
import { UserRepository } from '@user/user.repository';
import { History } from '@history';
import { HistoryService } from '@history';
import { File } from './file.model';
import { UserDTO } from '@shared/interfaces/user.dto';
import { TagService } from '../tag/tag.service';
export declare class FileService {
    private fileRepository;
    private userRepository;
    private historyService;
    private tagService;
    private static statuses;
    private algoliaService;
    constructor(fileRepository: FileRepository, userRepository: UserRepository, historyService: HistoryService, tagService: TagService);
    isCheckedIn(email: string, file: File): boolean;
    getAll(email?: string, showHistory?: boolean): Promise<{
        _id: import("typeorm").ObjectID;
        title: string;
        name: string;
        type: string;
        size: number;
        url: string;
        path: string;
        original_author: UserDTO;
        history: History[];
        tags: import("../tag/tag.dto").TagDTO[];
        status: "active" | "archived";
        version: number;
        currentUserCheckedIn: import("./dto/userFileStatus.dto").UserFileStatus;
        updated_at: Date;
    }[]>;
    sync(): Promise<{
        success: boolean;
        message: string;
    }>;
    restrictedDelete(id: string, email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getOneById(id: string): Promise<File>;
    getFileHistoryById(id: string): Promise<History[]>;
    getFileVersionById(id: string): Promise<{
        version: number;
    }>;
    archive(id: string, email: string, body: {
        status: 'active' | 'archived';
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    checkInOrOut(id: string, email: string, body: any): Promise<{
        success: boolean;
        message: string;
    }>;
    update(id: string, data: Partial<File>, email?: string, history?: Partial<History>): Promise<{
        success: boolean;
        id: string;
        _id: import("typeorm").ObjectID;
        title: string;
        name: string;
        type: string;
        size: number;
        url: string;
        path: string;
        original_author: UserDTO;
        history: History[];
        tags: import("../tag/tag.dto").TagDTO[];
        status: "active" | "archived";
        version: number;
        currentUserCheckedIn: import("./dto/userFileStatus.dto").UserFileStatus;
        updated_at: Date;
    }>;
    save(file: File): Promise<File>;
    createRaw(body: Partial<File>): Promise<File>;
    create(email: string, body: Partial<FileDto>, json?: boolean): Promise<File | {
        success: boolean;
        message: string;
        author: import("../user/user.dto").UserResponseObj;
        _id: import("typeorm").ObjectID;
        title: string;
        name: string;
        type: string;
        size: number;
        url?: string;
        path: string;
        original_author: UserDTO;
        history: History[];
        tags: import("../tag/tag.dto").TagDTO[];
        currentUserCheckedIn: import("./dto/userFileStatus.dto").UserFileStatus;
        status: "active" | "archived";
        version: number;
        created_at: Date;
        updated_at: Date;
    }>;
    changeVersion(id: string, email: string, body: {
        version: number;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
