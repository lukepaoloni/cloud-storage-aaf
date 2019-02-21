import { History } from '../../history/history.model';
import { UserResponseObj } from '../../user/user.dto';
import { TagDTO } from '../../tag/tag.dto';
import { UserFileStatus } from '../../file/dto/userFileStatus.dto';
export interface FileRO {
    _id: string;
    title: string;
    name: string;
    path: string;
    type: string;
    size: number;
    original_author: UserResponseObj;
    created_at: string;
    updated_at: string;
    currentUserCheckedIn?: UserFileStatus;
    version: number;
    status: 'archived' | 'active';
    tags: TagDTO[];
    history: History[];
}
