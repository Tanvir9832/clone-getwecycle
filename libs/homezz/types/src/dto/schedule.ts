import { ObjectId } from 'mongoose';
import { DTO } from '.';
import { ICompleteSchedule, ICompleteScheduleModel, IScheduleModel, IUserModel } from '../models';

export type GetScheduleDTO = DTO<
  IScheduleModel,
  {
    _id: ObjectId;
    title: string;
    date: Date;
    completed?: boolean;
  }
>;

export type GetScheduleHistoryDTO = DTO<ICompleteScheduleModel, {
  schedule: {
    title: string,
  },
  date: Date
}
>;

export type CreateScheduleDTO = {
  title: string;
  last_done: Date;
  next_schedule: Date;
};

export type SendScheduleDTO = {
  _id: string;
  date: string;
};
