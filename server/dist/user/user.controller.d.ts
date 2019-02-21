import { UserService } from './user.service';
import { User } from './user.model';
import { DeepPartial, DeleteResult } from 'typeorm';
import { UserDto, UserResponseObj, UpdateUserDto } from './user.dto';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getMe(id: any): Promise<UserResponseObj>;
    login(data: UserDto): Promise<UserResponseObj>;
    register(data: UserDto): Promise<UserResponseObj>;
    create(body: DeepPartial<User>): Promise<User>;
    findAll(): Promise<UserResponseObj[]>;
    findOne(id: string): Promise<User>;
    updateMe(user: any, data: Partial<UpdateUserDto>): Promise<any>;
    update(id: string, data: Partial<UpdateUserDto>): Promise<{}>;
    patch(id: string, data: DeepPartial<UpdateUserDto>): Promise<User>;
    delete(id: string): Promise<DeleteResult>;
}
