/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CreateScheduleDTO,
  GetScheduleDTO,
  IRequest,
  SendScheduleDTO,
} from '@tanbel/homezz/types';
import { logger } from '../middleware/logger/logger';
import { failed, success } from '../utils/response';
import { RRule } from 'rrule';
import { endOfThisMonth, endOfThisYear, startOfThisMonth } from '@tanbel/utils';
import { CompleteSchedule, Schedule } from '../models/Schedule';

export const createSchedule = async (
  req: IRequest<CreateScheduleDTO>,
  res,
  next
) => {
  try {
    const userId = req?.user?._id;
    const { title, last_done, next_schedule } = req.body;
    const parsedLastDone = new Date(last_done);
    const parsedNextSchedule = new Date(next_schedule);

    const timeDifferenceMs: number =
      parsedNextSchedule.getTime() - parsedLastDone.getTime();

    const daysDifference: number = Math.floor(
      timeDifferenceMs / (1000 * 60 * 60 * 24)
    );

    const rule = new RRule({
      freq: RRule.DAILY,
      interval: daysDifference,
      dtstart: parsedLastDone,
    });

    const newSchedule = new Schedule({
      user: userId.toString(),
      title,
      rule: rule.toString(),
    });

    const result = await newSchedule.save();
    res.status(201).json(success({ data: result }));
  } catch (error) {
    logger.error(error);

    res.status(500).json(failed({ issue: error.message }));
  }
};

export const completeSchedule = async (
  req: IRequest<SendScheduleDTO>,
  res,
  next
) => {
  try {
    const { _id, date } = req.body;

    const existingSchedule = await CompleteSchedule.findOne({
      schedule: _id,
      date,
    });

    if (existingSchedule) {
      const result = await CompleteSchedule.deleteOne({
        schedule: existingSchedule.schedule,
      });
      res.status(201).json(success({ data: result }));
    } else {
      const schedule = await Schedule.findOne({ _id: _id });
      const newSchedule = new CompleteSchedule({
        schedule: schedule._id,
        date,
      });
      const result = await newSchedule.save();
      res.status(201).json(success({ data: result }));
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const getMySchedules = async (req: IRequest, res, next) => {
  try {
    const id = req?.user?._id;

    const schedule = await Schedule.find({ user: id });

    const mappedSchedules = schedule.map((schedule) => {
      const rule = RRule.fromString(schedule.rule);

      const datesOfThisMonth = rule.between(
        startOfThisMonth(),
        endOfThisMonth()
      );

      return datesOfThisMonth.map((d) => ({
        _id: schedule._id,
        title: schedule.title,
        user: schedule.user,
        date: d,
      }));
    });

    const flatSchedule = mappedSchedules.flat();
    const dates = flatSchedule.map((d) => new Date(d.date).toISOString());

    const completedSchedules = await CompleteSchedule.find({
      date: {
        $in: dates,
      },
    });

    const finalSchedules = flatSchedule.map((schedule: any) => {
      const thisSchedules = completedSchedules.filter(
        (s) => s.schedule.toString() === schedule._id.toString()
      );
      if (
        thisSchedules.some(
          (s) => new Date(s.date).getTime() === schedule.date.getTime()
        )
      ) {
        return {
          ...schedule,
          completed: true,
        };
      } else {
        return {
          ...schedule,
          completed: false,
        };
      }
    });

    res.status(201).json(success({ data: finalSchedules }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const getAllSchedule = async (req: IRequest, res, next) => {
  try {
    const id = req?.user?._id;

    const schedule = await Schedule.find({ user: id });

    res.status(201).json(success({ data: schedule }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const getAllHistory = async (req: IRequest, res, next) => {
  try {
    const userId = req.user._id;
    const result = await CompleteSchedule.aggregate([
      {
        $lookup: {
          from: 'schedules',
          localField: 'schedule',
          foreignField: '_id',
          as: 'schedule',
        },
      },
      {
        $match: { 'schedule.user': userId },
      },
      {
        $unwind: '$schedule',
      },
    ]);

    res.status(201).json(success({ data: result }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const updateSchedule = async (
  req: IRequest<CreateScheduleDTO, { id: string }>,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const { title, last_done, next_schedule } = req.body;
    const parsedLastDone = new Date(last_done);
    const parsedNextSchedule = new Date(next_schedule);

    const timeDifferenceMs: number =
      parsedNextSchedule.getTime() - parsedLastDone.getTime();

    const daysDifference: number = Math.floor(
      timeDifferenceMs / (1000 * 60 * 60 * 24)
    );

    const rule = new RRule({
      freq: RRule.DAILY,
      interval: daysDifference,
      dtstart: parsedLastDone,
    });

    const result = await Schedule.findOneAndUpdate(
      { _id: id },
      {
        title,
        rule: rule.toString(),
      },
      {
        new: true
      }
    );

    res.status(201).json(success({ data: result }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const deleteSchedule = async (
  req: IRequest<null, { id: string }>,
  res,
  next
) => {
  try {
    const { id } = req.params;
    await Schedule.findByIdAndDelete({ _id: id });
    res.status(201).json(success({ message: 'Schedule deleted successfully' }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};
