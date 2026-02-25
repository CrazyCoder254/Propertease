import { Building2, MapPin, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PropertyCardProperty {
  id: string;
  name: string;
  address: string;
  type: 'apartment' | 'house' | 'condo' | 'commercial';
  units: number;
  rentAmount: number;
  status: 'occupied' | 'vacant' | 'maintenance';
  landlordId?: string;
  tenantId?: string;
  image?: string;
}

interface PropertyCardProps {
  property: PropertyCardProperty;
  onView?: () => void;
}

export function PropertyCard({ property, onView }: PropertyCardProps) {
  const statusStyles = {
    occupied: 'status-occupied',
    vacant: 'status-vacant',
    maintenance: 'status-pending',
  };

  const statusLabels = {
    occupied: 'Occupied',
    vacant: 'Vacant',
    maintenance: 'Under Maintenance',
  };

  const typeIcons = {
    apartment: '🏢',
    house: '🏠',
    condo: '🏙️',
    commercial: '🏪',
  };

  return (
    <div className="stat-card group overflow-hidden">
      <div className="relative -mx-6 -mt-6 mb-4 h-40 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-50">{typeIcons[property.type]}</span>
        </div>
        <div className="absolute right-3 top-3">
          <span className={cn('status-badge', statusStyles[property.status])}>
            {statusLabels[property.status]}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {property.name}
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{property.address}</span>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-border">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>{property.units} {property.units === 1 ? 'unit' : 'units'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>KSH {property.rentAmount.toLocaleString()}/mo</span>
            </div>
          </div>
        </div>

        <Button className="w-full" variant="outline" onClick={onView}>
          View Details
        </Button>
      </div>
    </div>
  );
}
