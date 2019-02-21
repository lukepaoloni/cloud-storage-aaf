import { ValidatorConstraintInterface } from 'class-validator';
import { UserService } from './user.service';
export declare class IsUserAlreadyExist implements ValidatorConstraintInterface {
    protected readonly userService: UserService;
    constructor(userService: UserService);
    validate(text: string): Promise<boolean>;
}
