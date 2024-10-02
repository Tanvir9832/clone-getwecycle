import { DTO } from ".";
import {
  IInvoice,
  IInvoiceModel,
  IService,
  IServiceHistoryModel,
  InvoiceBreakDown,
} from "../models";
import { BookingStatus, IBooking, IBookingModel } from "../models/Booking";

export type BookServiceDTO = DTO<
  IBooking,
  {
    location: string;
    provider?: string;
    date: string;
    images: File[];
    priceInputs: string;
  }
>;

export type CreateInvoice = DTO<
  IInvoice,
  {
    bookingId: string;
    invoiceId: string | undefined;
    breakdowns: InvoiceBreakDown[];
    discount: number;
  }
>;

export type GetConsumerBookingsDTO = DTO<
  IBookingModel,
  {
    _id: string;
    date: IBooking["date"];
    status: BookingStatus;
    service: {
      _id: string;
      title: string;
      description: string;
      cover: string;
    };
    provider: {
      _id: string;
      avatar: string;
      firstName: string;
      lastName: string;
    };
    location: IBooking["location"];
    priceInputs: IBooking["priceInputs"];
  }
>;

export type AcceptedBookingPrice = {
  payId: string;
};

export type GetSingleBookingsDTO = DTO<
  IBookingModel,
  {
    _id: string;
    date: IBooking["date"];
    status: BookingStatus;
    images: string[];
    user: {
      _id: string;
      email: string;
      avatar: string;
      firstName: string;
      lastName: string;
    };
    service: {
      _id: string;
      title: string;
      description: string;
      cover: string;
    };
    provider: {
      _id: string;
      avatar: string;
      firstName: string;
      lastName: string;
      email: string;
      location: string;
    };
    invoice: IInvoiceModel;
    totalInvoice: number;
    location: IBooking["location"];
    priceInputs: IBooking["priceInputs"];
    price: IBooking["price"];
  }
>;

export type GetProviderBookingsDTO = DTO<
  IBookingModel,
  {
    _id: string;
    date: IBooking["date"];
    status: BookingStatus;
    service: {
      _id?: string;
      title?: string;
      description?: string;
      cover?: string;
      priceInputs?: IService["priceInputs"];
    };
    user: {
      _id?: string;
      avatar?: string;
      username?: string;
    };
    location?: IBooking["location"];
    images?: [string];
    priceInputs?: IBooking["priceInputs"];
  }
>;

export type SetBookingPriceDTO = DTO<
  IBookingModel,
  {
    price: number;
  }
>;

export type SingleInvoiceDTO = DTO<
  IInvoiceModel,
  {
    _id: string;
    id: string;
    bookingId: string;
    breakdowns: InvoiceBreakDown[];
    discount: number;
    createdAt: string;
    updatedAt: string;
    total: number;
    serviceHistory: IServiceHistoryModel[];
  }
>;
