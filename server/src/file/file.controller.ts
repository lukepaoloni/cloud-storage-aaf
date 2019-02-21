import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    UseGuards,
    UsePipes,
    ValidationPipe,
    UseInterceptors,
    FilesInterceptor,
    FileInterceptor,
    UploadedFiles,
    UploadedFile,
    Put,
    Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { User } from '@user/user.decorator';
import { FileDto } from './file.dto';
import { FileService } from './file.service';
import { ApiBearerAuth, ApiConsumes, ApiImplicitFile } from '@nestjs/swagger';
import { getUploadPath, move, getFilename, mkUploadDir, remove } from '@shared/helpers/file';
import { IFile } from '@shared/interfaces/file';
import { File } from './file.model';
import { normalize } from 'path';
import { UnauthorizedException } from '@nestjs/common';

@Controller('api/rest/files')
export class FileController {
    constructor(private readonly fileService: FileService) { }

    @Get()
    @ApiBearerAuth()
    @UseGuards(new JwtAuthGuard())
    @UsePipes(new ValidationPipe())
    public async getAll(@User('email') email: string) {
        return await this.fileService.getAll(email, false);
    }

    @Put(':id/archive')
    @ApiBearerAuth()
    @UseGuards(new JwtAuthGuard())
    @UsePipes(new ValidationPipe())
    public async archive(@Param('id') id: string, @User('email') email: string, @Body() body: any) {
        return await this.fileService.archive(id, email, body);
    }

    @Put(':id/version')
    @ApiBearerAuth()
    @UseGuards(new JwtAuthGuard())
    @UsePipes(new ValidationPipe())
    public async changeVersion(@Param('id') id: string, @User('email') email: string, @Body() body: { version: number }) {
        return await this.fileService.changeVersion(id, email, body);
    }

    @Post('upload')
    @ApiBearerAuth()
    @UseGuards(new JwtAuthGuard())
    @UseInterceptors(FilesInterceptor('filepond'))
    @ApiConsumes('multipart/form-data')
    @ApiImplicitFile({ name: 'files', required: true })
    public async uploadFiles(@UploadedFiles() files: IFile[], @User('email') email, @Body() body: Partial<FileDto>) {
        const filesResponse = [];
        for (const file of files) {

            const path = normalize(`${getUploadPath()}${getFilename(file)}/tmp`);
            const filePath = normalize(`${path}/${file.originalname}`);

            body.name = file.filename;
            body.path = filePath.split('uploads').pop();
            body.type = file.mimetype;
            body.size = file.size;

            const newFile: Partial<File> = await this.fileService.create(email, body, false);
            const newPath = normalize(`${getUploadPath()}${getFilename(file)}/v${newFile.version}`);
            let newFilePath = normalize(`${newPath}/${file.originalname}`);

            mkUploadDir(newPath);
            move(filePath, newFilePath);
            remove(path);

            newFilePath = newFilePath.split('uploads').pop();

            const id = newFile._id.toHexString();
            const lastHistoryIndex = newFile.history.length - 1;

            newFile.path = newFilePath;
            newFile.history[lastHistoryIndex].path = newFilePath;
            delete newFile._id;

            filesResponse.push(await this.fileService.update(id, newFile));
        }
        return filesResponse;
    }

    @Post(':id/upload')
    @ApiBearerAuth()
    @UseGuards(new JwtAuthGuard())
    @UseInterceptors(FileInterceptor('filepond'))
    @ApiConsumes('multipart/form-data')
    @ApiImplicitFile({ name: 'file', required: true })
    public async updateOneFile(@Param('id') id: string, @UploadedFile() file: IFile, @User('email') email, @Body() body: Partial<FileDto>) {
        const oldFile = await this.fileService.getOneById(id);
        if (file.filename !== oldFile.name) {
            throw new UnauthorizedException('File must be named the same.');
        }
        if (this.fileService.isCheckedIn(email, oldFile)) {
            const version = oldFile.getLastVersion() + 1;
            const tmpPath = normalize(`${getUploadPath()}${getFilename(file)}/tmp`);
            const tmpFilePath = normalize(`${tmpPath}/${file.originalname}`);
            const path = normalize(`${getUploadPath()}${getFilename(file)}/v${version}`);
            const filePath = normalize(`${path}/${file.originalname}`);

            body.name = file.filename;
            body.path = filePath.split('uploads').pop();
            body.size = file.size;

            mkUploadDir(path);
            move(tmpFilePath, filePath);
            remove(tmpPath);

            await this.fileService.update(id, { ...body, version, updated_at: new Date() }, email, {
                name: body.name,
                path: body.path,
                size: body.size,
                version,
            });
            const updatedFile = await this.fileService.getOneById(id);

            return {
                success: true,
                message: 'Successfully updated the file.',
                file: {
                    ...updatedFile.toJson(),
                },
            };
        }
    }

    @Put(':id/check-in-or-out')
    @ApiBearerAuth()
    @UseGuards(new JwtAuthGuard())
    public async checkUserIn(@Param('id') id: string, @User('email') email: string, @Body() body: any) {
        return await this.fileService.checkInOrOut(id, email, body);
    }

    @Get(':id')
    @ApiBearerAuth()
    @UseGuards(new JwtAuthGuard())
    @UsePipes(new ValidationPipe())
    public async getOne(@Param('id') id: string) {
        const file = await this.fileService.getOneById(id);
        return {
            id: file._id,
            name: file.name,
            title: file.title,
            original_author: file.original_author,
            path: file.path,
            size: file.size,
            status: file.status,
            tags: file.tags,
            url: file.url,
            created_at: file.created_at,
            updated_at: file.updated_at,
            currentUserCheckedIn: file.currentUserCheckedIn,
            version: file.version,
            history: file.history.map(history => (
                {
                    id: history.id,
                    author: { id: history.author.id, email: history.author.name, name: history.author.name },
                    size: history.size,
                    version: history.version,
                    created_at: history.created_at,
                }
            )),
        };
    }

    @Put(':id')
    @ApiBearerAuth()
    @UseGuards(new JwtAuthGuard())
    @UsePipes(new ValidationPipe())
    public async updateOne(@Param('id') id: string, @Body() data: Partial<FileDto>) {
        return await this.fileService.update(id, data);
    }

    @Post()
    public async create(@Body() body: Partial<File>) {
        return await this.fileService.createRaw(body);
    }

    @Get(':id/history')
    @ApiBearerAuth()
    @UseGuards(new JwtAuthGuard())
    @UsePipes(new ValidationPipe())
    public async getFileHistory(@Param('id') id: string) {
        return await this.fileService.getFileHistoryById(id);
    }

    @Get(':id/version')
    @ApiBearerAuth()
    @UseGuards(new JwtAuthGuard())
    @UsePipes(new ValidationPipe())
    public async getFileVersion(@Param('id') id: string) {
        return await this.fileService.getFileVersionById(id);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(new JwtAuthGuard())
    @UsePipes(new ValidationPipe())
    public async delete(@Param('id') id: string, @User('email') email: string) {
        return await this.fileService.restrictedDelete(id, email);
    }

    @Get('algolia/sync')
    public async sync() {
        return await this.fileService.sync();
    }
}
