-- Backfill existing tenant rows by matching tenant email with authenticated tenant profiles
WITH tenant_profiles AS (
  SELECT p.user_id, p.email
  FROM public.profiles p
  JOIN public.user_roles ur ON ur.user_id = p.user_id
  WHERE ur.role = 'tenant'
)
UPDATE public.tenants t
SET user_id = tp.user_id,
    updated_at = now()
FROM tenant_profiles tp
WHERE t.user_id IS NULL
  AND lower(t.email) = lower(tp.email);

-- Ensure future signups auto-link to pre-created tenant records
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');

  -- Assign default role (tenant) if no role specified
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'tenant'::app_role)
  );

  -- Link existing tenant records created by landlords using matching email
  UPDATE public.tenants
  SET user_id = NEW.id,
      updated_at = now()
  WHERE user_id IS NULL
    AND lower(email) = lower(NEW.email);

  RETURN NEW;
END;
$function$;