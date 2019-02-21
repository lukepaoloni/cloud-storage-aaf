import { Controller, Get, UseGuards, Post, Body, Param, Delete } from '@nestjs/common';
import { TagService } from './tag.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TagDTO } from './tag.dto';

@Controller('api/rest/tags')
export class TagController {
    constructor(private readonly tagService: TagService) { }

    @Get()
    @ApiBearerAuth()
    @UseGuards(new JwtAuthGuard())
    public async getAll() {
        return await this.tagService.getAll();
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(new JwtAuthGuard())
    public async create(@Body() body: TagDTO) {
        return await this.tagService.create(body);
    }

    @Delete(':code')
    @ApiBearerAuth()
    @UseGuards(new JwtAuthGuard())
    public async delete(@Param('code') code: string) {
        return await this.tagService.delete(code);
    }
}
