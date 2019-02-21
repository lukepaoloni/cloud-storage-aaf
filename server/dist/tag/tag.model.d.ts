import { BaseEntity, ObjectID } from 'typeorm';
export declare class Tag extends BaseEntity {
    id: ObjectID;
    title: string;
    code: string;
}
