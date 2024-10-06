import { CompanyType, IOnBoardingModel, PaymentMethodType } from '@tanbel/homezz/types';
import { Schema, model } from 'mongoose';

const onBoardingSchema = new Schema<IOnBoardingModel>(
    {
        companyName: {
            type: String,
            trim: true
        },
        compnayType: {
            type: String,
            enum: CompanyType,
            default: CompanyType.B2C
        },

        numberOfEmployee: Number,
        businessDocuments: {
            type: String,
            trim: true,
        },
        payoutInformation: {
            type: String,
            trim: true
        },
        paymentMethod: {
            type: String,
            enum: PaymentMethodType,
            default: PaymentMethodType.ONLINE
        }

    },
    {
        timestamps: true,
    }
);

const OnBoarding = model<IOnBoardingModel>('OnBoarding', onBoardingSchema);

export default OnBoarding;

