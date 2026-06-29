-- 1. Create Journal Entries Table (Supports 768-dim vector)
CREATE TABLE public.journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(768),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_journal_modtime
    BEFORE UPDATE ON public.journal_entries
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- HNSW Vector Index for efficient similarity search using cosine distance
CREATE INDEX ON public.journal_entries 
USING hnsw (embedding vector_cosine_ops);

-- 2. Create Chat Messages Table (Representing AI Coach conversations)
CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    role TEXT NOT NULL CHECK (role IN ('user', 'model', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Vector Match Function (similarity recall function called via RPC)
CREATE OR REPLACE FUNCTION public.match_journal_entries (
  query_embedding VECTOR(768),
  match_threshold FLOAT,
  match_count INT,
  p_user_id UUID
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  created_at TIMESTAMPTZ,
  similarity FLOAT
)
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    journal_entries.id,
    journal_entries.title,
    journal_entries.content,
    journal_entries.created_at,
    (1 - (journal_entries.embedding <=> query_embedding))::FLOAT AS similarity
  FROM journal_entries
  WHERE journal_entries.user_id = auth.uid()
    AND journal_entries.user_id = p_user_id
    AND 1 - (journal_entries.embedding <=> query_embedding) > match_threshold
  ORDER BY journal_entries.embedding <=> query_embedding ASC
  LIMIT match_count;
END;
$$;
