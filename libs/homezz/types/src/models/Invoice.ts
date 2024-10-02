import { Document } from "mongoose";
import { IBookingModel } from "./Booking";

export type InvoiceBreakDown = {
    description: string,
    quantity: number,
    unitPrice: number,
}

export interface IInvoice {
  booking: IBookingModel,
  breakdowns: InvoiceBreakDown[],
  discount: number,
  accepted: boolean,
}

export interface IInvoiceModel extends IInvoice, Document { }