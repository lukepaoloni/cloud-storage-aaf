import { UserRepository } from './user.repository';
import { User } from './user.model';
import { DeleteResult, DeepPartial } from 'typeorm';
import { UserDto, UserResponseObj, UpdateUserDto } from './user.dto';
export declare class UserService {
    private userRepository;
    constructor(userRepository: UserRepository);
    findByEmail(email: string): Promise<User>;
    findAll(): Promise<UserResponseObj[]>;
    findOneById(id: string): Promise<User>;
    login(data: UserDto): Promise<UserResponseObj>;
    register(data: UserDto): Promise<UserResponseObj>;
    create(data: DeepPartial<User>): Promise<User>;
    update(id: string, data: Partial<UpdateUserDto>): Promise<{}>;
    patch(id: string, data: DeepPartial<UpdateUserDto>): Promise<any>;
    delete(id: string): Promise<DeleteResult>;
    private validate;
}
