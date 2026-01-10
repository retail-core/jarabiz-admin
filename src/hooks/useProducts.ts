import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export interface Product {
  id: string;
  name: string;
  barcode: string;
  brand: {id : string, name: string};
  category: {id : string, name: string} [];
  manufacturer: string | null;
  image_url: string;
  nafdac_regno: string | null;
}

export function useProducts() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await api.get('/product/v1/products');
      return data.items as Product[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await api.post('/product/v1/products', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success("Product created!");
    },
    onError: () => toast.error("Failed to create product"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      return await api.put(`/product/v1/products/${id}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success("Product updated!");
    },
    onError: () => toast.error("Failed to update product"),
  });

  return { ...query, createMutation, updateMutation };
}