import router from "express";
import {
  completeBooking,
  getAllBookings,
  handleBooking,
  setBookingPrice,
} from "../../controllers/provider/booking";
import { userAuthorization } from "../../middleware/authorization";

const providerBookingRouter = router.Router();

providerBookingRouter.get("/bookings", getAllBookings);
providerBookingRouter.post(
  "/booking/:bookingId/confirm",
  userAuthorization,
  completeBooking
);
providerBookingRouter.put("/booking/:bookingId/price", setBookingPrice);
providerBookingRouter.put("/booking/:bookingId/:status", handleBooking);

export default providerBookingRouter;
