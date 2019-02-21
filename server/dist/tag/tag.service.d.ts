import { Tag } from './tag.model';
import { Repository } from 'typeorm';
import { TagDTO } from './tag.dto';
export declare class TagService {
    private readonly tagRepository;
    constructor(tagRepository: Repository<Tag>);
    getAll(): Promise<{
        title: string;
        code: string;
    }[]>;
    create(body: TagDTO): Promise<{
        title: string;
        code: string;
    } & Tag>;
    getByCode(code: string): Promise<Tag>;
    tagExists(code: string): Promise<boolean>;
    delete(code: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
