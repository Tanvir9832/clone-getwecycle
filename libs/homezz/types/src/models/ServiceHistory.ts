import { Document } from "mongoose";
import { IBookingModel } from "./Booking";
import { IInvoiceModel } from "./Invoice";

export interface IServiceHistory {
  booking: IBookingModel;
  invoice: IInvoiceModel;
  date: Date;
  price: number;
  paidOn: Date | null;
  paymentIntentId: string | null;
}

export interface IServiceHistoryModel extends IServiceHistory, Document {}
