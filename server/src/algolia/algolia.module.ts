import { Module } from '@nestjs/common';
import { AlgoliaController } from './algolia.controller';

@Module({
  controllers: [AlgoliaController],
})
export class AlgoliaModule { }
