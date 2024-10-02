import cron from "node-cron";

import { watchSchedule } from "./schedule";
import { logger } from "../middleware/logger/logger";
import { handleRecurrentInvoices } from "../services/invoice";

export const startJobs = () => {
  logger.info("Jobs started");
  cron.schedule("0 0 1 * *", function () {
    watchSchedule();
  });

  cron.schedule("0 0 0 * * *", function () {
    handleRecurrentInvoices();
  });
};
