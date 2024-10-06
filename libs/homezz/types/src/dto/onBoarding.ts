import { DTO } from '.';
import { CompanyType, IOnBoardingModel, PaymentMethodType } from '../models/OnBoarding';


export type CreateOnBoardingDTO = DTO<IOnBoardingModel, {
    companyName: string,
    compnayType: CompanyType,
    numberOfEmployee: number,
    businessDocuments: string,
    payoutInformation: string,
    paymentMethod: PaymentMethodType
}>
