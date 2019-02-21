import { BaseEntity, ObjectID } from 'typeorm';
export declare class Folder extends BaseEntity {
    readonly id: ObjectID;
    path: string;
}
