import { UserResponseObj } from '../user/user.dto';
import { TagDTO } from '../tag/tag.dto';
export declare class FileDto {
    title: string;
    name: string;
    type: string;
    path: string;
    size: number;
    tags: TagDTO[];
}
export declare class FileResponseObj {
    id: string;
    name: string;
    original_author: UserResponseObj;
    path: string;
    size: number;
    type: string;
    updated_at: string;
    version: number;
    tags: TagDTO[];
    permissions: {
        read: boolean;
        write: boolean;
    };
}
