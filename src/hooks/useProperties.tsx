import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Property {
  id: string;
  name: string;
  address: string;
  type: 'apartment' | 'house' | 'condo' | 'commercial';
  units: number;
  rent_amount: number;
  status: 'occupied' | 'vacant' | 'maintenance';
  landlord_id: string;
  tenant_id: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyInsert {
  name: string;
  address: string;
  type: 'apartment' | 'house' | 'condo' | 'commercial';
  units: number;
  rent_amount: number;
  status: 'occupied' | 'vacant' | 'maintenance';
}

export function useProperties() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: properties = [], isLoading, error } = useQuery({
    queryKey: ['properties', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Property[];
    },
    enabled: !!user,
  });

  const addProperty = useMutation({
    mutationFn: async (property: PropertyInsert) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('properties')
        .insert({
          ...property,
          landlord_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property added successfully!');
    },
    onError: (error) => {
      toast.error('Failed to add property: ' + error.message);
    },
  });

  const updateProperty = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Property> & { id: string }) => {
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update property: ' + error.message);
    },
  });

  const deleteProperty = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete property: ' + error.message);
    },
  });

  return {
    properties,
    isLoading,
    error,
    addProperty,
    updateProperty,
    deleteProperty,
  };
}
