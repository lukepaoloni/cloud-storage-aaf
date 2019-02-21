import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Put,
  Delete,
  Patch,
  UsePipes,
  ValidationPipe,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.model';
import { DeepPartial, DeleteResult, UpdateResult } from 'typeorm';
import { UserDto, UserResponseObj, UpdateUserDto } from './user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User as CurrentUser } from './user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

@Controller('api/rest/users')
export class UserController {
  constructor(private userService: UserService) { }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(new JwtAuthGuard())
  public async getMe(@CurrentUser('id') id) {
    try {
      const user = await this.userService.findOneById(id);
      return user.toJson(false);
    } catch (err) {
      throw new NotFoundException(`Couldn't find the user with the id ${id}.`);
    }
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  public async login(@Body() data: UserDto): Promise<UserResponseObj> {
    return await this.userService.login(data);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  public async register(@Body() data: UserDto): Promise<UserResponseObj> {
    return await this.userService.register(data);
  }

  @Post()
  public async create(@Body() body: DeepPartial<User>) {
    return await this.userService.create(body);
  }

  @Get()
  public async findAll(): Promise<UserResponseObj[]> {
    return await this.userService.findAll();
  }

  @Get('/:id')
  public async findOne(@Param('id') id: string) {
    return await this.userService.findOneById(id);
  }

  @Put()
  @ApiBearerAuth()
  @UseGuards(new JwtAuthGuard())
  public async updateMe(
    @CurrentUser() user,
    @Body() data: Partial<UpdateUserDto>,
  ): Promise<any> {
    return await this.userService.update(user.id, data);
  }

  @Put('/:id')
  public async update(
    @Param('id') id: string,
    @Body() data: Partial<UpdateUserDto>,
  ): Promise<{}> {
    return await this.userService.update(id, data);
  }

  @Patch('/:id')
  public async patch(
    @Param('id') id: string,
    @Body() data: DeepPartial<UpdateUserDto>,
  ): Promise<User> {
    return await this.userService.patch(id, data);
  }

  @Delete('/:id')
  public async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.userService.delete(id);
  }
}
