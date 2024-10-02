import { EmailSupportDTO, GetAppStateDTO, UpdateFcmTokenDTO } from "@tanbel/homezz/types";
import $api from "./client";

export const update_fcm = (data: UpdateFcmTokenDTO): Promise<string> => {
    return $api.put('/settings/fcm', data);
}

export const get_app_state = (): Promise<GetAppStateDTO> => {
    return $api.get('/app/state');
}

export const send_support_email = (data: EmailSupportDTO) => {
    return $api.post('/contact', data);
}