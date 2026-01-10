import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export interface Unit {
  id: string;
  name: string;      // e.g., "Kilogram"
  abbreviation: string; // e.g., "kg"
}

export function useUnits() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['units'],
    queryFn: async () => {
      // Adjusted to your product v1 base path
      const { data } = await api.get('/product/v1/units');
      return data.items as Unit[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newUnit: { name: string; symbol: string }) => {
      return await api.post('/product/v1/units', newUnit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      toast.success('Unit created!');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name, symbol }: { id: string; name: string; symbol: string }) => {
      return await api.put(`/product/v1/units/${id}`, { name, symbol });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      toast.success('Unit updated!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/product/v1/units/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      toast.success('Unit deleted!');
    },
  });

  return { ...query, createMutation, updateMutation, deleteMutation };
}