import { OneToOne, Column as Property, Entity as Collection, BaseEntity, ObjectID, ObjectIdColumn, CreateDateColumn } from 'typeorm';
import { User } from '@user';
import { UserDTO } from '@shared/interfaces/user.dto';
import { TagDTO } from '../tag/tag.dto';

@Collection('history')
export class History extends BaseEntity {
    constructor(obj?: Partial<History>) {
        super();
        Object.assign(this, obj);
    }
    @ObjectIdColumn()
    readonly id: ObjectID;

    @Property()
    title: string;

    @Property()
    name: string;

    @Property()
    path: string;

    @Property()
    size: number;

    @Property()
    tags: TagDTO[];

    @OneToOne(type => User)
    @Property()
    author: UserDTO;

    @Property()
    version: number;

    @CreateDateColumn()
    created_at: Date;
}
