import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Property } from '@/hooks/useProperties';
import { Tenant } from '@/hooks/useTenants';

const maintenanceSchema = z.object({
  propertyId: z.string().min(1, 'Please select a property'),
  tenantId: z.string().optional(),
  title: z.string().trim().min(1, 'Title is required').max(100),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(500),
  priority: z.enum(['low', 'medium', 'high'], { required_error: 'Please select a priority level' }),
  status: z.enum(['pending', 'in-progress', 'completed'], { required_error: 'Please select a status' }),
});

export type MaintenanceFormValues = z.infer<typeof maintenanceSchema>;

interface MaintenanceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MaintenanceFormValues) => void;
  properties: Property[];
  tenants: Tenant[];
  defaultValues?: Partial<MaintenanceFormValues>;
  isEditing?: boolean;
}

export function MaintenanceForm({ open, onOpenChange, onSubmit, properties, tenants, defaultValues, isEditing }: MaintenanceFormProps) {
  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      propertyId: '', tenantId: '', title: '', description: '', priority: 'medium', status: 'pending',
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (open && defaultValues) {
      form.reset({ propertyId: '', tenantId: '', title: '', description: '', priority: 'medium', status: 'pending', ...defaultValues });
    } else if (open && !isEditing) {
      form.reset({ propertyId: '', tenantId: '', title: '', description: '', priority: 'medium', status: 'pending' });
    }
  }, [open, defaultValues, isEditing]);

  const selectedPropertyId = form.watch('propertyId');
  const propertyTenants = tenants.filter((t) => t.property_id === selectedPropertyId);

  const handleSubmit = (data: MaintenanceFormValues) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Maintenance Request' : 'New Maintenance Request'}</DialogTitle>
          <DialogDescription>{isEditing ? 'Update request details.' : 'Create a new maintenance request.'}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField control={form.control} name="propertyId" render={({ field }) => (
              <FormItem>
                <FormLabel>Property</FormLabel>
                <Select onValueChange={(v) => { field.onChange(v); form.setValue('tenantId', ''); }} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select a property" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {properties.map((p) => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="tenantId" render={({ field }) => (
              <FormItem>
                <FormLabel>Tenant (Optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''} disabled={!selectedPropertyId}>
                  <FormControl><SelectTrigger><SelectValue placeholder={selectedPropertyId ? "Select a tenant" : "Select a property first"} /></SelectTrigger></FormControl>
                  <SelectContent>
                    {propertyTenants.length > 0 ? propertyTenants.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    )) : (
                      <SelectItem value="none" disabled>No tenants for this property</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Issue Title</FormLabel><FormControl><Input placeholder="e.g., Leaky faucet" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe the issue..." className="min-h-[100px] resize-none" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="priority" render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" className="gradient-primary">{isEditing ? 'Save Changes' : 'Create Request'}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
