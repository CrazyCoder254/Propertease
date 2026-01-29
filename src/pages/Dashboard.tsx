import { Building2, Users, DollarSign, Wrench, AlertTriangle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { PropertyCard } from '@/components/dashboard/PropertyCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { TenantList } from '@/components/dashboard/TenantList';
import { useProperties } from '@/hooks/useProperties';
import { useTenants } from '@/hooks/useTenants';
import { useMaintenance } from '@/hooks/useMaintenance';
import { useRentPayments } from '@/hooks/useRentPayments';

export default function Dashboard() {
  const { properties, isLoading: propertiesLoading } = useProperties();
  const { tenants, isLoading: tenantsLoading } = useTenants();
  const { maintenanceRequests, isLoading: maintenanceLoading } = useMaintenance();
  const { stats, isLoading: rentLoading } = useRentPayments();

  const isLoading = propertiesLoading || tenantsLoading || maintenanceLoading || rentLoading;

  const dashboardStats = {
    totalProperties: properties.length,
    occupiedProperties: properties.filter(p => p.status === 'occupied').length,
    vacantProperties: properties.filter(p => p.status === 'vacant').length,
    totalTenants: tenants.length,
    totalRentCollected: stats.totalCollected,
    pendingRent: stats.pendingRent,
    overdueRent: stats.overdueRent,
    pendingMaintenance: maintenanceRequests.filter(m => m.status === 'pending').length,
    inProgressMaintenance: maintenanceRequests.filter(m => m.status === 'in-progress').length,
  };

  const totalRent = dashboardStats.totalRentCollected + dashboardStats.pendingRent + dashboardStats.overdueRent;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your property portfolio.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Properties"
            value={dashboardStats.totalProperties}
            subtitle={`${dashboardStats.occupiedProperties} occupied, ${dashboardStats.vacantProperties} vacant`}
            icon={Building2}
            variant="primary"
          />
          <StatCard
            title="Total Tenants"
            value={dashboardStats.totalTenants}
            icon={Users}
          />
          <StatCard
            title="Rent Collected"
            value={`KSH ${dashboardStats.totalRentCollected.toLocaleString()}`}
            subtitle={totalRent > 0 ? `of KSH ${totalRent.toLocaleString()} total` : 'No payments yet'}
            icon={DollarSign}
            variant="success"
          />
          <StatCard
            title="Maintenance"
            value={dashboardStats.pendingMaintenance + dashboardStats.inProgressMaintenance}
            subtitle={`${dashboardStats.pendingMaintenance} pending, ${dashboardStats.inProgressMaintenance} in progress`}
            icon={Wrench}
            variant={dashboardStats.pendingMaintenance > 2 ? 'warning' : 'default'}
          />
        </div>

        {/* Alerts Section */}
        {dashboardStats.overdueRent > 0 && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div>
              <p className="font-medium text-destructive">Overdue Rent Alert</p>
              <p className="text-sm text-destructive/80">
                KSH {dashboardStats.overdueRent.toLocaleString()} in overdue rent payments require attention.
              </p>
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Properties Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Your Properties</h2>
                <Link to="/properties" className="text-sm text-primary hover:underline">View all</Link>
              </div>
              {properties.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {properties.slice(0, 4).map((property) => (
                    <PropertyCard 
                      key={property.id} 
                      property={{
                        id: property.id,
                        name: property.name,
                        address: property.address,
                        type: property.type,
                        units: property.units,
                        rentAmount: Number(property.rent_amount),
                        status: property.status,
                        landlordId: property.landlord_id,
                        tenantId: property.tenant_id || undefined,
                        image: property.image || undefined,
                      }} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 stat-card">
                  <Building2 className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No properties yet.</p>
                  <Link to="/properties" className="text-sm text-primary hover:underline">Add your first property</Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            <RecentActivity />
            <TenantList />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
