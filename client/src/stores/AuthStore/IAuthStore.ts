import { IUserStore } from '../UserStore/IUserStore';

export interface IAuthStore {
    isLoggedIn: boolean
    currentUser: IUserStore
    token: string | undefined
}