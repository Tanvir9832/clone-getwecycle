import { IUser, IUserModel } from "@tanbel/homezz/types";

const requiredInfo: (keyof IUser)[] = [
    'firstName',
    'lastName',
    'location',
    'phone',
];

export const validateUserProfile = (user: IUserModel): boolean => {
    return requiredInfo.every((key) => !!user[key]);
}