export type GetStripeCardSheetInfo = {
  setupIntent: string;
  setupIntentId: string;
  ephemeralKey: string;
  customer: string;
  publishableKey: string;
};

export type GetStripePaySheetInfo = {
  paymentIntentId: string;
  paymentIntentSecret: string;
  ephemeralKey: string;
  customer: string;
  publishableKey: string;
};

export type InitializePayment = {
  bookingId: string;
  amount: number;
};

export type CompletePaymentSetup = {
  setupIntentId?: string;
  paymentIntentId?: string;
};
