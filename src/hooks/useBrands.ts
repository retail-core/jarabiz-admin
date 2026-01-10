import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export interface Brand {
  id: string;
  name: string;
  symbol: string;
}

export function useBrands() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { data } = await api.get('/product/v1/brands');
      return data.items as Brand[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newBrand: { name: string; symbol: string }) => {
      return await api.post('/product/v1/brands', newBrand);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success("Brand created!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name, symbol }: { id: string; name: string; symbol: string }) => {
      return await api.put(`/product/v1/brands/${id}`, { name, symbol });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success("Brand updated!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/product/v1/brands/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success("Brand deleted!");
    },
  });

  return { ...query, createMutation, updateMutation, deleteMutation };
}