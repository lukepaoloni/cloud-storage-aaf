import { TagService } from './tag.service';
import { TagDTO } from './tag.dto';
export declare class TagController {
    private readonly tagService;
    constructor(tagService: TagService);
    getAll(): Promise<{
        title: string;
        code: string;
    }[]>;
    create(body: TagDTO): Promise<{
        title: string;
        code: string;
    } & import("./tag.model").Tag>;
    delete(code: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
