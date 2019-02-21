import { Repository, ObjectID } from 'typeorm';
import { File as FileEntity, File } from './file.model';
import { User } from '@user';
export declare class FileRepository extends Repository<FileEntity> {
    getByTypes(types: string[]): Promise<FileEntity[] | null>;
    fileExists(name: string): Promise<false | File>;
    getByName(name: string): Promise<FileEntity | null>;
    getByAuthor(author: User): Promise<string>;
    getByDate(date: Date): Promise<string>;
    getByLocation(location: string): Promise<string>;
    getByProject(project: string): Promise<string>;
    getAll(): Promise<{
        _id: ObjectID;
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
    findById(id: string): Promise<FileEntity>;
    findByObjectId(id: ObjectID): Promise<FileEntity>;
}
