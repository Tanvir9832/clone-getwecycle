import { CreateOnBoardingDTO } from "@tanbel/homezz/types";
import $api from "./client";

export const create_onBoarding = (data: CreateOnBoardingDTO): Promise<any> => {
    return $api.post('/onboarding', data);
};