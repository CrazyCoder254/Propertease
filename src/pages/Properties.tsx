import { useState } from 'react';
import { Plus, Search, Filter, Grid3X3, List, Loader2, Edit, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { PropertyCard } from '@/components/dashboard/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { PropertyForm, PropertyFormValues } from '@/components/forms/PropertyForm';
import { useProperties, Property, PropertyInsert } from '@/hooks/useProperties';
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog';

export default function Properties() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { properties, isLoading, addProperty, updateProperty, deleteProperty } = useProperties();

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' || property.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleAddProperty = (data: PropertyFormValues) => {
    const propertyData: PropertyInsert = {
      name: data.name, address: data.address, type: data.type,
      units: data.units, rent_amount: data.rentAmount, status: data.status,
    };
    addProperty.mutate(propertyData);
  };

  const handleEditProperty = (data: PropertyFormValues) => {
    if (!editingProperty) return;
    updateProperty.mutate({
      id: editingProperty.id, name: data.name, address: data.address,
      type: data.type, units: data.units, rent_amount: data.rentAmount, status: data.status,
    });
    setEditingProperty(null);
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteProperty.mutate(deletingId);
      setDeletingId(null);
    }
  };

  const openEdit = (property: Property) => {
    setEditingProperty(property);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
            <p className="text-muted-foreground">Manage your {properties.length} properties</p>
          </div>
          <Button className="gradient-primary shadow-glow" onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />Add Property
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search properties..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-2">
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={cn('px-3 py-2 transition-colors', viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted')}>
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button onClick={() => setViewMode('list')} className={cn('px-3 py-2 transition-colors', viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted')}>
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {['All', 'Occupied', 'Vacant', 'Maintenance'].map((status) => (
            <button key={status} onClick={() => setStatusFilter(status)} className={cn('px-4 py-2 rounded-full text-sm font-medium transition-colors', statusFilter === status ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80')}>
              {status}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : filteredProperties.length > 0 ? (
          <div className={cn('grid gap-4', viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1')}>
            {filteredProperties.map((property) => (
              <div key={property.id} className="relative group">
                <PropertyCard
                  property={{
                    id: property.id, name: property.name, address: property.address, type: property.type,
                    units: property.units, rentAmount: Number(property.rent_amount), status: property.status,
                    landlordId: property.landlord_id, tenantId: property.tenant_id || undefined, image: property.image || undefined,
                  }}
                  onView={() => navigate(`/properties/${property.id}`)}
                />
                <div className="absolute top-3 left-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => openEdit(property)}>
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => setDeletingId(property.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-lg font-semibold">No properties found</h3>
            <p className="text-muted-foreground">{properties.length === 0 ? 'Add your first property to get started.' : 'Try adjusting your search or filter.'}</p>
          </div>
        )}
      </div>

      <PropertyForm open={isFormOpen} onOpenChange={setIsFormOpen} onSubmit={handleAddProperty} />
      <PropertyForm
        open={!!editingProperty}
        onOpenChange={(open) => { if (!open) setEditingProperty(null); }}
        onSubmit={handleEditProperty}
        isEditing
        defaultValues={editingProperty ? {
          name: editingProperty.name, address: editingProperty.address, type: editingProperty.type,
          units: editingProperty.units, rentAmount: Number(editingProperty.rent_amount), status: editingProperty.status,
        } : undefined}
      />
      <DeleteConfirmDialog open={!!deletingId} onOpenChange={(open) => { if (!open) setDeletingId(null); }} onConfirm={handleDelete} title="Delete Property?" description="This will permanently delete this property and cannot be undone." />
    </MainLayout>
  );
}
