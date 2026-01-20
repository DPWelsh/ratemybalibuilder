-- Track user progress through guide chapters
CREATE TABLE IF NOT EXISTS public.guide_progress (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  chapter_slug text NOT NULL,
  completed_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT guide_progress_pkey PRIMARY KEY (id),
  CONSTRAINT guide_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT guide_progress_unique UNIQUE (user_id, chapter_slug)
);

-- Index for fast lookups by user
CREATE INDEX IF NOT EXISTS guide_progress_user_id_idx ON public.guide_progress(user_id);

-- RLS policies
ALTER TABLE public.guide_progress ENABLE ROW LEVEL SECURITY;

-- Users can view their own progress
CREATE POLICY "Users can view own guide progress"
ON public.guide_progress FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert own guide progress"
ON public.guide_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own progress (to mark incomplete)
CREATE POLICY "Users can delete own guide progress"
ON public.guide_progress FOR DELETE
USING (auth.uid() = user_id);
