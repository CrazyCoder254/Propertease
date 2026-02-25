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
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Property } from '@/hooks/useProperties';

const tenantSchema = z.object({
  name: z.string().trim().min(1, 'Tenant name is required').max(100),
  email: z.string().trim().email('Invalid email address').max(255),
  phone: z.string().trim().min(10, 'Phone number must be at least 10 digits').max(20),
  propertyId: z.string().optional(),
  moveInDate: z.string().min(1, 'Move-in date is required'),
  leaseEnd: z.string().min(1, 'Lease end date is required'),
  rentStatus: z.enum(['paid', 'pending', 'overdue'], {
    required_error: 'Please select rent status',
  }),
}).refine((data) => {
  if (data.moveInDate && data.leaseEnd) {
    return new Date(data.leaseEnd) > new Date(data.moveInDate);
  }
  return true;
}, { message: 'Lease end date must be after move-in date', path: ['leaseEnd'] });

export type TenantFormValues = z.infer<typeof tenantSchema>;

interface TenantFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TenantFormValues) => void;
  properties: Property[];
  defaultValues?: Partial<TenantFormValues>;
  isEditing?: boolean;
}

export function TenantForm({ open, onOpenChange, onSubmit, properties, defaultValues, isEditing }: TenantFormProps) {
  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      name: '', email: '', phone: '', propertyId: undefined, moveInDate: '', leaseEnd: '', rentStatus: 'pending',
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (open && defaultValues) {
      form.reset({ name: '', email: '', phone: '', propertyId: undefined, moveInDate: '', leaseEnd: '', rentStatus: 'pending', ...defaultValues });
    } else if (open && !isEditing) {
      form.reset({ name: '', email: '', phone: '', propertyId: undefined, moveInDate: '', leaseEnd: '', rentStatus: 'pending' });
    }
  }, [open, defaultValues, isEditing]);

  const handleSubmit = (data: TenantFormValues) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Tenant' : 'Add New Tenant'}</DialogTitle>
          <DialogDescription>{isEditing ? 'Update tenant details.' : 'Enter the details for the new tenant.'}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="e.g., John Smith" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="email@example.com" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="(555) 123-4567" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="propertyId" render={({ field }) => (
              <FormItem>
                <FormLabel>Assign to Property (Optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select a property" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {properties.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="moveInDate" render={({ field }) => (
                <FormItem><FormLabel>Move-in Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="leaseEnd" render={({ field }) => (
                <FormItem><FormLabel>Lease End Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="rentStatus" render={({ field }) => (
              <FormItem>
                <FormLabel>Rent Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" className="gradient-primary">{isEditing ? 'Save Changes' : 'Add Tenant'}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
