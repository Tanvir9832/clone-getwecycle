export type UpdateFcmTokenDTO = {
    fcmToken: string,
}

export type GetAppStateDTO = {
    unseenMessages: number,
    unseenNotifications: number,
}

export type EmailSupportDTO = {
    email: string,
    name: string,
    message: string,
}