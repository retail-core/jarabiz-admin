import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Manufacturer {
  id: string;
  name: string;
  website: string;
  symbol: string | null;
  nafdac_regno: string;
}

export function useManufacturers() {
  return useQuery({
    queryKey: ['manufacturers'],
    queryFn: async () => {
      const { data } = await api.get('/product/v1/manufacturers');
      return data.items as Manufacturer[];
    },
  });
}