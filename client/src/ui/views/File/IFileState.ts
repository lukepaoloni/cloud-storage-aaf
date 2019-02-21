import { FileResponseObj } from '@server/file/file.dto'
export interface IFileState {
    collapse: boolean
    file: FileResponseObj
}