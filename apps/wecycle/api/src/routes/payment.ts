import router from "express";
import {
  completepaymentSetup,
  getStripeSheetInfo,
  initializePayment,
} from "../controllers/payment";
import { userAuthorization } from "../middleware/authorization";

const paymentRouter = router.Router();

paymentRouter.get(
  "/payment/stripe/cards",
  userAuthorization,
  getStripeSheetInfo
);
paymentRouter.post(
  "/payment/stripe/pay-init",
  userAuthorization,
  initializePayment
);
paymentRouter.post(
  "/payment/stripe/complete-setup",
  userAuthorization,
  completepaymentSetup
);

export default paymentRouter;
