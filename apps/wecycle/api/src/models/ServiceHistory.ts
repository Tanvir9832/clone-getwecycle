import { IServiceHistory } from "@tanbel/homezz/types";
import { Schema, model } from "mongoose";

const serviceHistorySchema = new Schema<IServiceHistory>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    invoice: {
      type: Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    date: Date,
    price: {
      type: Number,
      required: true,
    },
    paidOn: {
      type: Date,
      default: null,
    },
    paymentIntentId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const ServiceHistory = model("ServiceHistory", serviceHistorySchema);

export default ServiceHistory;
