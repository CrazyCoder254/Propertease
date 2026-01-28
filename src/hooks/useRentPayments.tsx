import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface RentPayment {
  id: string;
  tenant_id: string | null;
  property_id: string;
  amount: number;
  due_date: string;
  paid_date: string | null;
  status: 'paid' | 'pending' | 'overdue';
  month: string;
  landlord_id: string;
  created_at: string;
  updated_at: string;
}

export interface RentPaymentInsert {
  tenant_id?: string;
  property_id: string;
  amount: number;
  due_date: string;
  paid_date?: string;
  status: 'paid' | 'pending' | 'overdue';
  month: string;
}

export function useRentPayments() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: rentPayments = [], isLoading, error } = useQuery({
    queryKey: ['rent-payments', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rent_payments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as RentPayment[];
    },
    enabled: !!user,
  });

  const addPayment = useMutation({
    mutationFn: async (payment: RentPaymentInsert) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('rent_payments')
        .insert({
          ...payment,
          landlord_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rent-payments'] });
      toast.success('Payment recorded successfully!');
    },
    onError: (error) => {
      toast.error('Failed to record payment: ' + error.message);
    },
  });

  const updatePayment = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<RentPayment> & { id: string }) => {
      const { data, error } = await supabase
        .from('rent_payments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rent-payments'] });
      toast.success('Payment updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update payment: ' + error.message);
    },
  });

  const deletePayment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('rent_payments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rent-payments'] });
      toast.success('Payment deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete payment: ' + error.message);
    },
  });

  // Calculate stats
  const stats = {
    totalCollected: rentPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + Number(p.amount), 0),
    pendingRent: rentPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.amount), 0),
    overdueRent: rentPayments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + Number(p.amount), 0),
  };

  return {
    rentPayments,
    isLoading,
    error,
    addPayment,
    updatePayment,
    deletePayment,
    stats,
  };
}
