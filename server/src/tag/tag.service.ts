import { Injectable, ForbiddenException } from '@nestjs/common';
import { Tag } from './tag.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TagDTO } from './tag.dto';

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
    ) { }

    public async getAll() {
        const tags = await this.tagRepository.find();
        const tagsResponse = tags.map(tag => ({ title: tag.title, code: tag.code }));
        return tagsResponse;
    }

    public async create(body: TagDTO) {
        const { title } = body;
        const code = title.toLowerCase().replace(/ /g, '_');
        const tagExists = await this.tagExists(code);
        if (!tagExists) {
            return await this.tagRepository.save({
                title, code,
            });
        }
        throw new ForbiddenException('Tag already exists.');
    }

    public async getByCode(code: string) {
        return await this.tagRepository.findOne({ code });
    }

    public async tagExists(code: string) {
        const tag = await this.getByCode(code);
        if (tag) {
            return true;
        }
        return false;
    }

    public async delete(code: string) {
        const exists = await this.tagExists(code);
        if (exists) {
            await this.tagRepository.delete({ code });
            return {
                success: true,
                message: `Successfully deleted the tag with the code (${code}).`,
            };
        }

        return {
            success: false,
            message: `There is not a tag that exists with that code (${code}).`,
        };
    }
}
