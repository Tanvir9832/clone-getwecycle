import {
  BookingStatus,
  BookingType,
  GetProviderBookingsDTO,
  IAuthRequest,
  NotificationType,
  Select,
  SetBookingPriceDTO,
  UserType,
} from "@tanbel/homezz/types";
import { AppLinks } from "@tanbel/homezz/utils";
import {
  diffInDays,
  endOfThisMonth,
  endOfThisWeek,
  startOfThisMonth,
  startOfThisWeek,
} from "@tanbel/utils";
import { Types } from "mongoose";
import { emitNotificationMessage } from "../../listeners";
import { logger } from "../../middleware/logger/logger";
import Booking from "../../models/Booking";
import PaymentInfo from "../../models/PaymentInfo";
import ServiceHistory from "../../models/ServiceHistory";
import { checkAccess } from "../../utils/helper";
import { failed, success } from "../../utils/response";
import { stripe } from "../../utils/stripe";
import Stripe from "stripe";
import Invoice from "../../models/Invoice";

type Filter = {
  limit?: number;
  skip?: number;
  tab?: number;
};

export const getAllBookings = async (req: IAuthRequest, res, next) => {
  try {
    const id = req.user._id;
    const IsSuperAdmin = checkAccess(req.user.userType, [UserType.SUPER_ADMIN]);
    const { limit, skip, tab }: Filter = req.query;

    const SelectBookingsDTO: Select<GetProviderBookingsDTO> = {
      _id: 1,
      date: 1,
      location: {
        name: 1,
      },
      service: {
        _id: 1,
        title: 1,
        cover: 1,
        priceInputs: 1,
      },
      user: {
        _id: 1,
        avatar: 1,
        username: 1,
      },
      priceInputs: 1,
      images: 1,
      status: 1,
    };

    const services = await Booking.aggregate([
      {
        $match: {
          ...(IsSuperAdmin ? {} : { provider: new Types.ObjectId(id) }),
          ...(tab ? { status: tab } : {}),
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "service",
        },
      },
      { $unwind: "$service" },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: SelectBookingsDTO,
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $skip: +skip || 0,
      },
      {
        $limit: +limit || 20,
      },
    ]);

    res.status(201).json(success({ data: services }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};
// export const getSingleBookings = async (
//   req: IAuthRequest<GetProviderBookingsDTO, { id: string }>,
//   res,
//   next
// ) => {
//   try {
//     const id = req.params.id;
//     const IsSuperAdmin = checkAccess(req.user.userType, [UserType.SUPER_ADMIN]);

//     const SelectBookingsDTO = {
//       date: 1,
//       _id: 1,
//       user: {
//         _id: 1,
//         avatar: 1,
//         username: 1,
//       },
//       service: 1,
//       priceInputs: 1,
//       status: 1,
//       location: {
//         name: 1,
//       },
//     };

//     const services = await Booking.findById({ _id: id })
//       .select(SelectBookingsDTO)
//       .populate(['service', 'user']);

//     res.status(201).json(success({ data: services }));
//   } catch (error) {
//     logger.error(error);
//     res.status(500).json(failed({ issue: error.message }));
//   }
// };

export const completeBooking = async (
  req: IAuthRequest<null, { bookingId: string }, { adminConsent: string }>,
  res
) => {
  try {
    const { bookingId } = req.params;
    const adminConsent =
      req.query.adminConsent === "true" &&
      req.user.userType.includes(UserType.SUPER_ADMIN);

    const bookingData = await Booking.findById(bookingId).populate("service");
    const latestInvoice = await Invoice.findOne(
      { booking: bookingId },
      {
        _id: 1,
      }
    ).sort({
      createdAt: -1,
    });

    if (!bookingData) {
      return res.status(404).json(failed({ issue: "Booking not found" }));
    }

    if (!adminConsent && bookingData.date.mode === BookingType.ONE_TIME) {
      const history = await ServiceHistory.find({ booking: bookingId });
      if (history.length > 0) {
        let status = 400;
        if (req.user.userType.includes(UserType.SUPER_ADMIN)) {
          status = 403;
        }
        return res
          .status(status)
          .json(failed({ issue: "Service already completed!" }));
      } else {
        await Booking.findOneAndUpdate(
          { _id: bookingId },
          {
            status: BookingStatus.COMPLETED,
          }
        );
      }
    } else {
      if (bookingData.date.end && bookingData.date.end.getTime() > Date.now()) {
        return res.status(400).json(failed({ issue: "Request has been end!" }));
      } else if (!adminConsent) {
        if (bookingData.date.mode === BookingType.MONTHLY) {
          const history = await ServiceHistory.find({
            booking: bookingId,
            date: {
              $gte: startOfThisMonth(),
              $lte: endOfThisMonth(),
            },
          });
          if (history.length > 0) {
            let status = 400;
            if (req.user.userType.includes(UserType.SUPER_ADMIN)) {
              status = 403;
            }
            return res.status(status).json(
              failed({
                issue: "Service already completed for this month!",
              })
            );
          }
        } else if (bookingData.date.mode === BookingType.WEEKLY) {
          const history = await ServiceHistory.find({
            booking: bookingId,
            date: {
              $gte: startOfThisWeek(),
              $lte: endOfThisWeek(),
            },
          });
          if (history.length > 0) {
            let status = 400;
            if (req.user.userType.includes(UserType.SUPER_ADMIN)) {
              status = 403;
            }
            return res.status(status).json(
              failed({
                issue: "Servcie already completed for this week!",
              })
            );
          }
        } else if (bookingData.date.mode === BookingType.BI_WEEKLY) {
          const history = await ServiceHistory.find({ booking: bookingId })
            .sort({
              date: -1,
            })
            .limit(1);
          if (history.length > 0) {
            const diff = diffInDays(history[0].date, new Date());
            if (diff < 14) {
              let status = 400;
              if (req.user.userType.includes(UserType.SUPER_ADMIN)) {
                status = 403;
              }
              return res.status(status).json(
                failed({
                  issue: "The service will be active in" + (14 - diff) + "days",
                })
              );
            }
          }
        }
      }
    }

    try {
      if (!bookingData.price.acceptedByUser) {
        return res
          .status(400)
          .json(failed({ issue: "Booking price is not accepted by the user" }));
      }

      const serviceHistory = await ServiceHistory.find({
        booking: bookingId,
        invoice: latestInvoice._id.toString(),
      });

      if (serviceHistory.length > 0) {
        return res.status(400).json(
          failed({
            issue:
              "Service already completed for this invoice! Create a new one.",
          })
        );
      }

      const paymentInfo = await PaymentInfo.findOne({
        user: bookingData.user,
      });

      const stripeCustomer = (await stripe.customers.retrieve(
        paymentInfo.stripeCustomerId
      )) as Stripe.Customer;
      const paymentMethod =
        stripeCustomer.invoice_settings.default_payment_method.toString();

      const paymentIntent = await stripe.paymentIntents.create({
        amount: +bookingData.price.amount * 100,
        currency: "usd",
        customer: paymentInfo.stripeCustomerId,
        payment_method: paymentMethod,
        off_session: true,
        confirm: true,
      });

      const newMessage = {
        title: bookingData.service.title,
        link: AppLinks.message(bookingId),
        type: NotificationType.BOOKING,
        ref: bookingId,
        booking: bookingId,
        message: "Service completed!",
        receiver: bookingData.user,
        sender: req.user._id,
      };
      emitNotificationMessage(bookingId, newMessage);

      const confirmServiceCompletion = new ServiceHistory({
        booking: bookingId,
        invoice: latestInvoice._id.toString(),
        date: new Date(),
        price: bookingData.price.amount,
        paidOn: paymentIntent.status === "succeeded" ? new Date() : null,
        paymentIntentId:
          paymentIntent.status === "succeeded" ? paymentIntent.id : null,
      });

      await confirmServiceCompletion.save();

      res.status(201).json(success({ message: "Request confirmed!" }));
    } catch (error) {
      return res.status(500).json(failed({ issue: error.message }));
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const handleBooking = async (
  req: IAuthRequest<null, { bookingId: string; status: BookingStatus }>,
  res,
  next
) => {
  try {
    const { bookingId, status } = req.params;

    const booking = await Booking.findById(bookingId);

    if (booking.status === BookingStatus.COMPLETED) {
      return res
        .status(400)
        .json(failed({ issue: "Can't update completed booking!" }));
    }

    if (![BookingStatus.ACCEPTED, BookingStatus.REJECTED].includes(status)) {
      return res.status(400).json(failed({ issue: "Invalid status" }));
    }
    const confirmBooking = await Booking.findOneAndUpdate(
      { _id: bookingId },
      {
        status,
      },
      { new: true }
    ).populate("service");

    let message = "You have an update on your booking!";

    if (status === BookingStatus.ACCEPTED) {
      message = "Request has been accepted!";
    } else if (status === BookingStatus.REJECTED) {
      message = "Request has been rejected!";
    }

    const newMessage = {
      title: confirmBooking.service.title,
      link: AppLinks.message(bookingId),
      type: NotificationType.BOOKING,
      ref: bookingId,
      booking: bookingId,
      message,
      receiver: confirmBooking.user,
      sender: req.user._id,
    };
    emitNotificationMessage(bookingId, newMessage);
    res.status(201).json(success({ message: `Request updated!` }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const setBookingPrice = async (
  req: IAuthRequest<SetBookingPriceDTO, { bookingId: string }>,
  res,
  next
) => {
  try {
    const { bookingId } = req.params;
    const { price } = req.body;

    const booking = await Booking.findById(bookingId).populate("service");

    if (price > 0) {
      await Booking.findOneAndUpdate(
        { _id: bookingId },
        {
          price: {
            amount: price,
            acceptedByProvider: true,
          },
        }
      );
    } else {
      return res.status(400).json(failed({ issue: "Invalid price" }));
    }

    const newMessage = {
      title: booking.service.title,
      link: AppLinks.chatOptions(bookingId),
      type: NotificationType.BOOKING,
      ref: bookingId,
      booking: bookingId,
      message:
        "Provider has set the price for your booking! Please check it out!",
      receiver: booking.user,
      sender: req.user._id,
    };
    emitNotificationMessage(bookingId, newMessage);
    res.status(201).json(success({ message: `Service price added!` }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};
