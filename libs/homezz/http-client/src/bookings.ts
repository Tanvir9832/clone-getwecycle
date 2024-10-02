import {
  AcceptedBookingPrice,
  BookServiceDTO,
  BookingPriceStatus,
  BookingStatus,
  CreateInvoice,
  GetConsumerBookingsDTO,
  GetSingleBookingsDTO,
  IInvoiceModel,
  SingleInvoiceDTO,
} from "@tanbel/homezz/types";
import $api from "./client";
import { toFormData } from "@tanbel/utils";

export const book_service = (
  id: string,
  data: BookServiceDTO
): Promise<string> => {
  const formData = toFormData<BookServiceDTO>(data, ["images"]);
  return $api.post(`/service/${id}/book`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const get_my_bookings = ({
  limit,
  skip,
  tab,
}: {
  tab?: string;
  skip?: number;
  limit?: number;
}): Promise<GetConsumerBookingsDTO[]> => {
  return $api.get(`/bookings`, { params: { skip, limit, tab } });
};

export const create_invoice = (data: CreateInvoice): Promise<IInvoiceModel> => {
  return $api.post(`/booking/invoice`, data);
};

export const update_invoice = (data: CreateInvoice): Promise<IInvoiceModel> => {
  return $api.put(`/booking/invoice`, data);
};

export const get_single_booking = (
  bookingId: string
): Promise<GetSingleBookingsDTO> => {
  return $api.get(`/booking/${bookingId}`);
};

export const get_invoices_by_booking = (
  bookingId: string
): Promise<SingleInvoiceDTO[]> => {
  return $api.get(`/booking/${bookingId}/invoices`);
};

export const accept_booking_price = (
  bookingId: string,
  data: AcceptedBookingPrice
): Promise<string> => {
  return $api.put(
    `/booking/${bookingId}/price/${BookingPriceStatus.ACCEPTED}`,
    data
  );
};

export const reject_booking_price = (bookingId: string): Promise<string> => {
  return $api.put(`/booking/${bookingId}/price/${BookingPriceStatus.REJECTED}`);
};

export const handle_booking_status = (
  bookingId: string,
  status: BookingStatus
): Promise<string> => {
  return $api.put(`/booking/${bookingId}/${status}`);
};
