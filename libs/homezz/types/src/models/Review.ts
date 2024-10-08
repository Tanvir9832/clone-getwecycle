import { IServiceModel } from "./Service";
import { Document } from "mongoose";
import { IUserModel } from "./User";

export interface IReview {
    reviewer: IUserModel,
    rating: number,
    review: string,
    service: IServiceModel,
    provider: IUserModel,
}

export interface IReviewModel extends IReview, Document { }