import { RRule } from "rrule";
import { Schedule } from "../models/Schedule";
import { endOfThisMonth, startOfThisMonth } from "@tanbel/utils";
import { pushNotification } from "../utils/push-notification";
import { AppLinks } from "@tanbel/homezz/utils";

export const watchSchedule = async () => {
    try {
        const schedule = await Schedule.aggregate([
            {
                $group: {
                    _id: "$user",
                    user: { $first: "$$ROOT" }
                }
            },
            {
                $replaceRoot: { newRoot: "$user" }
            }
        ])
        
        schedule.forEach((schedule) => {
            const rule = RRule.fromString(schedule.rule);
            
            const datesOfThisMonth = rule.between(
                startOfThisMonth(),
                endOfThisMonth()
            );

            if (datesOfThisMonth.length) {
                pushNotification({
                    title: 'Complete your schedules',
                    body: 'You have some schedules to complete this month',
                    userId: schedule.user,
                    link: AppLinks.schedules()
                })
            }
        });
    } catch (error) {
        console.log(error);
    }
}