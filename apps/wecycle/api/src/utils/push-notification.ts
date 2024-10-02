import { IUserModel } from '@tanbel/homezz/types';
import { firebase } from '../firebase/index'
import FCM from '../models/FCM';
import { MulticastMessage } from 'firebase-admin/lib/messaging/messaging-api';
import { Types } from 'mongoose';
import { logger } from '../middleware/logger/logger';

interface PushNotificationDTO {
  title: string;
  body: string;
  tokens?: string[];
  userId?: string | IUserModel;
  link?: string;
}

export const pushNotification = async ({ title, body, tokens, userId, link }: PushNotificationDTO) => {
  try {
    const fcm = await FCM.aggregate([
      {
        $match: {
          user: new Types.ObjectId(userId.toString())
        }
      },
      {
        $lookup: {
          from: 'usersessions',
          foreignField: '_id',
          localField: 'session',
          as: 'session'
        }
      },
      {
        $match: {
          "session.expireDate": { "$gte": new Date() }
        }
      },
      {
        $project: {
          token: 1
        }
      }
    ])

    title = title || "Homezz";
    body = body || "You got a new notification";

    if (userId && !fcm) {
      return null
    } else {
      tokens = fcm.map((f) => f.token);
    }

    if (!tokens.length) {
      return null
    }

    const message: MulticastMessage = {
      data: {
        title,
        body: JSON.stringify({
          message: body,
          link,
        }),
      },
      apns: {
        payload: {
          aps: {
            contentAvailable: true,
          },
        },
        headers: {
          'apns-push-type': 'background',
          'apns-priority': '5',
          'apns-topic': 'com.tanbel.homezz',
        },
      },
      android: {
        priority: 'high',
      },
      tokens,
    };

    const result = firebase.messaging().sendEachForMulticast(message);
    return result;
  } catch (err) {
    logger.error(err);
    return err;
  }
};
