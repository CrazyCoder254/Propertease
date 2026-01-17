import { tenants, properties } from '@/data/mockData';
import { User, Mail, Phone, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function TenantList() {
  const displayTenants = tenants.slice(0, 4);

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

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Tenants</h3>
        <button className="text-sm text-primary hover:underline">View all</button>
      </div>

      <div className="space-y-3">
        {displayTenants.map((tenant, index) => {
          const property = properties.find((p) => p.id === tenant.propertyId);

          return (
            <div
              key={tenant.id}
              className={cn(
                'flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors',
                'animate-fade-in',
                `stagger-${index + 1}`
              )}
              style={{ opacity: 0, animationFillMode: 'forwards' }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{tenant.name}</p>
                  <span className={cn('status-badge', getStatusStyle(tenant.rentStatus))}>
                    {tenant.rentStatus}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  {property && (
                    <span className="flex items-center gap-1 truncate">
                      <Home className="h-3.5 w-3.5" />
                      {property.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Button variant="outline" className="w-full mt-4">
        Add New Tenant
      </Button>
    </div>
  );
}
