import router from "express"
import { createOnBoarding } from "../controllers/onBoarding";
// import OnBoarding from "../models/OnBoarding";

const onBoardingRouter = router.Router();

onBoardingRouter.post("/onboarding", createOnBoarding);
// onBoardingRouter.get("/onboarding",async(req,res)=>{
//     const data = await OnBoarding.find();
//     res.json(data);
// })


export default onBoardingRouter;
