import {
  BookingType,
  CompletePaymentSetup,
  IAuthRequest,
  InitializePayment,
} from "@tanbel/homezz/types";
import { logger } from "../middleware/logger/logger";
import Booking from "../models/Booking";
import PaymentInfo from "../models/PaymentInfo";
import { failed, success } from "../utils/response";
import { stripe } from "../utils/stripe";
import type Stripe from "stripe";

export const getStripeSheetInfo = async (req: IAuthRequest, res, next) => {
  try {
    let customerId;

    const payInfo = await PaymentInfo.findOne({ user: req.user._id });

    if (payInfo) {
      customerId = payInfo.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: `${req.user.firstName} ${req.user.lastName}`,
      });
      const paymentInfo = new PaymentInfo({
        user: req.user._id,
        stripeCustomerId: customer.id,
      });
      await paymentInfo.save();
      customerId = customer.id;
    }

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customerId },
      { apiVersion: "2019-02-19" }
    );
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
    });

    res.json({
      setupIntent: setupIntent.client_secret,
      setupIntentId: setupIntent.id,
      ephemeralKey: ephemeralKey.secret,
      customer: customerId,
      publishableKey: process.env.STRIPE_PUBLIC_KEY,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const initializePayment = async (
  req: IAuthRequest<InitializePayment>,
  res,
  next
) => {
  try {
    let customerId;
    const { bookingId, amount } = req.body;

    const booking = await Booking.findById(bookingId);

    const payInfo = await PaymentInfo.findOne({ user: req.user._id });
    if (payInfo) {
      customerId = payInfo.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: `${req.user.firstName} ${req.user.lastName}`,
      });
      const paymentInfo = new PaymentInfo({
        user: req.user._id,
        stripeCustomerId: customer.id,
      });
      await paymentInfo.save();
      customerId = customer.id;
    }

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customerId },
      { apiVersion: "2019-02-19" }
    );

    if (booking.date.mode === BookingType.ONE_TIME) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: +amount * 100,
        currency: "usd",
        customer: customerId,
      });
      res.json({
        paymentIntentId: paymentIntent.id,
        paymentIntentSecret: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customerId,
        publishableKey: process.env.STRIPE_PUBLIC_KEY,
      });
    } else {
      // abandoned code for now (should be removed in future)

      //   let recurring: StripeSDK.PriceCreateParams.Recurring;
      //   if (booking.date.mode === BookingType.WEEKLY) {
      //     recurring = {
      //       interval: "week",
      //     };
      //   } else if (booking.date.mode === BookingType.MONTHLY) {
      //     recurring = {
      //       interval: "month",
      //     };
      //   } else if (booking.date.mode === BookingType.BI_WEEKLY) {
      //     recurring = {
      //       interval: "week",
      //       interval_count: 2,
      //     };
      //   }

      //   const price = await stripe.prices.create({
      //     unit_amount: amount * 100,
      //     currency: "usd",
      //     recurring,
      //     product: process.env.HOMEZZ_PRODUCT_ID,
      //   });

      //   const subscription = await stripe.subscriptions.create({
      //     customer: customerId,
      //     items: [
      //       {
      //         price: price.id,
      //       },
      //     ],
      //     payment_behavior: "default_incomplete",
      //     expand: ["latest_invoice.payment_intent"],
      //   });

      //   const invoice = subscription.latest_invoice as StripeSDK.Invoice;
      //   if (invoice.payment_intent) {
      //     const intent = invoice.payment_intent as StripeSDK.PaymentIntent;
      //     res.json({
      //       paymentIntentId: subscription.id,
      //       paymentIntentSecret: intent.client_secret,
      //       ephemeralKey: ephemeralKey.secret,
      //       customer: customerId,
      //       publishableKey: process.env.STRIPE_PUBLIC_KEY,
      //     });
      //   } else {
      //     res.status(500).json(failed({ issue: "Payment intent not found" }));
      //   }

      // abandoned code for now (not used)
      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
      });

      res.json({
        setupIntentId: setupIntent.id,
        setupIntent: setupIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customerId,
        publishableKey: process.env.STRIPE_PUBLIC_KEY,
      });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};

export const completepaymentSetup = async (
  req: IAuthRequest<CompletePaymentSetup>,
  res,
  next
) => {
  try {
    const { setupIntentId, paymentIntentId } = req.body;

    let intent: Stripe.Response<Stripe.PaymentIntent | Stripe.SetupIntent>;

    if (setupIntentId) {
      intent = await stripe.setupIntents.retrieve(setupIntentId);
    } else {
      intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    }

    const customer = await stripe.customers.update(<string>intent.customer, {
      invoice_settings: {
        default_payment_method: <string>intent.payment_method,
      },
    });

    res.json(success({ message: "Payment setup completed" }));
  } catch (error) {
    logger.error(error);
    res.status(500).json(failed({ issue: error.message }));
  }
};
