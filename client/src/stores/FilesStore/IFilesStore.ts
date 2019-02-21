import { FileRO } from '@server/shared/interfaces/file.response';
export interface IFilesStore {
    files: FileRO[]
    setFiles(files: FileRO[]): void
    addFile(file: FileRO): void
    getFileById(id: string): FileRO | undefined
    getFileByName(name: string): FileRO | undefined
}