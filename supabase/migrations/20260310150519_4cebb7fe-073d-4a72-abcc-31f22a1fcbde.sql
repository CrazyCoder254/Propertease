
-- Fix properties RLS for tenants: current policy compares auth.uid() to tenant_id (which is a tenants table UUID, not auth user ID)
DROP POLICY IF EXISTS "Tenants can view properties they rent" ON public.properties;

CREATE POLICY "Tenants can view properties they rent"
ON public.properties
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.tenants
    WHERE tenants.id = properties.tenant_id
    AND tenants.user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM public.tenants
    WHERE tenants.property_id = properties.id
    AND tenants.user_id = auth.uid()
  )
);

-- Add INSERT policy for tenants on rent_payments
CREATE POLICY "Tenants can insert their own rent payments"
ON public.rent_payments
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.tenants
    WHERE tenants.id = rent_payments.tenant_id
    AND tenants.user_id = auth.uid()
  )
);

-- Add UPDATE policy for tenants on rent_payments (to mark as paid)
CREATE POLICY "Tenants can update their own rent payments"
ON public.rent_payments
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.tenants
    WHERE tenants.id = rent_payments.tenant_id
    AND tenants.user_id = auth.uid()
  )
);
