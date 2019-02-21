import { BaseEntity, ObjectID } from 'typeorm';
import { UserDTO } from '@shared/interfaces/user.dto';
import { TagDTO } from '../tag/tag.dto';
export declare class History extends BaseEntity {
    constructor(obj?: Partial<History>);
    readonly id: ObjectID;
    title: string;
    name: string;
    path: string;
    size: number;
    tags: TagDTO[];
    author: UserDTO;
    version: number;
    created_at: Date;
}
