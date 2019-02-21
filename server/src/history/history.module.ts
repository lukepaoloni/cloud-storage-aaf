import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History, HistoryService } from './';

@Module({
  imports: [
    TypeOrmModule.forFeature([History]),
  ],
  providers: [
    HistoryService,
  ],
  exports: [HistoryService],
})
export class HistoryModule { }
