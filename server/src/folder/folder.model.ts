import { BaseEntity, Entity as Collection, ObjectID, ObjectIdColumn, Column as Property } from 'typeorm';

@Collection('folders')
export class Folder extends BaseEntity {
    @ObjectIdColumn()
    readonly id: ObjectID

    @Property({
        unique: true
    })
    path: string;
}