import router from 'express';
import {
  createSchedule,
  getAllHistory,
  getMySchedules,
  getAllSchedule,
  completeSchedule,
  updateSchedule,
  deleteSchedule,
} from '../controllers/schedule';
import { userAuthorization } from '../middleware/authorization';

const scheduleRouter = router.Router();
scheduleRouter.get('/schedule', userAuthorization, getMySchedules);
scheduleRouter.get('/schedule-history/', userAuthorization, getAllHistory);
scheduleRouter.get('/total-schedule', userAuthorization, getAllSchedule);
scheduleRouter.post('/schedule', userAuthorization, createSchedule);
scheduleRouter.post('/schedule-send', userAuthorization, completeSchedule);
scheduleRouter.put('/schedule/:id', updateSchedule);
scheduleRouter.delete('/schedule/:id', deleteSchedule);

export default scheduleRouter;
