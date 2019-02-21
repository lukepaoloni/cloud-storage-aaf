import { observable, action, computed } from "mobx";
import { IFilesStore } from './IFilesStore';
import { FileRO } from '@server/shared/interfaces/file.response';


class FilesStore implements IFilesStore {
    @observable files: FileRO[] = []

    @action.bound
    setFiles(files: FileRO[]) {
        this.files = files
    }

    @action.bound
    getFileById(id: string) {
        return this.files.find(file => file._id === id)
    }

    @action.bound
    getFileByName(name: string) {
        return this.files.find(file => file.name === name)
    }

    @action.bound
    addFile(file: FileRO) {
        this.files.push(file)
    }

    @action.bound
    removeFile(file: FileRO) {
        this.files.forEach((item, index) => {
            if (item._id === file._id) {
                delete this.files[index]
            }
        })
    }
}
export default new FilesStore()