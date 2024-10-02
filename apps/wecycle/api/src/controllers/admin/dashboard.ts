import { IAuthRequest, UserType } from '@tanbel/homezz/types';
import Booking from '../../models/Booking';
import { failed, success } from '../../utils/response';
import User from '../../models/User';
import { PipelineStage } from 'mongoose';

type Filter = {
  limit?: number;
  skip?: number;
  tab?: 'AllTime' | 'ThisWeek' | 'ThisMonth';
};

export const getDashboardData = async (req: IAuthRequest, res, next) => {
  try {
    const currentDate = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(currentDate.getDate() - 7);
    const userType = req.user.userType;
    const isProvider = userType.includes(UserType.PROVIDER);
    const isAdmin = userType.includes(UserType.SUPER_ADMIN);
    const id = req.user._id;
    const { tab }: Filter = req.query;
    console.log(tab);
    const bookingPipeline: any[] = [
      {
        $match: {},
      },
      {
        $group: {
          _id: { $dateToString: { format: '%d-%m-%Y', date: '$createdAt' } },
          totalBookingsLast7Days: { $sum: 1 },
        },
      },

      {
        $group: {
          _id: null,
          bookingsLast7Days: { $sum: '$totalBookingsLast7Days' },
          bookingsByDay: {
            $push: {
              date: '$_id',
              totalBookings: '$totalBookingsLast7Days',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          bookingsLast7Days: 1,
          bookingsByDay: 1,
        },
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
    ];

    const earningPipeline: any[] = [
      {
        $match: {},
      },
      {
        $match: {
          'price.acceptedByUser': true,
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%d-%m-%Y', date: '$createdAt' } },
          earningsForDay: { $sum: '$price.amount' },
        },
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$earningsForDay' },
          earningsByDay: {
            $push: {
              date: '$_id',
              totalEarnings: '$earningsForDay',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalEarnings: 1,
          earningsByDay: 1,
        },
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
    ];

    if (tab === 'ThisWeek') {
      bookingPipeline[0].$match.createdAt = {
        $gte: sevenDaysAgo,
        $lte: currentDate,
      };
      earningPipeline[0].$match.createdAt = {
        $gte: sevenDaysAgo,
        $lte: currentDate,
      };
    } else if (tab === 'ThisMonth') {
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      bookingPipeline[0].$match.createdAt = {
        $gte: startOfMonth,
        $lte: currentDate,
      };
      earningPipeline[0].$match.createdAt = {
        $gte: startOfMonth,
        $lte: currentDate,
      };
    }

    if (isProvider) {
      bookingPipeline.unshift({
        $match: {
          provider: id,
        },
      });

      const bookingResult = await Booking.aggregate(bookingPipeline);
      const earningResult = await Booking.aggregate(earningPipeline);

      res.status(201).json(
        success({
          data: {
            totalBookings: bookingResult[0]?.bookingsLast7Days || 0,
            bookingsByDay: bookingResult[0]?.bookingsByDay || [],
            totalEarnings: earningResult[0]?.totalEarnings || 0,
            earningsByDay: earningResult[0]?.earningsByDay || [],
          },
        })
      );
    }

    if (isAdmin) {
      const totalUser = await User.countDocuments({
        userType: UserType.CONSUMER,
      });

      const bookingResult = await Booking.aggregate(bookingPipeline);
      const earningResult = await Booking.aggregate(earningPipeline);

      res.status(201).json(
        success({
          data: {
            totalBookings: bookingResult[0]?.bookingsLast7Days || 0,
            bookingsByDay: bookingResult[0]?.bookingsByDay || [],
            totalEarnings: earningResult[0]?.totalEarnings || 0,
            earningsByDay: earningResult[0]?.earningsByDay || [],
            totalUser,
          },
        })
      );
    }
  } catch (error) {
    res.status(500).json(failed({ issue: error.message }));
  }
};
