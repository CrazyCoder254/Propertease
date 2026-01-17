import { Building2, Users, DollarSign, Wrench, TrendingUp, AlertTriangle } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { PropertyCard } from '@/components/dashboard/PropertyCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { TenantList } from '@/components/dashboard/TenantList';
import { dashboardStats, properties } from '@/data/mockData';

export default function Dashboard() {
  const totalRent = dashboardStats.totalRentCollected + dashboardStats.pendingRent + dashboardStats.overdueRent;

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
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Rent Collected"
            value={`$${dashboardStats.totalRentCollected.toLocaleString()}`}
            subtitle={`of $${totalRent.toLocaleString()} total`}
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
                ${dashboardStats.overdueRent.toLocaleString()} in overdue rent payments require attention.
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
                <button className="text-sm text-primary hover:underline">View all</button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {properties.slice(0, 4).map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
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
