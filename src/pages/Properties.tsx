import { useState } from 'react';
import { Plus, Search, Filter, Grid3X3, List } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PropertyCard } from '@/components/dashboard/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { properties as initialProperties } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { PropertyForm } from '@/components/forms/PropertyForm';
import { toast } from 'sonner';

export default function Properties() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [properties, setProperties] = useState(initialProperties);

  const filteredProperties = properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProperty = (data: {
    name: string;
    address: string;
    type: 'apartment' | 'house' | 'condo' | 'commercial';
    units: number;
    rentAmount: number;
    status: 'occupied' | 'vacant' | 'maintenance';
  }) => {
    const newProperty = {
      id: String(properties.length + 1),
      ...data,
      landlordId: '1',
    };
    setProperties([...properties, newProperty]);
    toast.success('Property added successfully!');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
            <p className="text-muted-foreground">
              Manage your {properties.length} properties
            </p>
          </div>
          <Button className="gradient-primary shadow-glow" onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'px-3 py-2 transition-colors',
                  viewMode === 'grid'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card hover:bg-muted'
                )}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'px-3 py-2 transition-colors',
                  viewMode === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card hover:bg-muted'
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 flex-wrap">
          {['All', 'Occupied', 'Vacant', 'Maintenance'].map((status) => (
            <button
              key={status}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                status === 'All'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className={cn(
            'grid gap-4',
            viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
          )}>
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-lg font-semibold">No properties found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or add a new property.
            </p>
          </div>
        )}
      </div>

      <PropertyForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleAddProperty}
      />
    </MainLayout>
  );
}
