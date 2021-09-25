import { Document } from 'mongoose';

export default interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    status: string;
    firstname:string;
    lastname:string;
    expenses:string[];
}