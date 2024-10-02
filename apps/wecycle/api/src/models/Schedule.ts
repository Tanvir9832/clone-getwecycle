import { IScheduleModel, ICompleteScheduleModel } from '@tanbel/homezz/types';
import { Schema, model } from 'mongoose';

const scheduleSchema = new Schema<IScheduleModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    rule: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const completeScheduleSchema = new Schema<ICompleteScheduleModel>(
  {
    schedule: {
      type: Schema.Types.ObjectId,
      ref: 'Schedule',
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Schedule = model('Schedule', scheduleSchema);
export const CompleteSchedule = model(
  'CompleteSchedule',
  completeScheduleSchema
);
