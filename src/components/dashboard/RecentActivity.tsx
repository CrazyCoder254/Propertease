import { forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMaintenance } from '@/hooks/useMaintenance';
import { useTenants } from '@/hooks/useTenants';
import { useProperties } from '@/hooks/useProperties';

export const RecentActivity = forwardRef<HTMLDivElement>((_, ref) => {
  const navigate = useNavigate();
  const { maintenanceRequests, isLoading } = useMaintenance();
  const { tenants } = useTenants();
  const { properties } = useProperties();
  
  const recentRequests = maintenanceRequests.slice(0, 4);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-info" />;
      default:
        return <AlertCircle className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'in-progress':
        return 'status-in-progress';
      default:
        return 'status-pending';
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive';
      case 'medium':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div ref={ref} className="stat-card">
        <h3 className="text-lg font-semibold mb-4">Recent Maintenance Requests</h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="stat-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Maintenance Requests</h3>
        <button onClick={() => navigate('/maintenance')} className="text-sm text-primary hover:underline">View all</button>
      </div>

      {recentRequests.length > 0 ? (
        <div className="space-y-4">
          {recentRequests.map((request, index) => {
            const tenant = tenants.find((t) => t.id === request.tenant_id);
            const property = properties.find((p) => p.id === request.property_id);

            return (
              <div
                key={request.id}
                className={cn(
                  'flex items-start gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors',
                  'animate-fade-in',
                  `stagger-${index + 1}`
                )}
                style={{ opacity: 0, animationFillMode: 'forwards' }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Wrench className="h-5 w-5 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground truncate">
                        {request.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {property?.name || 'Unknown'} • {tenant?.name || 'Unknown'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={cn('status-badge', getStatusStyle(request.status))}>
                        {request.status.replace('-', ' ')}
                      </span>
                      <span className={cn('status-badge', getPriorityStyle(request.priority))}>
                        {request.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-4">No maintenance requests yet</p>
      )}
    </div>
  );
});

RecentActivity.displayName = 'RecentActivity';
