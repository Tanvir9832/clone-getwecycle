import {
  BookingStatus,
  GetProviderBookingsDTO,
  GetProviderServiceDTO,
  SetBookingPriceDTO,
} from "@tanbel/homezz/types";
import $api from "../client";

export const get_bookings = ({
  tab,
  skip,
  limit,
}: {
  tab?: string;
  skip?: number;
  limit?: number;
}): Promise<GetProviderBookingsDTO[]> => {
  return $api.get(`/provider/bookings`, { params: { tab, skip, limit } });
};

export const update_booking_status = (
  bookingId: string,
  status: BookingStatus
): Promise<GetProviderBookingsDTO> => {
  return $api.put(`/provider/booking/${bookingId}/${status}`);
};

export const complete_booking = (
  bookingId: string,
  adminConsent = false
): Promise<GetProviderBookingsDTO> => {
  return $api.post(
    `/provider/booking/${bookingId}/confirm?adminConsent=${adminConsent}`
  );
};

export const set_booking_price = (
  bookingId: string,
  data: SetBookingPriceDTO
): Promise<string> => {
  return $api.put(`/provider/booking/${bookingId}/price`, data);
};
