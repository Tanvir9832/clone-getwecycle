
/**
 *  !Company Information
    Business Documents
    Payment Information
 */

export enum CompanyType {
    B2B = 'B2B',
    B2C = 'B2C',
    B2E = 'B2E'
}
export enum PaymentMethodType {
    CASHONDELIVERY = "CASHONDELIVERY",
    ONLINE = "ONLINE"
}

export interface IOnBoarding {
  companyName : string,
  compnayType : CompanyType,
  numberOfEmployee : number,
  businessDocuments : string,
  payoutInformation : string,
  paymentMethod : PaymentMethodType
}

export interface IOnBoardingModel extends IOnBoarding, Document { }