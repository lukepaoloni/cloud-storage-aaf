import { observable, action } from 'mobx'

class AuthStore {
    @observable isLoggedIn: boolean
    @observable token: string | undefined
    @observable appLoaded = false

    constructor() {
        this.isLoggedIn = sessionStorage.getItem('token') ? true : false
        this.token = sessionStorage.getItem('token') ? sessionStorage.getItem('token') as string : undefined
    }

    @action.bound
    setToken(token) {
        this.token = token
    }

    @action setAppLoaded() {
        this.appLoaded = true;
    }

    @action.bound
    setIsLoggedIn(isLoggedIn: boolean) {
        this.isLoggedIn = isLoggedIn
    }
}
const singleton = new AuthStore()
export default singleton