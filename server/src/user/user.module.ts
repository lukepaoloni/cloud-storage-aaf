import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.model';
import { UserRepository } from './user.repository';
import { IsUserAlreadyExist } from './user.validator';

@Module({
    imports: [TypeOrmModule.forFeature([User, UserRepository])],
    controllers: [UserController],
    providers: [UserService, IsUserAlreadyExist],
    exports: [UserService, TypeOrmModule.forFeature([User, UserRepository])],
})
export class UserModule { }
