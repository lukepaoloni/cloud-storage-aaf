import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.model';
import { UnprocessableEntityException } from '@nestjs/common';
import { DeleteResult, DeepPartial, UpdateResult, ObjectID } from 'typeorm';
import { validate } from 'class-validator';
import { UserDto, UserResponseObj, UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) { }

  public async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException(`${email} was not found.`);
    }

    return user;
  }

  public async findAll(): Promise<UserResponseObj[]> {
    const users = await this.userRepository.find();
    return users.map(user => user.toJson(false));
  }

  public async findOneById(id: string): Promise<User> {
    return await this.userRepository.findOneOrFail(id);
  }

  public async login(data: UserDto) {
    const { email, password } = data;

    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user || !(await user.comparePassword(password))) {
      throw new NotFoundException(
        `Unable to find the user with that email (${email}) & password.`,
      );
    }

    return user.toJson();
  }

  public async register(data: UserDto) {
    const { email } = data;
    let user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new HttpException('User already exists.', HttpStatus.BAD_REQUEST);
    }
    user = await this.userRepository.create(data);
    await this.validate(user);
    const newUser = await this.userRepository.save(user);
    return newUser.toJson();
  }

  public async create(data: DeepPartial<User>): Promise<User> {
    const entity: User = this.userRepository.create(data);
    await this.validate(entity);
    return await this.userRepository.save(entity);
  }

  public async update(id: string, data: Partial<UpdateUserDto>): Promise<{}> {
    let user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User was not found with ID: ${id}`);
    }
    await this.userRepository.update(id, data);
    user = await this.findOneById(id);
    return {
      success: true,
      message: 'Successfully updated user.',
      user: user.toJson(false),
    };
  }

  public async patch(
    id: string,
    data: DeepPartial<UpdateUserDto>,
  ): Promise<any> {
    const entity: User = await this.findOneById(id);
    Object.assign(entity, data);
    await this.validate(entity);
    const user = await this.userRepository.save(entity);
    return {
      success: true,
      message: 'Successfully updated user (PATCH).',
      user: user.toJson(false),
    };
  }

  public async delete(id: string): Promise<DeleteResult> {
    console.log(id);
    return await this.userRepository.delete(id);
  }

  private async validate(entity: User) {
    const errors = await validate(entity, {
      validationError: {
        target: false,
        value: false,
      },
    });
    if (errors.length) {
      throw new UnprocessableEntityException(errors);
    }
  }
}
