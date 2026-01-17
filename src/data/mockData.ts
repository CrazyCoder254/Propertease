// Mock data for Propertease property management system

export interface Property {
  id: string;
  name: string;
  address: string;
  type: 'apartment' | 'house' | 'condo' | 'commercial';
  units: number;
  rentAmount: number;
  status: 'occupied' | 'vacant' | 'maintenance';
  landlordId: string;
  tenantId?: string;
  image?: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId?: string;
  moveInDate: string;
  leaseEnd: string;
  rentStatus: 'paid' | 'pending' | 'overdue';
  avatar?: string;
}

export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  tenantId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface RentPayment {
  id: string;
  tenantId: string;
  propertyId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue';
  month: string;
}

export const properties: Property[] = [
  {
    id: '1',
    name: 'Sunset Apartments',
    address: '123 Sunset Blvd, Los Angeles, CA 90028',
    type: 'apartment',
    units: 12,
    rentAmount: 2500,
    status: 'occupied',
    landlordId: '1',
    tenantId: '1',
  },
  {
    id: '2',
    name: 'Ocean View Condo',
    address: '456 Pacific Coast Hwy, Malibu, CA 90265',
    type: 'condo',
    units: 1,
    rentAmount: 4500,
    status: 'occupied',
    landlordId: '1',
    tenantId: '2',
  },
  {
    id: '3',
    name: 'Downtown Loft',
    address: '789 Main St, Unit 5B, San Francisco, CA 94102',
    type: 'apartment',
    units: 1,
    rentAmount: 3200,
    status: 'vacant',
    landlordId: '1',
  },
  {
    id: '4',
    name: 'Hillside Estate',
    address: '321 Mountain Dr, Beverly Hills, CA 90210',
    type: 'house',
    units: 1,
    rentAmount: 8500,
    status: 'occupied',
    landlordId: '1',
    tenantId: '3',
  },
  {
    id: '5',
    name: 'Tech Hub Office',
    address: '555 Innovation Way, Palo Alto, CA 94301',
    type: 'commercial',
    units: 3,
    rentAmount: 12000,
    status: 'maintenance',
    landlordId: '1',
  },
];

export const tenants: Tenant[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 123-4567',
    propertyId: '1',
    moveInDate: '2024-01-15',
    leaseEnd: '2025-01-14',
    rentStatus: 'paid',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.c@email.com',
    phone: '(555) 234-5678',
    propertyId: '2',
    moveInDate: '2023-06-01',
    leaseEnd: '2025-05-31',
    rentStatus: 'paid',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    phone: '(555) 345-6789',
    propertyId: '4',
    moveInDate: '2024-03-01',
    leaseEnd: '2025-02-28',
    rentStatus: 'pending',
  },
  {
    id: '4',
    name: 'James Wilson',
    email: 'james.w@email.com',
    phone: '(555) 456-7890',
    moveInDate: '2023-09-15',
    leaseEnd: '2024-09-14',
    rentStatus: 'overdue',
  },
];

export const maintenanceRequests: MaintenanceRequest[] = [
  {
    id: '1',
    propertyId: '1',
    tenantId: '1',
    title: 'Leaky faucet in kitchen',
    description: 'The kitchen faucet has been dripping constantly for the past week.',
    priority: 'medium',
    status: 'in-progress',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-12',
  },
  {
    id: '2',
    propertyId: '2',
    tenantId: '2',
    title: 'AC not cooling properly',
    description: 'Air conditioning unit is running but not producing cold air.',
    priority: 'high',
    status: 'pending',
    createdAt: '2024-01-14',
    updatedAt: '2024-01-14',
  },
  {
    id: '3',
    propertyId: '4',
    tenantId: '3',
    title: 'Broken window lock',
    description: 'The lock on the bedroom window is broken and needs replacement.',
    priority: 'high',
    status: 'pending',
    createdAt: '2024-01-13',
    updatedAt: '2024-01-13',
  },
  {
    id: '4',
    propertyId: '1',
    tenantId: '1',
    title: 'Light fixture replacement',
    description: 'Living room ceiling light needs to be replaced.',
    priority: 'low',
    status: 'completed',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-08',
  },
];

export const rentPayments: RentPayment[] = [
  {
    id: '1',
    tenantId: '1',
    propertyId: '1',
    amount: 2500,
    dueDate: '2024-01-01',
    paidDate: '2024-01-01',
    status: 'paid',
    month: 'January 2024',
  },
  {
    id: '2',
    tenantId: '2',
    propertyId: '2',
    amount: 4500,
    dueDate: '2024-01-01',
    paidDate: '2023-12-28',
    status: 'paid',
    month: 'January 2024',
  },
  {
    id: '3',
    tenantId: '3',
    propertyId: '4',
    amount: 8500,
    dueDate: '2024-01-01',
    status: 'pending',
    month: 'January 2024',
  },
  {
    id: '4',
    tenantId: '4',
    propertyId: '3',
    amount: 3200,
    dueDate: '2023-12-01',
    status: 'overdue',
    month: 'December 2023',
  },
];

// Dashboard statistics
export const dashboardStats = {
  totalProperties: properties.length,
  occupiedProperties: properties.filter(p => p.status === 'occupied').length,
  vacantProperties: properties.filter(p => p.status === 'vacant').length,
  totalTenants: tenants.length,
  totalRentCollected: rentPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
  pendingRent: rentPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
  overdueRent: rentPayments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0),
  pendingMaintenance: maintenanceRequests.filter(m => m.status === 'pending').length,
  inProgressMaintenance: maintenanceRequests.filter(m => m.status === 'in-progress').length,
};
