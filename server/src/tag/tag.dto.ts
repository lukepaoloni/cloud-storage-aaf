import { ApiModelProperty } from '@nestjs/swagger';

export class TagDTO {
    code?: string;
    @ApiModelProperty()
    title: string;
}
