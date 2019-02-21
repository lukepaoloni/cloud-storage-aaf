import { ObjectID } from 'typeorm';
export interface UserDTO {
    id: ObjectID;
    email: string;
    name: string;
}
