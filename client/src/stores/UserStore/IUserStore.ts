import { IError } from '@helpers/interfaces/errors';
import { AxiosResponse } from 'axios';

export interface IUserStore {
    name: string
    company: string
    email: string
    password: string
    newPassword: string
    street: string
    city: string
    country: string
    postCode: string
    inProgress: boolean
    role: string
    errors: IError[]
    setName(name: string): void
    setCompany(company: string): void
    setEmail(email: string): void
    setPassword(password: string): void
    setNewPassword(newPassword: string): void
    setStreet(street: string): void
    setCity(city: string): void
    setCountry(country: string): void
    setPostCode(postCode: string): void
    setInProgress(inProgress: boolean): void
    setErrors(errors: IError[]): void
    setRole(role: string): void
    updateUser: (data: any) => void
    profileSubmit: () => Promise<AxiosResponse<any>>
}