import { DashboardDataDTO } from '@tanbel/homezz/types';
import $api from '../client';

export const get_dashboard_data = ({
  tab,
}: {
  tab?: string;
}): Promise<DashboardDataDTO> => {
  return $api.get('/admin/dashboard', { params: { tab } });
};
