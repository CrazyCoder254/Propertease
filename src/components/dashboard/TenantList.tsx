import { forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Home, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTenants } from '@/hooks/useTenants';
import { useProperties } from '@/hooks/useProperties';

export const TenantList = forwardRef<HTMLDivElement>((_, ref) => {
  const navigate = useNavigate();
  const { tenants, isLoading } = useTenants();
  const { properties } = useProperties();
  
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

  if (isLoading) {
    return (
      <div ref={ref} className="stat-card">
        <h3 className="text-lg font-semibold mb-4">Recent Tenants</h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="stat-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Tenants</h3>
        <button onClick={() => navigate('/tenants')} className="text-sm text-primary hover:underline">View all</button>
      </div>

      {displayTenants.length > 0 ? (
        <div className="space-y-3">
          {displayTenants.map((tenant, index) => {
            const property = properties.find((p) => p.id === tenant.property_id);

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
                    <span className={cn('status-badge', getStatusStyle(tenant.rent_status))}>
                      {tenant.rent_status}
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
      ) : (
        <p className="text-center text-muted-foreground py-4">No tenants yet</p>
      )}

      <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/tenants')}>
        Add New Tenant
      </Button>
    </div>
  );
});

TenantList.displayName = 'TenantList';
