import { Column as Property, Entity as Collection, BaseEntity, ObjectID, ObjectIdColumn } from 'typeorm';

@Collection('tags')
export class Tag extends BaseEntity {
    @ObjectIdColumn()
    id: ObjectID

    @Property()
    title: string

    @Property({
        unique: true
    })
    code: string
}