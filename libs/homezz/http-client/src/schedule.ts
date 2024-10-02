import {
  CreateScheduleDTO,
  GetScheduleDTO,
  GetScheduleHistoryDTO,
  SendScheduleDTO,
} from '@tanbel/homezz/types';
import $api from './client';

export const get_all_schedule = (): Promise<GetScheduleDTO[]> => {
  return $api.get('/schedule');
};

export const get_schedule_history = (): Promise<GetScheduleHistoryDTO[]> => {
  return $api.get('/schedule-history');
};

export const get_my_schedules = (): Promise<GetScheduleDTO[]> => {
  return $api.get('/total-schedule');
};

export const get_single_schedule = (id: string): Promise<GetScheduleDTO> => {
  return $api.get(`/schedule/${id}`);
};

export const delete_schedule = (id: string): Promise<GetScheduleDTO> => {
  return $api.delete(`/schedule/${id}`);
};

export const edit_schedule = (
  id: string,
  data: CreateScheduleDTO
): Promise<GetScheduleDTO> => {
  return $api.put(`/schedule/${id}`, data);
};

export const create_schedule = (
  data: CreateScheduleDTO
): Promise<GetScheduleDTO> => {
  return $api.post(`/schedule/`, data);
};
export const update_schedule = (
  data: CreateScheduleDTO,
  selectedScheduleId: string
): Promise<GetScheduleDTO> => {
  return $api.put(`/schedule/${selectedScheduleId}`, data);
};

export const send_schedule = (
  data: SendScheduleDTO | null | {}
): Promise<SendScheduleDTO> => {
  return $api.post(`/schedule-send/`, data);
};
