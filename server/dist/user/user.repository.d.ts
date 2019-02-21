import { Repository } from 'typeorm';
import { User } from './user.model';
export declare class UserRepository extends Repository<User> {
    getByEmail(email: string): Promise<User>;
    getAll(): Promise<User[]>;
    findById(id: string): Promise<User>;
}
