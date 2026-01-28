import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface MaintenanceRequest {
  id: string;
  property_id: string;
  tenant_id: string | null;
  requester_id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface MaintenanceInsert {
  property_id: string;
  tenant_id?: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
}

export function useMaintenance() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: maintenanceRequests = [], isLoading, error } = useQuery({
    queryKey: ['maintenance', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as MaintenanceRequest[];
    },
    enabled: !!user,
  });

  const addRequest = useMutation({
    mutationFn: async (request: MaintenanceInsert) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert({
          ...request,
          requester_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      toast.success('Maintenance request created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create request: ' + error.message);
    },
  });

  const updateRequest = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MaintenanceRequest> & { id: string }) => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      toast.success('Request updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update request: ' + error.message);
    },
  });

  const deleteRequest = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('maintenance_requests')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      toast.success('Request deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete request: ' + error.message);
    },
  });

  return {
    maintenanceRequests,
    isLoading,
    error,
    addRequest,
    updateRequest,
    deleteRequest,
  };
}
