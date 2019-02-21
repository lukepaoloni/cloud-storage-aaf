export declare class UpdateUserDto {
    company: string;
    name: string;
    street: string;
    city: string;
    country: string;
    postCode: string;
    teams: string[];
}
export declare class UserDto {
    email: string;
    password: string;
}
export declare class UserResponseObj {
    id?: string;
    email: string;
    name: string;
    token?: string;
    company?: string;
    street?: string;
    city?: string;
    role?: string;
    country?: string;
    postCode?: string;
    avatar?: string;
}
