import { IsString, IsEmail } from "class-validator";

export class Credentials {
    @IsEmail()
	readonly email: string

	@IsString()
	readonly password: string;
}