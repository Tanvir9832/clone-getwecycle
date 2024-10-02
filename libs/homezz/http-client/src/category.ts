import { GetCategoryDTO } from "@tanbel/homezz/types";
import $api from "./client";

export const get_categories = () : Promise<GetCategoryDTO[]> => {
    return  $api.get('/categories');
}