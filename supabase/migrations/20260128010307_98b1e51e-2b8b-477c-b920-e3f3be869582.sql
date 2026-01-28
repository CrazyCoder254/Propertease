-- Create property type enum
CREATE TYPE public.property_type AS ENUM ('apartment', 'house', 'condo', 'commercial');

-- Create property status enum
CREATE TYPE public.property_status AS ENUM ('occupied', 'vacant', 'maintenance');

-- Create rent status enum
CREATE TYPE public.rent_status AS ENUM ('paid', 'pending', 'overdue');

-- Create priority enum
CREATE TYPE public.priority_level AS ENUM ('low', 'medium', 'high');

-- Create maintenance status enum
CREATE TYPE public.maintenance_status AS ENUM ('pending', 'in-progress', 'completed');

-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  type property_type NOT NULL DEFAULT 'apartment',
  units INTEGER NOT NULL DEFAULT 1,
  rent_amount DECIMAL(10,2) NOT NULL,
  status property_status NOT NULL DEFAULT 'vacant',
  landlord_id UUID NOT NULL,
  tenant_id UUID,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tenants table
CREATE TABLE public.tenants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  move_in_date DATE NOT NULL,
  lease_end DATE NOT NULL,
  rent_status rent_status NOT NULL DEFAULT 'pending',
  avatar TEXT,
  landlord_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key for tenant_id in properties (after tenants table exists)
ALTER TABLE public.properties 
  ADD CONSTRAINT fk_properties_tenant 
  FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE SET NULL;

-- Create maintenance requests table
CREATE TABLE public.maintenance_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
  requester_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority priority_level NOT NULL DEFAULT 'medium',
  status maintenance_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rent payments table
CREATE TABLE public.rent_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status rent_status NOT NULL DEFAULT 'pending',
  month TEXT NOT NULL,
  landlord_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rent_payments ENABLE ROW LEVEL SECURITY;

-- Properties RLS Policies
CREATE POLICY "Admins can manage all properties"
  ON public.properties FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Landlords can manage their own properties"
  ON public.properties FOR ALL
  USING (auth.uid() = landlord_id);

CREATE POLICY "Tenants can view properties they rent"
  ON public.properties FOR SELECT
  USING (auth.uid() = tenant_id);

-- Tenants RLS Policies
CREATE POLICY "Admins can manage all tenants"
  ON public.tenants FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Landlords can manage their tenants"
  ON public.tenants FOR ALL
  USING (auth.uid() = landlord_id);

CREATE POLICY "Tenants can view their own record"
  ON public.tenants FOR SELECT
  USING (auth.uid() = user_id);

-- Maintenance Requests RLS Policies
CREATE POLICY "Admins can manage all maintenance requests"
  ON public.maintenance_requests FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Landlords can manage maintenance for their properties"
  ON public.maintenance_requests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE properties.id = maintenance_requests.property_id 
      AND properties.landlord_id = auth.uid()
    )
  );

CREATE POLICY "Tenants can view and create their own requests"
  ON public.maintenance_requests FOR SELECT
  USING (auth.uid() = requester_id);

CREATE POLICY "Tenants can create maintenance requests"
  ON public.maintenance_requests FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Tenants can update their pending requests"
  ON public.maintenance_requests FOR UPDATE
  USING (auth.uid() = requester_id AND status = 'pending');

-- Rent Payments RLS Policies
CREATE POLICY "Admins can manage all rent payments"
  ON public.rent_payments FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Landlords can manage rent for their properties"
  ON public.rent_payments FOR ALL
  USING (auth.uid() = landlord_id);

CREATE POLICY "Tenants can view their rent payments"
  ON public.rent_payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tenants 
      WHERE tenants.id = rent_payments.tenant_id 
      AND tenants.user_id = auth.uid()
    )
  );

-- Add triggers for updated_at
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maintenance_requests_updated_at
  BEFORE UPDATE ON public.maintenance_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rent_payments_updated_at
  BEFORE UPDATE ON public.rent_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();