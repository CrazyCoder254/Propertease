-- Tenant access fallback by profile email to support accounts not yet linked via tenants.user_id

-- 1) Tenants table: allow tenant to read their own tenant row either by user_id or matching profile email
DROP POLICY IF EXISTS "Tenants can view their own record" ON public.tenants;

CREATE POLICY "Tenants can view their own record"
ON public.tenants
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND lower(p.email) = lower(tenants.email)
  )
);

-- 2) Properties table: allow tenants to view assigned properties by linked tenant user_id OR profile email match
DROP POLICY IF EXISTS "Tenants can view properties they rent" ON public.properties;

CREATE POLICY "Tenants can view properties they rent"
ON public.properties
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.tenants t
    WHERE t.id = properties.tenant_id
      AND t.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1
    FROM public.tenants t
    WHERE t.property_id = properties.id
      AND t.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1
    FROM public.tenants t
    JOIN public.profiles p ON lower(p.email) = lower(t.email)
    WHERE p.user_id = auth.uid()
      AND (t.id = properties.tenant_id OR t.property_id = properties.id)
  )
);

-- 3) Rent payments: tenant SELECT/INSERT/UPDATE by linked user_id OR profile email match
DROP POLICY IF EXISTS "Tenants can view their rent payments" ON public.rent_payments;
DROP POLICY IF EXISTS "Tenants can insert their own rent payments" ON public.rent_payments;
DROP POLICY IF EXISTS "Tenants can update their own rent payments" ON public.rent_payments;

CREATE POLICY "Tenants can view their rent payments"
ON public.rent_payments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.tenants t
    WHERE t.id = rent_payments.tenant_id
      AND t.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1
    FROM public.tenants t
    JOIN public.profiles p ON lower(p.email) = lower(t.email)
    WHERE t.id = rent_payments.tenant_id
      AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Tenants can insert their own rent payments"
ON public.rent_payments
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.tenants t
    WHERE t.id = rent_payments.tenant_id
      AND t.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1
    FROM public.tenants t
    JOIN public.profiles p ON lower(p.email) = lower(t.email)
    WHERE t.id = rent_payments.tenant_id
      AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Tenants can update their own rent payments"
ON public.rent_payments
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.tenants t
    WHERE t.id = rent_payments.tenant_id
      AND t.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1
    FROM public.tenants t
    JOIN public.profiles p ON lower(p.email) = lower(t.email)
    WHERE t.id = rent_payments.tenant_id
      AND p.user_id = auth.uid()
  )
);