import { Document } from "mongoose";
import { ICategoryModel } from "./Category";

export type PriceInputType = "number" | "select" | "radio";

export enum ServiceStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IPriceInputs {
  inputType: PriceInputType;
  name: string;
  label: string;
  unite: string;
  defaultValue: number;
  options: { value: string; label: string }[];
}

export interface IService {
  title: string;
  description: string;
  cover: string;
  category: ICategoryModel[];
  priceInputs: IPriceInputs[];
  status: ServiceStatus;
}

export interface IServiceModel extends IService, Document {}
