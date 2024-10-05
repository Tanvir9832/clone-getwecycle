import router from "express"
import { userAuthorization } from "../../middleware/authorization";
import adminServiceRouter from "./service";
import adminCategoryRouter from "./category";
import adminRequestRouter from "./request";
import adminProviderRouter from "./provider";
import adminProviderRequestRouter from "./providerRequest";
import adminDashboardRouter from "./dashboard";
import { roleCheck } from "../../middleware/roleCheck";

const adminRouter = router.Router();

adminRouter.use("/", userAuthorization, roleCheck, adminServiceRouter);
adminRouter.use("/", userAuthorization, roleCheck, adminCategoryRouter);
adminRouter.use("/", userAuthorization, roleCheck, adminRequestRouter);
adminRouter.use("/", userAuthorization, roleCheck, adminProviderRouter);
adminRouter.use("/", userAuthorization, roleCheck, adminProviderRequestRouter);
adminRouter.use("/", userAuthorization, roleCheck, adminDashboardRouter);

export default adminRouter;
