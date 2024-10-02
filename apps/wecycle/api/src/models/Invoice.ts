import { IInvoice } from '@tanbel/homezz/types';
import { Schema, model } from 'mongoose';

const invoiceSchema = new Schema<IInvoice>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    breakdowns: [
      {
        description: String,
        quantity: Number,
        unitPrice: Number,
      }
    ],
    discount: {
      type: Number,
      default: 0,
    },
    accepted: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const Invoice = model('Invoice', invoiceSchema);

export default Invoice;
