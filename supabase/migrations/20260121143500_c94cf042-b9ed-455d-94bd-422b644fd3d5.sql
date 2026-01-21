-- Add UPDATE policy for summaries table to allow export_type and export_url updates
CREATE POLICY "Users can update summaries of their own documents"
  ON public.summaries
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.documents
    WHERE public.documents.id = public.summaries.doc_id
    AND public.documents.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.documents
    WHERE public.documents.id = public.summaries.doc_id
    AND public.documents.user_id = auth.uid()
  ));