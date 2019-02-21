import { Controller, Post, UseGuards, Body, Get, Put } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './../user/user.decorator';
import { getPublicPath } from '../shared/helpers/file';
import { Folder } from './folder.model';
import { FolderService } from './folder.service';
import { FolderDto } from './folder.dto';
import mkdirp = require('mkdirp');


@Controller('api/rest/folders')
export class FolderController {
    constructor(private readonly folderService: FolderService) { }

    @Post()
    @ApiBearerAuth()
    @UseGuards(new JwtAuthGuard())
    public async createFolder(@User('id') user, @Body() body: FolderDto) {
        await mkdirp.sync(`${getPublicPath(`uploads/${body.path}`)}`)
        return await this.folderService.create(body)
    }

    @Get()
    @ApiBearerAuth()
    @UseGuards(new JwtAuthGuard())
    public async getAll() {
        return await this.folderService.getAll()
    }

    @Put()
    @ApiBearerAuth()
    @UseGuards(new JwtAuthGuard())
    public async update(@User('id') id, @Body() body: FolderDto | any) {
        if (body.where) {
            await this.folderService.updateMany({ where: body.where }, body)
            return {
                success: true,
                message: 'Successfully updated the record.'
            }
        }
    }
}
