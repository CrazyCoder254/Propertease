import { DollarSign, TrendingUp, TrendingDown, Calendar, Search, Loader2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { RentPaymentForm } from '@/components/forms/RentPaymentForm';
import { useRentPayments, RentPaymentInsert } from '@/hooks/useRentPayments';
import { useTenants } from '@/hooks/useTenants';
import { useProperties } from '@/hooks/useProperties';

export default function Rent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { rentPayments, isLoading, addPayment, stats } = useRentPayments();
  const { tenants } = useTenants();
  const { properties } = useProperties();

  const handleRecordPayment = (data: {
    tenantId: string;
    propertyId: string;
    amount: number;
    dueDate: string;
    paidDate?: string;
    month: string;
    status: 'paid' | 'pending' | 'overdue';
  }) => {
    const paymentData: RentPaymentInsert = {
      tenant_id: data.tenantId || undefined,
      property_id: data.propertyId,
      amount: data.amount,
      due_date: data.dueDate,
      paid_date: data.paidDate,
      status: data.status,
      month: data.month,
    };
    addPayment.mutate(paymentData);
    setIsFormOpen(false);
  };

  const filteredPayments = rentPayments.filter((payment) => {
    const tenant = tenants.find((t) => t.id === payment.tenant_id);
    return tenant?.name.toLowerCase().includes(searchQuery.toLowerCase()) || false;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      default:
        return 'bg-destructive/15 text-destructive';
    }
  };

  const totalExpected = stats.totalCollected + stats.pendingRent + stats.overdueRent;
  const collectionRate = totalExpected > 0 
    ? Math.round((stats.totalCollected / totalExpected) * 100) 
    : 0;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rent Management</h1>
            <p className="text-muted-foreground">Track and manage rent payments</p>
          </div>
          <Button className="gradient-primary shadow-glow" onClick={() => setIsFormOpen(true)}>
            <DollarSign className="h-4 w-4 mr-2" />
            Record Payment
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Collected"
            value={`KSH ${stats.totalCollected.toLocaleString()}`}
            subtitle={`${collectionRate}% collection rate`}
            icon={TrendingUp}
            variant="success"
          />
          <StatCard
            title="Pending"
            value={`KSH ${stats.pendingRent.toLocaleString()}`}
            subtitle="Due this month"
            icon={Calendar}
          />
          <StatCard
            title="Overdue"
            value={`KSH ${stats.overdueRent.toLocaleString()}`}
            subtitle="Requires attention"
            icon={TrendingDown}
            variant="warning"
          />
          <StatCard
            title="Expected Monthly"
            value={`KSH ${totalExpected.toLocaleString()}`}
            subtitle="From all properties"
            icon={DollarSign}
          />
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by tenant name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : rentPayments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No rent payments yet</h3>
            <p className="text-muted-foreground">
              Record your first payment to get started.
            </p>
          </div>
        ) : (
          <div className="stat-card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Tenant
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">
                      Property
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">
                      Due Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">
                      Month
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment, index) => {
                    const tenant = tenants.find((t) => t.id === payment.tenant_id);
                    const property = properties.find((p) => p.id === payment.property_id);

                    return (
                      <tr
                        key={payment.id}
                        className={cn(
                          'border-b border-border last:border-0 hover:bg-muted/30 transition-colors',
                          'animate-fade-in'
                        )}
                        style={{
                          opacity: 0,
                          animationDelay: `${index * 0.05}s`,
                          animationFillMode: 'forwards',
                        }}
                      >
                        <td className="py-4 px-4">
                          <p className="font-medium">{tenant?.name || 'Unknown'}</p>
                        </td>
                        <td className="py-4 px-4 hidden md:table-cell">
                          <p className="text-sm text-muted-foreground">{property?.name || 'N/A'}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-semibold">KSH {Number(payment.amount).toLocaleString()}</p>
                        </td>
                        <td className="py-4 px-4 hidden sm:table-cell">
                          <p className="text-sm text-muted-foreground">
                            {new Date(payment.due_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <span className={cn('status-badge', getStatusStyle(payment.status))}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 hidden lg:table-cell">
                          <p className="text-sm text-muted-foreground">{payment.month}</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <RentPaymentForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleRecordPayment}
        />
      </div>
    </MainLayout>
  );
}
