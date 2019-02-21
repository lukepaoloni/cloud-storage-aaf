import { Controller, Get, UseGuards, Body, Param, Query } from '@nestjs/common';
import { AlgoliaService } from './algolia.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import * as Algolia from 'algoliasearch';
import { User } from '@user/user.decorator';

@Controller('api/rest/search')
export class AlgoliaController {
    private algoliaService: AlgoliaService;

    constructor() {
        this.algoliaService = new AlgoliaService('files');
    }

    @Get()
    @ApiBearerAuth()
    @UseGuards(new JwtAuthGuard())
    public async index(@Query('query') query: string, @User('email') email: string) {
        return await this.algoliaService.search({ query });
    }
}
