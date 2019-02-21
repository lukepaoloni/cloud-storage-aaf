import { ObjectID, BaseEntity } from 'typeorm';
import { UserResponseObj } from './user.dto';
import { DeepPartial } from 'typeorm';
export declare class User extends BaseEntity {
    readonly id: ObjectID;
    name: string;
    email: string;
    password: string;
    company: string;
    street: string;
    city: string;
    postCode: string;
    country: string;
    teams: string[];
    role: string;
    created_at: Date;
    updated_at: Date;
    hashPassword(): Promise<void>;
    comparePassword(attempt: string): Promise<boolean>;
    private readonly token;
    setData(data: DeepPartial<User>): void;
    toJson(showToken?: boolean, keys?: string[]): UserResponseObj;
}
