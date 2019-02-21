import { match } from "react-router";
import { IAuthStore } from '@stores/AuthStore/IAuthStore';
import { IUserStore } from '@stores/UserStore/IUserStore';
import { IFilesStore } from '@stores/FilesStore/IFilesStore'

export interface IFileProps {
    AuthStore: IAuthStore
    FilesStore: IFilesStore
    UserStore: IUserStore
    history?: History
    location?: Location
    match: match
}