import { observable, action, computed, runInAction } from "mobx";
import { IUserStore } from './IUserStore';
import { IError } from '@helpers/interfaces/errors';
import axios from 'axios';
import { authHeader } from '../../helpers/auth-header';
import { userService } from '../../services/user.service';


class UserStore implements IUserStore {
    @observable id = null
    @observable name = ''
    @observable company = ''
    @observable email = ''
    @observable password = ''
    @observable newPassword = ''
    @observable street = ''
    @observable city = ''
    @observable country = ''
    @observable postCode = ''
    @observable role = ''
    @observable inProgress = false
    @observable userLoaded = false
    @observable errors: IError[] = []

    @action.bound
    async profileSubmit() {
        console.log({ ...this.data })
        return await userService.updateProfile(this.id, this.data)
    }

    @action.bound
    async loadUser() {
        const response = await axios.get(
            `${process.env.REACT_APP_REST_API}users/me`, {
                headers: authHeader()
            }
        )
        runInAction(() => {
            this.setData(response.data)
        })
    }

    @computed get data() {
        const { name, company, email, street, city, country, postCode, role } = this

        return {
            name,
            email,
            company,
            street,
            city,
            country,
            postCode,
            role
        }
    }

    @action.bound
    setData(data) {
        Object.assign(this, data)
    }

    @action.bound
    setUserLoaded(userLoaded: boolean) {
        this.userLoaded = userLoaded
    }

    @action.bound
    setRole(role: string) {
        this.role = role
    }

    @action.bound
    setName(name: string): void {
        this.name = name
    }

    @action.bound
    setCompany(company: string): void {
        this.company = company
    }


    @action.bound
    setEmail(email: string): void {
        this.email = email
    }

    @action.bound
    setPassword(password: string): void {
        this.password = password
    }

    @action.bound
    setNewPassword(newPassword: string): void {
        this.newPassword = newPassword
    }

    @action.bound
    setStreet(street: string): void {
        this.street = street
    }

    @action.bound
    setCity(city: string): void {
        this.city = city
    }

    @action.bound
    setCountry(country: string): void {
        this.country = country
    }

    @action.bound
    setPostCode(postCode: string): void {
        this.postCode = postCode
    }

    @action.bound
    setInProgress(inProgress: boolean): void {
        this.inProgress = inProgress;
    }

    @action.bound
    setErrors(errors: IError[]): void {
        this.errors = errors;
    }

    @action.bound
    updateUser(data) {
        this.setData(data)
    }
}

export default new UserStore()