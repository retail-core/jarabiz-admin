// src/hooks/useCategories.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/lib/api';
import { toast } from "sonner";

export interface Category {
  id: string;
  name: string;
}

export function useCategories() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/product/v1/categories');
      return data.items as Category[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newCategory: { name: string }) => {
      return await api.post('/product/v1/categories', newCategory);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Category created!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      return await api.put(`/product/v1/categories/${id}`, { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Category updated!");
    },
    onError: () => toast.error("Failed to update category"),
  });

  const deleteMutation = useMutation({
  mutationFn: async (id: string) => {
    return await api.delete(`/product/v1/categories/${id}`);
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
    toast.success("Category deleted successfully");
  },
  onError: (error: any) => {
    toast.error(error.response?.data?.message || "Failed to delete category");
  }
});

  return { ...query, createMutation, updateMutation, deleteMutation };
}