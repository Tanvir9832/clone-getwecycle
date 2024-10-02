import { AppLinks } from '@tanbel/homezz/utils';
import { logger } from '../../middleware/logger/logger';
import Booking from '../../models/Booking';
import User from '../../models/User';
import { createNotification } from '../../utils/create-notification';
import { success, failed } from '../../utils/response';
import {
  AssignServiceDTO,
  IAuthRequest,
  NotificationType,
  UserType,
} from '@tanbel/homezz/types';

export const getAllProviders = async (req: IAuthRequest, res, next) => {
  try {
    const providers = await User.find({
      _id: {
        $ne: req.user._id,
      },
      userType: {
        $in: [UserType.PROVIDER],
      },
    });
    res.status(201).json(success({ data: providers }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const assignService = async (
  req: IAuthRequest<AssignServiceDTO>,
  res,
  next
) => {
  try {
    const { providerId, bookingId } = req.body;

    const booking = await Booking.findOneAndUpdate(
      { _id: bookingId },
      { provider: providerId },
      { new: true }
    );

    const bookingPopulate = await booking.populate('service');

    createNotification({
      title: bookingPopulate.service.title,
      body: 'You have a new Request!',
      userId: providerId,
      link: AppLinks.order(),
      ref: booking._id,
      type: NotificationType.BOOKING,
    });

    res.status(201).json(success({ message: 'Request assigned!' }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};
