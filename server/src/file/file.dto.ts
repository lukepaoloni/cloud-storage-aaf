import { IsString, IsArray, IsNumber } from 'class-validator'
import { ApiModelProperty } from '@nestjs/swagger';
import { UserResponseObj } from '../user/user.dto';
import { Tag } from '../tag/tag.model';
import { TagDTO } from '../tag/tag.dto';

export class FileDto {
    @IsString()
    @ApiModelProperty()
    title: string

    @IsString()
    @ApiModelProperty()
    name: string

    @IsString()
    @ApiModelProperty()
    type: string

    @IsString()
    @ApiModelProperty()
    path: string

    @IsNumber()
    @ApiModelProperty()
    size: number

    @IsArray()
    @ApiModelProperty()
    tags: TagDTO[]
}

export class FileResponseObj {
    id: string
    name: string
    original_author: UserResponseObj
    path: string
    size: number
    type: string
    updated_at: string
    version: number
    tags: TagDTO[]
    permissions: {
        read: boolean
        write: boolean
    }
}
