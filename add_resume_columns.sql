-- Add resume storage columns to candidates table
ALTER TABLE candidates 
ADD COLUMN IF NOT EXISTS resume_text TEXT,
ADD COLUMN IF NOT EXISTS resume_url TEXT,
ADD COLUMN IF NOT EXISTS resume_embedding vector(1536);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS idx_candidates_resume_embedding 
ON candidates USING ivfflat (resume_embedding vector_cosine_ops)
WITH (lists = 100);
