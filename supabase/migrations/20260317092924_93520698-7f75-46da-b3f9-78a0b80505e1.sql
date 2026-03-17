
-- Allow tenants to update their own maintenance requests regardless of status
DROP POLICY IF EXISTS "Tenants can update their pending requests" ON public.maintenance_requests;

CREATE POLICY "Tenants can update their own requests"
ON public.maintenance_requests
FOR UPDATE
TO authenticated
USING (auth.uid() = requester_id)
WITH CHECK (auth.uid() = requester_id);

-- Also add DELETE policy for tenants on their own requests
DROP POLICY IF EXISTS "Tenants can delete their own requests" ON public.maintenance_requests;

CREATE POLICY "Tenants can delete their own requests"
ON public.maintenance_requests
FOR DELETE
TO authenticated
USING (auth.uid() = requester_id);
