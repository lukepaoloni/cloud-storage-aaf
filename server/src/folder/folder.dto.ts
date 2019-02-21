import { ApiModelProperty } from "@nestjs/swagger";

export class FolderDto {
    @ApiModelProperty()
    path: string;
}