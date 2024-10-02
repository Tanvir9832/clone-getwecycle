import { IUserModel } from './User';
import { Document } from "mongoose";

export interface ISchedule {
  user: IUserModel;
  title: string;
  rule: string;
}
export interface ICompleteSchedule {
  schedule: IScheduleModel;
  date: Date;
}

export interface IScheduleModel extends ISchedule, Document {}
export interface ICompleteScheduleModel extends ICompleteSchedule, Document {}
