import { failed } from "../../utils/response";

export const roleCheck = async (req, res, next) => {
    try {
        const user = req.user;
        let message = "";
        if (user.userType.includes('CUSTOMER_SERVICE')) {
            message = "Customer service users are restricted! ";
        } else {
            return next();
        }
        return res.status(401).json(failed({ issue: message }));
    } catch (error) {
        return next(error);
    }
};
