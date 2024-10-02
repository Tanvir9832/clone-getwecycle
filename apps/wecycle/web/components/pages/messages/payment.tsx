import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import {
  accept_booking_price,
  get_stripe_sheet_info,
} from "@tanbel/homezz/http-client";
import {
  GetStripeCardSheetInfo,
  InitializePayment,
} from "@tanbel/homezz/types";
import { Button } from "@tanbel/react-ui";
import { useEffect, useState } from "react";
import { usePayment } from "../../../hook/usePayment";

const stripePromise = loadStripe(
  process.env["NEXT_PUBLIC_STRIPE_PUBLIC_KEY"] || ""
);

type Props = InitializePayment & {
  notifyPaymentSuccess?: () => void;
};

type CheckoutFormProps = Props & {
  cardSheetData: GetStripeCardSheetInfo;
};

const CheckoutForm = (props: CheckoutFormProps) => {
  const { openPaySheet, loading } = usePayment(props);

  const handlePaySheet = () => {
    openPaySheet()
      .then((res) => {
        if (!res) {
          console.log("No response from openPaySheet");
          return;
        }
        accept_booking_price(props.bookingId, { payId: res.id })
          .then((res) => {
            if (res && props.notifyPaymentSuccess) {
              props.notifyPaymentSuccess();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <form
      className="flex flex-col h-full justify-center gap-6 max-w-md mx-auto"
      onSubmit={(e) => e.preventDefault()}
    >
      <h1 className="text-2xl font-bold">Payment</h1>
      <p className="text-sm text-gray-500">
        Please enter your card details to make the payment
      </p>
      {/* <CardElement /> */}
      <PaymentElement />
      <div className="flex items-center gap-2">
        <Button
          loading={loading}
          disabled={loading}
          onClick={handlePaySheet}
          className="w-full"
        >
          Pay Now
        </Button>
        {/* <Button
          type="dashed"
          loading={loading}
          disabled={loading}
          onClick={openCardSheet}
        >
          Save Card
        </Button> */}
      </div>
    </form>
  );
};

const StripeWrapper = (props: Props) => {
  const [loading, setLoading] = useState(true);
  const [cardSheetData, setCardSheetData] = useState<GetStripeCardSheetInfo>();

  useEffect(() => {
    const fetchCardSheetData = async () => {
      setLoading(true);
      try {
        const data = await get_stripe_sheet_info();
        setCardSheetData(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCardSheetData();
  }, []);

  if (!cardSheetData) {
    if (loading) {
      return <PaymentSkeletonLoader />;
    }
    return (
      <div className="flex flex-col h-full justify-center max-w-md mx-auto">
        <p className="text-danger text-center">
          Error loading payment form. Please try again later!
        </p>
      </div>
    );
  }

  const options: StripeElementsOptions = {
    clientSecret: cardSheetData.setupIntent,
    customerOptions: {
      customer: cardSheetData.customer,
      ephemeralKey: cardSheetData.ephemeralKey,
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm cardSheetData={cardSheetData} {...props} />
    </Elements>
  );
};

const PaymentSkeletonLoader = () => {
  return (
    <div className="flex flex-col h-full justify-center max-w-md mx-auto p-4">
      <div className="space-y-6 animate-pulse">
        {/* Payment Title */}
        <div className="h-6 bg-gray-300 rounded w-32"></div>

        {/* Instruction text */}
        <div className="h-4 bg-gray-300 rounded w-64"></div>

        {/* Card number input */}
        <div className="flex space-x-4">
          <div className="h-10 bg-gray-300 rounded w-full"></div>
          <div className="h-10 bg-gray-300 rounded w-12"></div>
        </div>

        {/* Expiration date and Security code */}
        <div className="flex space-x-4">
          <div className="h-10 bg-gray-300 rounded w-full"></div>
          <div className="h-10 bg-gray-300 rounded w-full"></div>
        </div>

        {/* Country select dropdown */}
        <div className="h-10 bg-gray-300 rounded w-full"></div>

        {/* Note under the form */}
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>

        {/* Pay Now button */}
        <div className="h-12 bg-gray-300 rounded w-full"></div>
      </div>
    </div>
  );
};

export { StripeWrapper as PaymentCheckoutForm };
