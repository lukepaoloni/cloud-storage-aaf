import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from '@history';
import { Repository } from 'typeorm';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
  ) { }
  public async create(data: History) {
    return await this.historyRepository.save(data);
  }

  public async findById(id: string) {
    return await this.historyRepository.findOne(id);
  }

  public async findByName(name: string) {
    return await this.historyRepository.findOne({
      where: {
        name,
      },
    });
  }
}
