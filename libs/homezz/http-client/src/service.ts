import { GetMultiServicesDTO, GetSingleServiceDTO } from "@tanbel/homezz/types";
import $api from "./client";

export const get_services = ({
  limit,
  skip,
}: {
  skip?: number;
  limit?: number;
} = {}): Promise<GetMultiServicesDTO[]> => {
  return $api.get("/services", { params: { skip, limit } });
};

export const get_service = (id: string): Promise<GetSingleServiceDTO> => {
  return $api.get("/service/" + id);
};
