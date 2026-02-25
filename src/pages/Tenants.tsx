import { useState } from 'react';
import { Plus, Search, User, Mail, Phone, Home, Edit, Trash2, Loader2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { TenantForm, TenantFormValues } from '@/components/forms/TenantForm';
import { useTenants, Tenant, TenantInsert } from '@/hooks/useTenants';
import { useProperties } from '@/hooks/useProperties';
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog';

export default function Tenants() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { tenants, isLoading, addTenant, updateTenant, deleteTenant } = useTenants();
  const { properties } = useProperties();

  const filteredTenants = tenants.filter(
    (t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid': return 'status-completed';
      case 'pending': return 'status-pending';
      default: return 'bg-destructive/15 text-destructive';
    }
  };

  const handleAdd = (data: TenantFormValues) => {
    const tenantData: TenantInsert = {
      name: data.name, email: data.email, phone: data.phone,
      property_id: data.propertyId, move_in_date: data.moveInDate,
      lease_end: data.leaseEnd, rent_status: data.rentStatus,
    };
    addTenant.mutate(tenantData);
  };

  const handleEdit = (data: TenantFormValues) => {
    if (!editingTenant) return;
    updateTenant.mutate({
      id: editingTenant.id, name: data.name, email: data.email, phone: data.phone,
      property_id: data.propertyId || null, move_in_date: data.moveInDate,
      lease_end: data.leaseEnd, rent_status: data.rentStatus,
    });
    setEditingTenant(null);
  };

  const handleDelete = () => {
    if (deletingId) { deleteTenant.mutate(deletingId); setDeletingId(null); }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
            <p className="text-muted-foreground">Manage your {tenants.length} tenants</p>
          </div>
          <Button className="gradient-primary shadow-glow" onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />Add Tenant
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search tenants..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : tenants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No tenants yet</h3>
            <p className="text-muted-foreground">Add your first tenant to get started.</p>
          </div>
        ) : (
          <div className="stat-card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tenant</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Contact</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Property</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Rent Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Lease End</th>
                    <th className="py-3 px-4 text-sm font-medium text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTenants.map((tenant, index) => {
                    const property = properties.find((p) => p.id === tenant.property_id);
                    return (
                      <tr key={tenant.id} className={cn('border-b border-border last:border-0 hover:bg-muted/30 transition-colors animate-fade-in')} style={{ opacity: 0, animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{tenant.name}</p>
                              <p className="text-sm text-muted-foreground md:hidden">{tenant.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 hidden md:table-cell">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-3.5 w-3.5" />{tenant.email}</div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-3.5 w-3.5" />{tenant.phone || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4 hidden lg:table-cell">
                          {property ? (
                            <div className="flex items-center gap-2 text-sm"><Home className="h-4 w-4 text-muted-foreground" />{property.name}</div>
                          ) : (
                            <span className="text-sm text-muted-foreground">No property</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className={cn('status-badge', getStatusStyle(tenant.rent_status))}>{tenant.rent_status}</span>
                        </td>
                        <td className="py-4 px-4 hidden sm:table-cell">
                          <span className="text-sm text-muted-foreground">
                            {new Date(tenant.lease_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => setEditingTenant(tenant)}><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeletingId(tenant.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <TenantForm open={isFormOpen} onOpenChange={setIsFormOpen} onSubmit={handleAdd} properties={properties} />
      <TenantForm
        open={!!editingTenant}
        onOpenChange={(open) => { if (!open) setEditingTenant(null); }}
        onSubmit={handleEdit}
        properties={properties}
        isEditing
        defaultValues={editingTenant ? {
          name: editingTenant.name, email: editingTenant.email, phone: editingTenant.phone || '',
          propertyId: editingTenant.property_id || undefined, moveInDate: editingTenant.move_in_date,
          leaseEnd: editingTenant.lease_end, rentStatus: editingTenant.rent_status,
        } : undefined}
      />
      <DeleteConfirmDialog open={!!deletingId} onOpenChange={(open) => { if (!open) setDeletingId(null); }} onConfirm={handleDelete} title="Delete Tenant?" description="This will permanently delete this tenant record." />
    </MainLayout>
  );
}
