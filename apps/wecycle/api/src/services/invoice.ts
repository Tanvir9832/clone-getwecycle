import {
  BookingType,
  IBookingModel,
  IInvoiceModel,
} from "@tanbel/homezz/types";
import {
  diffInDays,
  endOfThisMonth,
  endOfThisWeek,
  startOfThisMonth,
  startOfThisWeek,
} from "@tanbel/utils";
import Booking from "../models/Booking";
import Invoice from "../models/Invoice";
import ServiceHistory from "../models/ServiceHistory";
import { logger } from "../middleware/logger/logger";

type InvoiceData = IInvoiceModel & { createdAt: Date };

const createInvoice = async (
  bookingData: Pick<IBookingModel, "id" | "date">
) => {
  let lastInvoice: IInvoiceModel[] = [];
  try {
    if (bookingData.date.mode === BookingType.WEEKLY) {
      const last = (await Invoice.find({
        booking: bookingData.id,
      })
        .sort({
          createdAt: -1,
        })
        .limit(1)) as InvoiceData[];

      if (last.length > 0 && last[0].createdAt) {
        const diff = diffInDays(new Date(), last[0].createdAt);
        if (diff < 7) {
          return;
        } else {
          lastInvoice = last;
        }
      }
    } else if (bookingData.date.mode === BookingType.MONTHLY) {
      const last = (await Invoice.find({
        booking: bookingData.id,
      })
        .sort({
          createdAt: -1,
        })
        .limit(1)) as InvoiceData[];

      if (last.length > 0 && last[0].createdAt) {
        const diff = diffInDays(last[0].createdAt, new Date());
        if (diff < 30) {
          return;
        } else {
          lastInvoice = last;
        }
      }
    } else if (bookingData.date.mode === BookingType.BI_WEEKLY) {
      const last = (await Invoice.find({ booking: bookingData.id })
        .sort({
          createdAt: -1,
        })
        .limit(1)) as InvoiceData[];

      if (last.length > 0) {
        const diff = diffInDays(last[0].createdAt, new Date());
        if (diff < 14) {
          return;
        } else {
          lastInvoice = last;
        }
      }
    }

    if (!lastInvoice || lastInvoice.length === 0) return;

    const newInvoice = new Invoice({
      booking: bookingData.id,
      breakdowns: lastInvoice[0].breakdowns || [],
      discount: lastInvoice[0].discount || 0,
      accepted: lastInvoice[0].accepted || false,
    });

    await newInvoice.save();
    console.log("Invoice created successfully:", newInvoice.id);
  } catch (error) {
    console.error("Error creating invoice:", error);
  }
};

export const handleRecurrentInvoices = async () => {
  logger.info("Handling recurrent invoices...");
  try {
    const allRecurrentBookings = await Booking.find(
      {
        "date.mode": {
          $ne: BookingType.ONE_TIME,
        },
      },
      {
        date: 1,
      }
    );

    for (const bookingData of allRecurrentBookings) {
      if (!bookingData || bookingData.date.mode === BookingType.ONE_TIME)
        return;
      if (bookingData.date.end && bookingData.date.end.getTime() > Date.now()) {
        return;
      } else {
        if (bookingData.date.mode === BookingType.MONTHLY) {
          const history = await ServiceHistory.find({
            booking: bookingData.id,
            date: {
              $gte: startOfThisMonth(),
              $lte: endOfThisMonth(),
            },
          });
          if (history.length > 0) {
            return;
          }
        } else if (bookingData.date.mode === BookingType.WEEKLY) {
          const history = await ServiceHistory.find({
            booking: bookingData.id,
            date: {
              $gte: startOfThisWeek(),
              $lte: endOfThisWeek(),
            },
          });
          if (history.length > 0) {
            return;
          }
        } else if (bookingData.date.mode === BookingType.BI_WEEKLY) {
          const history = await ServiceHistory.find({ booking: bookingData.id })
            .sort({
              date: -1,
            })
            .limit(1);
          if (history.length > 0) {
            const diff = diffInDays(history[0].date, new Date());
            if (diff < 14) {
              return;
            }
          }
        }
        await createInvoice(bookingData);
      }
    }
  } catch (error) {
    console.error("Error handling recurrent invoices:", error);
  }
};
