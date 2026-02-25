import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, DollarSign, Users, Wrench, Loader2, Edit, Trash2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useProperties, Property, PropertyInsert } from '@/hooks/useProperties';
import { useTenants } from '@/hooks/useTenants';
import { useMaintenance } from '@/hooks/useMaintenance';
import { PropertyForm, PropertyFormValues } from '@/components/forms/PropertyForm';
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog';
import { useState } from 'react';

const typeIcons: Record<string, string> = {
  apartment: '🏢', house: '🏠', condo: '🏙️', commercial: '🏪',
};

const statusStyles: Record<string, string> = {
  occupied: 'status-occupied', vacant: 'status-vacant', maintenance: 'status-pending',
};

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties, isLoading, updateProperty, deleteProperty } = useProperties();
  const { tenants } = useTenants();
  const { maintenanceRequests } = useMaintenance();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const property = properties.find((p) => p.id === id);
  const propertyTenants = tenants.filter((t) => t.property_id === id);
  const propertyMaintenance = maintenanceRequests.filter((r) => r.property_id === id);

  if (isLoading) {
    return <MainLayout><div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></MainLayout>;
  }

  if (!property) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-bold mb-2">Property Not Found</h2>
          <p className="text-muted-foreground mb-4">The property you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/properties')}>Back to Properties</Button>
        </div>
      </MainLayout>
    );
  }

  const handleEdit = (data: PropertyFormValues) => {
    updateProperty.mutate({
      id: property.id, name: data.name, address: data.address, type: data.type,
      units: data.units, rent_amount: data.rentAmount, status: data.status,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteProperty.mutate(property.id);
    navigate('/properties');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/properties')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{property.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" />
              <span>{property.address}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(true)}><Edit className="h-4 w-4 mr-2" />Edit</Button>
            <Button variant="destructive" onClick={() => setIsDeleting(true)}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
          </div>
        </div>

        {/* Property Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <span className="text-2xl">{typeIcons[property.type]}</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-semibold capitalize">{property.type}</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Building2 className="h-5 w-5 text-primary" /></div>
              <div><p className="text-sm text-muted-foreground">Units</p><p className="font-semibold">{property.units}</p></div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><DollarSign className="h-5 w-5 text-primary" /></div>
              <div><p className="text-sm text-muted-foreground">Rent</p><p className="font-semibold">KSH {Number(property.rent_amount).toLocaleString()}/mo</p></div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-2">
              <span className={cn('status-badge', statusStyles[property.status])}>{property.status}</span>
            </div>
          </div>
        </div>

        {/* Tenants */}
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Tenants ({propertyTenants.length})</h2>
          </div>
          {propertyTenants.length > 0 ? (
            <div className="space-y-3">
              {propertyTenants.map((tenant) => (
                <div key={tenant.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{tenant.name}</p>
                    <p className="text-sm text-muted-foreground">{tenant.email}</p>
                  </div>
                  <span className={cn('status-badge', tenant.rent_status === 'paid' ? 'status-completed' : tenant.rent_status === 'pending' ? 'status-pending' : 'bg-destructive/15 text-destructive')}>{tenant.rent_status}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No tenants assigned to this property.</p>
          )}
        </div>

        {/* Maintenance */}
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-4">
            <Wrench className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Maintenance Requests ({propertyMaintenance.length})</h2>
          </div>
          {propertyMaintenance.length > 0 ? (
            <div className="space-y-3">
              {propertyMaintenance.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{request.title}</p>
                    <p className="text-sm text-muted-foreground">{request.description.substring(0, 60)}...</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn('text-xs font-medium px-2 py-1 rounded-full border', request.priority === 'high' ? 'bg-destructive/10 text-destructive border-destructive/20' : request.priority === 'medium' ? 'bg-warning/10 text-warning border-warning/20' : 'bg-muted text-muted-foreground border-border')}>{request.priority}</span>
                    <span className={cn('status-badge', request.status === 'completed' ? 'status-completed' : request.status === 'in-progress' ? 'status-in-progress' : 'status-pending')}>{request.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No maintenance requests for this property.</p>
          )}
        </div>
      </div>

      <PropertyForm
        open={isEditing}
        onOpenChange={setIsEditing}
        onSubmit={handleEdit}
        isEditing
        defaultValues={{ name: property.name, address: property.address, type: property.type, units: property.units, rentAmount: Number(property.rent_amount), status: property.status }}
      />
      <DeleteConfirmDialog open={isDeleting} onOpenChange={setIsDeleting} onConfirm={handleDelete} title="Delete Property?" description="This will permanently delete this property." />
    </MainLayout>
  );
}
