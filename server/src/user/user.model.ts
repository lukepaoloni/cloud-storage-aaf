import {
  ObjectIdColumn,
  Entity as Collection,
  Column as Property,
  ObjectID,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { IsEmail, MinLength } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserResponseObj } from './user.dto';
import { DeepPartial } from 'typeorm';

@Collection('users')
export class User extends BaseEntity {
  @ObjectIdColumn()
  readonly id: ObjectID;

  @Property()
  name: string;

  @Property({
    unique: true,
  })
  @IsEmail()
  email: string;

  @Property()
  @MinLength(4)
  password: string;

  @Property()
  company: string;

  @Property()
  street: string;

  @Property()
  city: string;

  @Property()
  postCode: string;

  @Property()
  country: string;

  @Property()
  teams: string[];

  @Property({
    default: 'user',
  })
  role: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  async hashPassword() {
    const saltRounds = parseInt(process.env.SALT_ROUNDS);
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }

  private get token() {
    const { id, email } = this;
    return jwt.sign(
      {
        id,
        email,
      },
      process.env.APP_SECRET,
      {
        expiresIn: '7d',
      },
    );
  }

  setData(data: DeepPartial<User>) {
    Object.assign(this, data);
  }

  toJson(showToken: boolean = true, keys?: string[]): UserResponseObj {
    let response: any = {};
    const {
      id,
      name,
      email,
      company,
      street,
      city,
      country,
      postCode,
      token,
      role,
    } = this;
    response = {
      id: id.toHexString(),
      email,
      name,
      company,
      street,
      city,
      country,
      postCode,
      role,
    };
    if (showToken && token) {
      response.token = token;
    }
    return response;
  }
}
