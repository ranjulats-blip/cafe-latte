DROP POLICY IF EXISTS "orders insert any" ON public.orders;
CREATE POLICY "orders insert guest or self" ON public.orders
FOR INSERT WITH CHECK (
  user_id IS NULL OR user_id = auth.uid()
);