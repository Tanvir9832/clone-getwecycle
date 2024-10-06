import {
    CreateOnBoardingDTO,
    IRequest
} from '@tanbel/homezz/types';
import { failed, success } from '../utils/response';
import { logger } from '../middleware/logger/logger';
import OnBoarding from '../models/OnBoarding';

export const createOnBoarding = async (
    req: IRequest<CreateOnBoardingDTO>,
    res,
    next
) => {
    try {
        const { companyName, businessDocuments, compnayType, numberOfEmployee, paymentMethod, payoutInformation } = req.body;
        const result = new OnBoarding({
            companyName, businessDocuments, compnayType, numberOfEmployee, paymentMethod, payoutInformation
        }).save();
        res.status(201).json(success({ data: result }));
    } catch (error) {
        logger.error(error);
        res.status(500).json(failed({ issue: error.message }));
    }
};
