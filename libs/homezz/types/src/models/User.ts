import { Document } from 'mongoose';

export enum UserType {
    PROVIDER = 'PROVIDER',
    CONSUMER = 'CONSUMER',
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
    BLOG_MANAGER = "BLOG_MANAGER",
    CUSTOMER_SERVICE = "CUSTOMER_SERVICE"
}

export interface IUser {
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
    avatar: string,
    phone: string,
    location: string,
    verification: {
        email: boolean,
    },
    userType: UserType[],
}

export interface IUserModel extends IUser, Document { }