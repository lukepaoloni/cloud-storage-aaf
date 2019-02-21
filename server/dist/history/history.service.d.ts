import { History } from '@history';
import { Repository } from 'typeorm';
export declare class HistoryService {
    private readonly historyRepository;
    constructor(historyRepository: Repository<History>);
    create(data: History): Promise<History>;
    findById(id: string): Promise<History>;
    findByName(name: string): Promise<History>;
}
