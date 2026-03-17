import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Property } from '@/hooks/useProperties';
import { Tenant } from '@/hooks/useTenants';

const rentPaymentSchema = z.object({
  tenantId: z.string().min(1, 'Tenant is required'),
  propertyId: z.string().min(1, 'Property is required'),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  dueDate: z.string().min(1, 'Due date is required'),
  paidDate: z.string().optional(),
  month: z.string().min(1, 'Month is required'),
  status: z.enum(['paid', 'pending', 'overdue']),
});

type RentPaymentFormData = z.infer<typeof rentPaymentSchema>;

interface RentPaymentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: RentPaymentFormData) => void;
  tenants: Tenant[];
  properties: Property[];
  currentTenantId?: string;
  currentPropertyId?: string;
}

export function RentPaymentForm({ open, onOpenChange, onSubmit, tenants, properties, currentTenantId, currentPropertyId }: RentPaymentFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<RentPaymentFormData>({
    resolver: zodResolver(rentPaymentSchema),
    defaultValues: {
      status: 'paid',
    },
  });

  const selectedTenantId = watch('tenantId');
  const selectedPropertyId = watch('propertyId');
  const activeTenants = tenants.filter((t) => t.property_id);

  useEffect(() => {
    if (!open) return;

    const resolvedTenant = currentTenantId
      ? tenants.find((tenant) => tenant.id === currentTenantId)
      : undefined;
    const resolvedProperty = currentPropertyId
      ? properties.find((property) => property.id === currentPropertyId)
      : undefined;
    const fallbackTenant = resolvedTenant ?? (activeTenants.length === 1 ? activeTenants[0] : undefined);
    const fallbackProperty = resolvedProperty ?? (properties.length === 1 ? properties[0] : undefined);

    if (fallbackTenant && selectedTenantId !== fallbackTenant.id) {
      setValue('tenantId', fallbackTenant.id, { shouldValidate: true });
    }

    const tenantPropertyId = fallbackTenant?.property_id ?? fallbackProperty?.id;
    if (tenantPropertyId && selectedPropertyId !== tenantPropertyId) {
      setValue('propertyId', tenantPropertyId, { shouldValidate: true });
      const property = properties.find((item) => item.id === tenantPropertyId);
      if (property) {
        setValue('amount', property.rent_amount);
      }
    }
  }, [open, currentTenantId, currentPropertyId, tenants, properties, activeTenants, selectedTenantId, selectedPropertyId, setValue]);

  const handleFormSubmit = (data: RentPaymentFormData) => {
    onSubmit(data);
    reset();
    onOpenChange(false);
  };

  const handleTenantChange = (tenantId: string) => {
    setValue('tenantId', tenantId);
    const tenant = tenants.find((t) => t.id === tenantId);
    if (tenant && tenant.property_id) {
      setValue('propertyId', tenant.property_id);
      const property = properties.find((p) => p.id === tenant.property_id);
      if (property) {
        setValue('amount', property.rent_amount);
      }
    }
  };

  const months = [
    'January 2025', 'February 2025', 'March 2025', 'April 2025',
    'May 2025', 'June 2025', 'July 2025', 'August 2025',
    'September 2025', 'October 2025', 'November 2025', 'December 2025',
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Record Rent Payment</DialogTitle>
          <DialogDescription>
            Record a new rent payment for a tenant
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Tenant</Label>
            <Select onValueChange={handleTenantChange} value={selectedTenantId || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Select tenant" />
              </SelectTrigger>
              <SelectContent>
                {activeTenants.map((tenant) => (
                  <SelectItem key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tenantId && (
              <p className="text-sm text-destructive">{errors.tenantId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Property</Label>
            <Select
              value={watch('propertyId')}
              onValueChange={(value) => setValue('propertyId', value)}
              disabled={!!selectedTenantId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Auto-selected from tenant" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.propertyId && (
              <p className="text-sm text-destructive">{errors.propertyId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Month</Label>
              <Select onValueChange={(value) => setValue('month', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.month && (
                <p className="text-sm text-destructive">{errors.month.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" {...register('dueDate')} />
              {errors.dueDate && (
                <p className="text-sm text-destructive">{errors.dueDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="paidDate">Paid Date (optional)</Label>
              <Input id="paidDate" type="date" {...register('paidDate')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              defaultValue="paid"
              onValueChange={(value: 'paid' | 'pending' | 'overdue') => setValue('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary">
              Record Payment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
