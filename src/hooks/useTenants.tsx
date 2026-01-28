import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Tenant {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  property_id: string | null;
  move_in_date: string;
  lease_end: string;
  rent_status: 'paid' | 'pending' | 'overdue';
  avatar: string | null;
  landlord_id: string;
  created_at: string;
  updated_at: string;
}

export interface TenantInsert {
  name: string;
  email: string;
  phone?: string;
  property_id?: string;
  move_in_date: string;
  lease_end: string;
  rent_status: 'paid' | 'pending' | 'overdue';
}

export function useTenants() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: tenants = [], isLoading, error } = useQuery({
    queryKey: ['tenants', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Tenant[];
    },
    enabled: !!user,
  });

  const addTenant = useMutation({
    mutationFn: async (tenant: TenantInsert) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('tenants')
        .insert({
          ...tenant,
          landlord_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('Tenant added successfully!');
    },
    onError: (error) => {
      toast.error('Failed to add tenant: ' + error.message);
    },
  });

  const updateTenant = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Tenant> & { id: string }) => {
      const { data, error } = await supabase
        .from('tenants')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('Tenant updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update tenant: ' + error.message);
    },
  });

  const deleteTenant = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tenants')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('Tenant deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete tenant: ' + error.message);
    },
  });

  return {
    tenants,
    isLoading,
    error,
    addTenant,
    updateTenant,
    deleteTenant,
  };
}
