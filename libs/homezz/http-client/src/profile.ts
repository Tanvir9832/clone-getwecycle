import { EditProfileDTO, IUserModel } from "@tanbel/homezz/types";
import $api from "./client";
import { toFormData } from "@tanbel/utils";

export const get_my_profile = () : Promise<IUserModel> => {
    return  $api.get('/profile/me');
}

export const edit_profile = (data: EditProfileDTO) : Promise<IUserModel> => {
    const formData = toFormData<EditProfileDTO>(data, ["avatar"])
    return  $api.put('/profile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}