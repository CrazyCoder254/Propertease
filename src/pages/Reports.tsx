import { FileText, Download, Building2, Users, DollarSign, Wrench, Loader2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useProperties } from '@/hooks/useProperties';
import { useTenants } from '@/hooks/useTenants';
import { useRentPayments } from '@/hooks/useRentPayments';
import { useMaintenance } from '@/hooks/useMaintenance';
import { toast } from 'sonner';

export default function Reports() {
  const { properties, isLoading: loadingProps } = useProperties();
  const { tenants, isLoading: loadingTenants } = useTenants();
  const { rentPayments, stats, isLoading: loadingRent } = useRentPayments();
  const { maintenanceRequests, isLoading: loadingMaint } = useMaintenance();

  const isLoading = loadingProps || loadingTenants || loadingRent || loadingMaint;

  const generateCSV = (headers: string[], rows: string[][], filename: string) => {
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    toast.success(`${filename} downloaded!`);
  };

  const generatePropertyReport = () => {
    const headers = ['Name', 'Address', 'Type', 'Units', 'Rent Amount', 'Status'];
    const rows = properties.map((p) => [p.name, p.address, p.type, String(p.units), String(p.rent_amount), p.status]);
    generateCSV(headers, rows, 'property-report.csv');
  };

  const generateTenantReport = () => {
    const headers = ['Name', 'Email', 'Phone', 'Property', 'Move-in Date', 'Lease End', 'Rent Status'];
    const rows = tenants.map((t) => {
      const prop = properties.find((p) => p.id === t.property_id);
      return [t.name, t.email, t.phone || 'N/A', prop?.name || 'N/A', t.move_in_date, t.lease_end, t.rent_status];
    });
    generateCSV(headers, rows, 'tenant-report.csv');
  };

  const generateRentReport = () => {
    const headers = ['Tenant', 'Property', 'Amount', 'Due Date', 'Paid Date', 'Status', 'Month'];
    const rows = rentPayments.map((p) => {
      const tenant = tenants.find((t) => t.id === p.tenant_id);
      const prop = properties.find((pr) => pr.id === p.property_id);
      return [tenant?.name || 'N/A', prop?.name || 'N/A', String(p.amount), p.due_date, p.paid_date || 'Unpaid', p.status, p.month];
    });
    generateCSV(headers, rows, 'rent-report.csv');
  };

  const generateMaintenanceReport = () => {
    const headers = ['Title', 'Property', 'Priority', 'Status', 'Created', 'Description'];
    const rows = maintenanceRequests.map((r) => {
      const prop = properties.find((p) => p.id === r.property_id);
      return [r.title, prop?.name || 'N/A', r.priority, r.status, r.created_at.split('T')[0], r.description.substring(0, 100)];
    });
    generateCSV(headers, rows, 'maintenance-report.csv');
  };

  const reportTypes = [
    { id: 'property', title: 'Property Report', description: `${properties.length} properties — Overview of all properties including status and rent.`, icon: Building2, color: 'primary', generate: generatePropertyReport },
    { id: 'tenant', title: 'Tenant Report', description: `${tenants.length} tenants — Detailed tenant info, lease terms, and payment history.`, icon: Users, color: 'info', generate: generateTenantReport },
    { id: 'rent', title: 'Rent Collection Report', description: `KSH ${stats.totalCollected.toLocaleString()} collected — Payment trends and outstanding balances.`, icon: DollarSign, color: 'success', generate: generateRentReport },
    { id: 'maintenance', title: 'Maintenance Report', description: `${maintenanceRequests.length} requests — Request history and completion rates.`, icon: Wrench, color: 'warning', generate: generateMaintenanceReport },
  ];

  const getColorClass = (color: string) => {
    switch (color) {
      case 'primary': return 'bg-primary/10 text-primary';
      case 'info': return 'bg-info/10 text-info';
      case 'success': return 'bg-success/10 text-success';
      case 'warning': return 'bg-warning/10 text-warning';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return <MainLayout><div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></MainLayout>;
  }

  // Summary stats
  const occupiedCount = properties.filter((p) => p.status === 'occupied').length;
  const pendingMaint = maintenanceRequests.filter((r) => r.status === 'pending').length;
  const overdueCount = tenants.filter((t) => t.rent_status === 'overdue').length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Generate and download reports for your properties</p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="stat-card">
            <p className="text-sm text-muted-foreground">Occupancy Rate</p>
            <p className="text-2xl font-bold">{properties.length > 0 ? Math.round((occupiedCount / properties.length) * 100) : 0}%</p>
            <p className="text-xs text-muted-foreground">{occupiedCount} of {properties.length} occupied</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">KSH {stats.totalCollected.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Collected this period</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-muted-foreground">Pending Maintenance</p>
            <p className="text-2xl font-bold">{pendingMaint}</p>
            <p className="text-xs text-muted-foreground">Awaiting resolution</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-muted-foreground">Overdue Tenants</p>
            <p className="text-2xl font-bold">{overdueCount}</p>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </div>
        </div>

        {/* Report Types */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reportTypes.map((report, index) => (
            <div key={report.id} className={cn('stat-card cursor-pointer group animate-fade-in')} style={{ opacity: 0, animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}>
              <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl mb-4 transition-transform group-hover:scale-110', getColorClass(report.color))}>
                <report.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{report.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
              <Button variant="outline" className="w-full" onClick={report.generate}>
                <Download className="h-4 w-4 mr-2" />Download CSV
              </Button>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
