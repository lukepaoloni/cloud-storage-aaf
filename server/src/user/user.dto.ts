import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
export class UpdateUserDto {
    @ApiModelProperty()
    company: string;

    @ApiModelProperty()
    name: string;

    @ApiModelProperty()
    street: string;

    @ApiModelProperty()
    city: string;

    @ApiModelProperty()
    country: string;

    @ApiModelProperty()
    postCode: string;

    @ApiModelProperty()
    teams: string[];
}
export class UserDto {
    @IsEmail()
    @ApiModelProperty()
    email: string;

    @IsNotEmpty()
    @ApiModelProperty()
    password: string;
}
export class UserResponseObj {
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
