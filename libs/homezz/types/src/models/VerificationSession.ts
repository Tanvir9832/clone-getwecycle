import { Document } from 'mongoose';
import { IUser, IUserModel } from './User';

export interface IVerificationSession {
    user: IUserModel,
    token: string,
    expireDate: Date,
}

export interface IVerificationSessionModel extends IVerificationSession, Document { }