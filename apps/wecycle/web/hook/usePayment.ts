import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import {
  complete_payment_setup,
  initialize_payment_sheet_info,
} from "@tanbel/homezz/http-client";
import { GetStripeCardSheetInfo } from "@tanbel/homezz/types";
import { useRouter } from "next/router";
import { useState } from "react";

const usePayment = ({
  amount,
  bookingId,
  cardSheetData,
}: {
  amount: number;
  bookingId: string;
  cardSheetData: GetStripeCardSheetInfo;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const openCardSheet = async () => {
    if (!cardSheetData || !stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      const { customer, ephemeralKey, setupIntent, setupIntentId } =
        cardSheetData;

      const card = elements.getElement(CardElement);
      if (!card) {
        return;
      }

      const { error } = await stripe.confirmCardSetup(setupIntent, {
        payment_method: {
          card,
          billing_details: { name: "WeCycle" },
        },
      });

      if (error) {
        console.error(error);
        setLoading(false);
        throw error;
      }

      await complete_payment_setup({ setupIntentId });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const openPaySheet = async () => {
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      await elements.submit();

      const { paymentIntentSecret, paymentIntentId, ephemeralKey, customer } =
        await initialize_payment_sheet_info({
          amount,
          bookingId,
        });

      const { error } = await stripe.confirmPayment({
        elements: elements,
        clientSecret: paymentIntentSecret,
        confirmParams: {
          save_payment_method: true,
        },
        redirect: "if_required",
      });

      if (error) {
        console.error(error);
        throw error;
      }

      await complete_payment_setup({
        paymentIntentId,
      });

      return { id: paymentIntentId };
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    openCardSheet,
    openPaySheet,
    loading,
  };
};

export { usePayment };
