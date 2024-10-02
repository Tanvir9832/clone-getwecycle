import {
  EmailSupportDTO,
  GetAppStateDTO,
  IAuthRequest,
  UpdateFcmTokenDTO,
} from '@tanbel/homezz/types';
import { failed, success } from '../utils/response';
import FCM from '../models/FCM';
import Message from '../models/Message';
import Notification from '../models/Notification';
import { logger } from '../middleware/logger/logger';
import { sendEmail } from '../utils/email';
import { contactEmail } from '@tanbel/homezz/utils';

export const updateFcmToken = async (
  req: IAuthRequest<UpdateFcmTokenDTO>,
  res,
  next
) => {
  try {
    const { fcmToken } = req.body;
    const sessionId = req.session;
    const userId = req.user._id;

    const fcm = await FCM.findOne({ session: sessionId, user: userId });

    if (!fcm) {
      const newFcm = new FCM({
        user: userId,
        session: sessionId,
        token: fcmToken,
      });
      await newFcm.save();
    } else {
      await FCM.findOneAndUpdate(
        { session: sessionId },
        { token: fcmToken }
      );
    }
    return res.status(200).json(success({ message: "FCM token updated" }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const getAppState = async (req: IAuthRequest, res, next) => {
  try {
    const userId = req.user._id;

    const unseenMessages = await Message.aggregate([
      {
        $match: {
          receiver: userId,
          seen: false
        }
      },
      {
        $lookup: {
          from: "bookings",
          localField: "booking",
          foreignField: "_id",
          as: "booking"
        }
      },
      {
        $count: "unseenMessages"
      }
    ]);

    const unseenNotifications = await Notification.count({
      user: userId,
      seen: false,
    });

    const data: GetAppStateDTO = {
      unseenMessages: unseenMessages[0]?.unseenMessages || 0,
      unseenNotifications: unseenNotifications || 0,
    };

    return res.status(200).json(success({ data }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const emailForSupport = async (req: IAuthRequest<EmailSupportDTO>, res, next) => {
  try {
    const { email, message, name } = req.body;

    await sendEmail({
      to: ['zahin@wecycle.io', 'kb.tanvir@gmail.com', 'tanvir@wecycle.io', 'afsarzahin@gmail.com'],
      subject: 'Homezz Support',
      template: contactEmail({
        email,
        name,
        message,
      })
    })

    return res.status(200).json(success({ message: 'Message send successfully!' }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};
