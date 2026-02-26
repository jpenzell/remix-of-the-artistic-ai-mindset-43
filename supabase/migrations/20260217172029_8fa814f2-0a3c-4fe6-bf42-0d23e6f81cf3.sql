
-- Fix responses INSERT: presenter can also insert on behalf of participants
DROP POLICY IF EXISTS "Users can submit own responses" ON public.responses;
CREATE POLICY "Users can submit own responses"
  ON public.responses FOR INSERT TO authenticated
  WITH CHECK (
    participant_id = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM public.polls p
      JOIN public.sessions s ON s.id = p.session_id
      WHERE p.id = poll_id AND s.presenter_id = auth.uid()
    )
  );

-- Fix story_volunteers INSERT: presenter can add voluntold entries
DROP POLICY IF EXISTS "Authenticated can volunteer" ON public.story_volunteers;
CREATE POLICY "Authenticated can volunteer"
  ON public.story_volunteers FOR INSERT TO authenticated
  WITH CHECK (
    participant_id = auth.uid()::text
    OR public.is_session_presenter(session_id)
  );

-- Fix story_volunteers UPDATE: allow participant to reclaim their slot OR presenter to update
DROP POLICY IF EXISTS "Presenter can update volunteers" ON public.story_volunteers;
CREATE POLICY "Presenter or self can update volunteers"
  ON public.story_volunteers FOR UPDATE TO authenticated
  USING (
    public.is_session_presenter(session_id)
    OR participant_id = auth.uid()::text
  );

-- Fix story_words INSERT: presenter can add words too
DROP POLICY IF EXISTS "Authenticated can add words" ON public.story_words;
CREATE POLICY "Authenticated can add words"
  ON public.story_words FOR INSERT TO authenticated
  WITH CHECK (
    added_by = auth.uid()::text
    OR public.is_session_presenter(session_id)
  );

-- Fix story_topics INSERT: presenter can submit topics too
DROP POLICY IF EXISTS "Authenticated can submit topics" ON public.story_topics;
CREATE POLICY "Authenticated can submit topics"
  ON public.story_topics FOR INSERT TO authenticated
  WITH CHECK (
    submitted_by = auth.uid()::text
    OR public.is_session_presenter(session_id)
  );

-- Fix story_topic_votes INSERT: allow presenter too
DROP POLICY IF EXISTS "Authenticated can vote" ON public.story_topic_votes;
CREATE POLICY "Authenticated can vote"
  ON public.story_topic_votes FOR INSERT TO authenticated
  WITH CHECK (
    participant_id = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM public.story_topics t
      JOIN public.sessions s ON s.id = t.session_id
      WHERE t.id = topic_id AND s.presenter_id = auth.uid()
    )
  );

-- Fix story_game_state: also allow INSERT from presenter (already correct but ensure)
-- Polls: allow presenter to create (already uses is_session_presenter, which is correct)
