import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.model';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    public async getByEmail(email: string): Promise<User> {
        const user = await this.findOne({
            where: {
                email,
            },
        });

        if (!user) {
            throw new NotFoundException();
        }

        return user;
    }

    public async getAll(): Promise<User[]> {
        return await this.find();
    }

    public async findById(id: string): Promise<User> {
        return await this.findOneOrFail(id);
    }
}
