import {
  AcceptedBookingPrice,
  BookServiceDTO,
  BookingPriceStatus,
  BookingStatus,
  BookingType,
  CreateInvoice,
  GetConsumerBookingsDTO,
  GetSingleBookingsDTO,
  IAuthRequest,
  IFileRequest,
  IRequest,
  NotificationType,
  Select,
  UserType,
} from "@tanbel/homezz/types";
import { AppLinks, invoiceTemplate } from "@tanbel/homezz/utils";
import { PipelineStage, Types } from "mongoose";
import puppeteer from "puppeteer";
import { emitNotificationMessage } from "../listeners";
import { logger } from "../middleware/logger/logger";
import Booking from "../models/Booking";
import Invoice from "../models/Invoice";
import Service from "../models/Service";
import ServiceHistory from "../models/ServiceHistory";
import User from "../models/User";
import { createNotification } from "../utils/create-notification";
import { uploadImage } from "../utils/file";
import { failed, success } from "../utils/response";
import { stripe } from "../utils/stripe";

export const bookService = async (
  req: IFileRequest<BookServiceDTO, { id: string }>,
  res
) => {
  try {
    const { id } = req.params;
    const images = req.files?.images;
    const userId = req.user._id;
    const { date, location, priceInputs } = req.body;
    const imageUrls = [];

    try {
      if (images) {
        if (Array.isArray(images)) {
          await Promise.all(
            images.map(async (image) => {
              const { secure_url } = await uploadImage(image);
              imageUrls.push(secure_url);
            })
          );
        } else {
          const { secure_url } = await uploadImage(images);
          imageUrls.push(secure_url);
        }
      }
    } catch (error) {
      logger.error(error);
      return res.status(500).json(failed({ issue: error.message }));
    }

    const superUser = await User.findOne({
      userType: UserType.SUPER_ADMIN,
    });

    const newBooking = new Booking({
      service: id,
      provider: superUser._id,
      status: BookingStatus.PENDING,
      user: userId,
      date: JSON.parse(date as string),
      images: imageUrls,
      location: JSON.parse(location as string),
      priceInputs: JSON.parse(priceInputs as string),
    });

    const booking = await newBooking.save();

    const service = await Service.findById(id);

    createNotification({
      title: service.title,
      body: "You have a new Request!",
      userId: superUser._id,
      link: AppLinks.order(),
      ref: booking._id,
      type: NotificationType.BOOKING,
    });

    return res.status(200).json(success({ data: booking }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

type Filter = {
  limit?: number;
  skip?: number;
  tab?: number;
};

export const getMyBookings = async (req: IAuthRequest, res, next) => {
  try {
    const id = req.user._id;
    const { limit, skip, tab }: Filter = req.query;

    const SelectBookingsDTO: Select<GetConsumerBookingsDTO> = {
      _id: 1,
      date: 1,
      location: {
        name: 1,
      },
      service: {
        _id: 1,
        title: 1,
        cover: 1,
      },
      provider: {
        _id: 1,
        avatar: 1,
        firstName: 1,
        lastName: 1,
      },
      priceInputs: 1,
      status: 1,
    };

    const pipeline: PipelineStage[] = [
      {
        $match: {
          status: tab,
          user: new Types.ObjectId(id),
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
          localField: "provider",
          foreignField: "_id",
          as: "provider",
        },
      },
      { $unwind: "$provider" },
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
    ];

    const services = await Booking.aggregate(pipeline);
    res.status(201).json(success({ data: services }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const getSingleBooking = async (
  req: IRequest<null, { bookingId: string }>,
  res,
  next
) => {
  try {
    const { bookingId } = req.params;

    const services = await Booking.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(bookingId),
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
          localField: "provider",
          foreignField: "_id",
          as: "provider",
        },
      },
      { $unwind: "$provider" },
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
        $project: {
          _id: 1,
          date: 1,
          location: {
            name: 1,
          },
          service: {
            _id: 1,
            title: 1,
            cover: 1,
            description: 1,
          },
          provider: {
            _id: 1,
            avatar: 1,
            firstName: 1,
            email: 1,
            lastName: 1,
            location: 1,
          },
          user: {
            _id: 1,
            avatar: 1,
            firstName: 1,
            email: 1,
            lastName: 1,
          },
          images: 1,
          priceInputs: 1,
          status: 1,
          price: 1,
        } as Select<GetSingleBookingsDTO>,
      },
    ]);

    const totalInvoice = await Invoice.countDocuments({ booking: bookingId });
    const latestInvoice = await Invoice.findOne({ booking: bookingId }).sort({
      createdAt: -1,
    });

    const data: GetSingleBookingsDTO = {
      ...services?.[0],
      invoice: latestInvoice,
      totalInvoice,
    };

    res.status(201).json(success({ data }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const getSingleBookingInvoice = async (
  req: IRequest<null, { invoiceId: string }>,
  res
) => {
  try {
    const { invoiceId } = req.params;

    const invoice = await Invoice.findById(invoiceId);
    const booking = await Booking.findById(invoice.booking._id).populate(
      "service user"
    );

    const serviceHistory = await ServiceHistory.findOne(
      {
        booking: booking._id,
        date: { $gte: (invoice as any).createdAt },
      },
      {
        date: 1,
      }
    ).sort({ createdAt: 1 });

    const invoiceHTML = invoiceTemplate({
      user: {
        name: booking.user?.firstName + " " + booking.user?.lastName,
        address: booking.location?.name,
        email: booking.user?.email,
      },
      service: {
        name: booking.service?.title,
        completionDate: serviceHistory?.date,
      },
      invoice: {
        id: invoice._id.toString(),
        createdAt: (invoice as any).createdAt,
        priceInput: invoice.breakdowns,
      },
      discount: invoice.discount,
    });

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();

    await page.setContent(invoiceHTML, {
      waitUntil: "load",
    });

    const buffer = await page.pdf({
      format: "A4",
    });

    // const u8 = new Uint8Array(buffer);
    // const b64 = Buffer.from(u8).toString('base64');

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    // res.setHeader('Content-Disposition', 'attachment; filename="invoice.pdf"');
    res.send(buffer);
  } catch (error) {
    console.log(error);
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const getAllInvoices = async (
  req: IRequest<null, { bookingId: string }>,
  res
) => {
  try {
    const { bookingId } = req.params;
    const invoices = await Invoice.aggregate([
      {
        $match: {
          booking: new Types.ObjectId(bookingId),
        },
      },
      {
        $lookup: {
          from: "servicehistories",
          localField: "_id",
          foreignField: "invoice",
          as: "serviceHistory",
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    const invoicesWithTotal = await Promise.all(
      invoices.map(async (invoice) => {
        const total = invoice.breakdowns.reduce(
          (acc, cur) => acc + +cur.quantity * +cur.unitPrice,
          0
        );
        return {
          ...invoice,
          total: total - +invoice.discount,
        };
      })
    );

    return res.status(200).json(success({ data: invoicesWithTotal }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const createBookingInvoice = async (
  req: IAuthRequest<CreateInvoice>,
  res
) => {
  try {
    const { bookingId, breakdowns, discount } = req.body;

    const invoice = await Invoice.create({
      booking: bookingId,
      breakdowns,
      discount,
    });

    const totalPrice =
      breakdowns.reduce((acc, cur) => acc + +cur.quantity * +cur.unitPrice, 0) -
      +discount;

    await Booking.findOneAndUpdate(
      { _id: bookingId },
      {
        price: {
          amount: totalPrice,
          acceptedByProvider: true,
        },
      }
    );

    const bookingData = await Booking.findById(bookingId).populate("service");

    const message = {
      title: bookingData.service.title,
      link: AppLinks.chatOptions(bookingId),
      ref: bookingId,
      booking: bookingId,
      message: "Provider has created a invoice!",
      receiver: bookingData.user,
      sender: bookingData.provider,
      type: NotificationType.BOOKING,
    };
    emitNotificationMessage(bookingId, message);

    res.status(201).json(success({ data: invoice }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const updateBookingInvoice = async (
  req: IAuthRequest<CreateInvoice>,
  res,
  next
) => {
  try {
    const { bookingId, invoiceId, breakdowns, discount } = req.body;

    if (!invoiceId) {
      return res.status(400).json(failed({ issue: "Invalid invoice id!" }));
    }

    const invoice = await Invoice.findOneAndUpdate(
      {
        _id: invoiceId,
      },
      {
        breakdowns,
        discount,
      }
    );

    const totalPrice =
      breakdowns.reduce((acc, cur) => acc + +cur.quantity * +cur.unitPrice, 0) -
      +discount;

    await Booking.findOneAndUpdate(
      { _id: bookingId },
      {
        price: {
          amount: totalPrice,
          acceptedByProvider: true,
        },
      }
    );

    const bookingData = await Booking.findById(bookingId).populate("service");

    const message = {
      title: bookingData.service.title,
      link: AppLinks.chatOptions(bookingId),
      ref: bookingId,
      booking: bookingId,
      message: "Provider has updated the invoice!",
      receiver: bookingData.user,
      sender: bookingData.provider,
      type: NotificationType.BOOKING,
    };
    emitNotificationMessage(bookingId, message);

    res.status(201).json(success({ data: invoice }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const handleBookingPrice = async (
  req: IAuthRequest<
    AcceptedBookingPrice,
    { bookingId: string; status: string }
  >,
  res,
  next
) => {
  try {
    const { bookingId, status } = req.params;
    const userId = req.user._id;

    if (status === BookingPriceStatus.ACCEPTED) {
      const payId = req.body.payId;
      const bookingData = await Booking.findOneAndUpdate(
        { _id: bookingId },
        {
          payId,
          "price.acceptedByUser": true,
        },
        { new: true }
      ).populate("service");

      const message = {
        title: bookingData.service.title,
        link: AppLinks.chatOptions(bookingId),
        ref: bookingData._id.toString(),
        booking: bookingId,
        message: "User has accepted the price!",
        receiver: bookingData.provider,
        sender: userId,
        type: NotificationType.BOOKING,
      };
      emitNotificationMessage(bookingId, message);
      res.status(201).json(success({ message: `Request price accepted!` }));
    } else if (status === BookingPriceStatus.REJECTED) {
      const bookingData = await Booking.findOneAndUpdate(
        { _id: bookingId },
        {
          status: BookingStatus.CANCELLED,
        }
      ).populate("service");

      const message = {
        title: bookingData.service.title,
        link: AppLinks.chatOptions(bookingId),
        ref: bookingData._id.toString(),
        booking: bookingId,
        message: "User has rejected the price!",
        receiver: bookingData.provider,
        sender: userId,
        type: NotificationType.BOOKING,
      };
      emitNotificationMessage(bookingId, message);
      res.status(201).json(success({ message: `Request price rejected!` }));
    } else {
      res.status(400).json(failed({ issue: `Invalid status!` }));
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const handleBookingStatus = async (
  req: IAuthRequest<null, { bookingId: string; status: string }>,
  res,
  next
) => {
  try {
    const { bookingId, status } = req.params;
    const userId = req.user._id;

    if (status === BookingStatus.PAUSED) {
      const bookingData = await Booking.findOneAndUpdate(
        { _id: bookingId },
        {
          status: BookingStatus.PAUSED,
        },
        { new: true }
      );

      if (bookingData.date.mode === BookingType.ONE_TIME) {
        return res
          .status(400)
          .json(failed({ issue: `You can't pause one time booking!` }));
      }

      await stripe.subscriptions.update(bookingData.payId, {
        pause_collection: {
          behavior: "void",
        },
      });

      const newMessage = {
        title: bookingData.service.title,
        link: AppLinks.message(bookingId),
        type: NotificationType.BOOKING,
        ref: bookingId,
        booking: bookingId,
        message: "User has paused the booking!",
        receiver: bookingData.provider,
        sender: userId,
      };
      emitNotificationMessage(bookingId, newMessage);
      res
        .status(200)
        .json(success({ message: `You have paused the booking!` }));
    } else if (status === BookingPriceStatus.ACCEPTED) {
      const bookingData = await Booking.findOneAndUpdate(
        { _id: bookingId },
        {
          status: BookingStatus.ACCEPTED,
        },
        { new: true }
      );

      if (bookingData.date.mode === BookingType.ONE_TIME) {
        return res
          .status(400)
          .json(failed({ issue: `You can't pause one time booking!` }));
      }

      await stripe.subscriptions.update(bookingData.payId, {
        pause_collection: "",
      });

      const newMessage = {
        title: bookingData.service.title,
        link: AppLinks.message(bookingId),
        type: NotificationType.BOOKING,
        ref: bookingId,
        booking: bookingId,
        message: "User has reactivated the booking!",
        receiver: bookingData.provider,
        sender: userId,
      };
      emitNotificationMessage(bookingId, newMessage);
      res
        .status(200)
        .json(success({ message: `You have resumed the booking!` }));
    } else {
      res.status(400).json(failed({ issue: `Invalid status!` }));
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};
