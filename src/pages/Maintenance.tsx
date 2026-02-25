import { useState } from 'react';
import { Plus, Search, Wrench, Clock, CheckCircle, AlertCircle, Loader2, Edit, Trash2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { MaintenanceForm, MaintenanceFormValues } from '@/components/forms/MaintenanceForm';
import { useMaintenance, MaintenanceRequest, MaintenanceInsert } from '@/hooks/useMaintenance';
import { useTenants } from '@/hooks/useTenants';
import { useProperties } from '@/hooks/useProperties';
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog';

export default function Maintenance() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<MaintenanceRequest | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { maintenanceRequests, isLoading, addRequest, updateRequest, deleteRequest } = useMaintenance();
  const { tenants } = useTenants();
  const { properties } = useProperties();

  const filteredRequests = maintenanceRequests.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || r.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-success" />;
      case 'in-progress': return <Clock className="h-5 w-5 text-info" />;
      default: return <AlertCircle className="h-5 w-5 text-warning" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'in-progress': return 'status-in-progress';
      default: return 'status-pending';
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const filters = [
    { key: 'all', label: 'All', count: maintenanceRequests.length },
    { key: 'pending', label: 'Pending', count: maintenanceRequests.filter((r) => r.status === 'pending').length },
    { key: 'in-progress', label: 'In Progress', count: maintenanceRequests.filter((r) => r.status === 'in-progress').length },
    { key: 'completed', label: 'Completed', count: maintenanceRequests.filter((r) => r.status === 'completed').length },
  ];

  const handleAdd = (data: MaintenanceFormValues) => {
    const requestData: MaintenanceInsert = {
      property_id: data.propertyId, tenant_id: data.tenantId || undefined,
      title: data.title, description: data.description, priority: data.priority, status: data.status,
    };
    addRequest.mutate(requestData);
  };

  const handleEdit = (data: MaintenanceFormValues) => {
    if (!editingRequest) return;
    updateRequest.mutate({
      id: editingRequest.id, property_id: data.propertyId, tenant_id: data.tenantId || null,
      title: data.title, description: data.description, priority: data.priority, status: data.status,
    });
    setEditingRequest(null);
  };

  const handleDelete = () => {
    if (deletingId) { deleteRequest.mutate(deletingId); setDeletingId(null); }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Maintenance</h1>
            <p className="text-muted-foreground">Track and manage maintenance requests</p>
          </div>
          <Button className="gradient-primary shadow-glow" onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />New Request
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search requests..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map((filter) => (
              <button key={filter.key} onClick={() => setActiveFilter(filter.key)} className={cn('px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2', activeFilter === filter.key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80')}>
                {filter.label}
                <span className={cn('text-xs px-1.5 py-0.5 rounded-full', activeFilter === filter.key ? 'bg-primary-foreground/20' : 'bg-background')}>{filter.count}</span>
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : filteredRequests.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRequests.map((request, index) => {
              const tenant = tenants.find((t) => t.id === request.tenant_id);
              const property = properties.find((p) => p.id === request.property_id);
              return (
                <div key={request.id} className={cn('stat-card border-l-4 relative group', getPriorityStyle(request.priority), 'animate-fade-in')} style={{ opacity: 0, animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}>
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => setEditingRequest(request)}><Edit className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => setDeletingId(request.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      <span className={cn('status-badge', getStatusStyle(request.status))}>{request.status.replace('-', ' ')}</span>
                    </div>
                    <span className={cn('text-xs font-medium px-2 py-1 rounded-full border', getPriorityStyle(request.priority))}>{request.priority}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{request.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{request.description}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t border-border">
                    <div>
                      <p className="font-medium text-foreground">{property?.name || 'Unknown Property'}</p>
                      <p>{tenant?.name || 'Unknown Tenant'}</p>
                    </div>
                    <p>{new Date(request.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No maintenance requests</h3>
            <p className="text-muted-foreground">{maintenanceRequests.length === 0 ? 'Create your first maintenance request.' : 'No requests match your current filter.'}</p>
          </div>
        )}
      </div>

      <MaintenanceForm open={isFormOpen} onOpenChange={setIsFormOpen} onSubmit={handleAdd} properties={properties} tenants={tenants} />
      <MaintenanceForm
        open={!!editingRequest}
        onOpenChange={(open) => { if (!open) setEditingRequest(null); }}
        onSubmit={handleEdit}
        properties={properties}
        tenants={tenants}
        isEditing
        defaultValues={editingRequest ? {
          propertyId: editingRequest.property_id, tenantId: editingRequest.tenant_id || '',
          title: editingRequest.title, description: editingRequest.description,
          priority: editingRequest.priority, status: editingRequest.status,
        } : undefined}
      />
      <DeleteConfirmDialog open={!!deletingId} onOpenChange={(open) => { if (!open) setDeletingId(null); }} onConfirm={handleDelete} title="Delete Request?" description="This will permanently delete this maintenance request." />
    </MainLayout>
  );
}
