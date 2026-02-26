
-- Add presenter_id to sessions (references auth.users)
ALTER TABLE public.sessions ADD COLUMN presenter_id uuid REFERENCES auth.users(id);

-- Drop ALL existing permissive RLS policies
DROP POLICY IF EXISTS "Anyone can create sessions" ON public.sessions;
DROP POLICY IF EXISTS "Anyone can read active sessions" ON public.sessions;
DROP POLICY IF EXISTS "Anyone can update sessions" ON public.sessions;

DROP POLICY IF EXISTS "Anyone can create polls" ON public.polls;
DROP POLICY IF EXISTS "Anyone can read polls" ON public.polls;
DROP POLICY IF EXISTS "Anyone can update polls" ON public.polls;

DROP POLICY IF EXISTS "Anyone can read responses" ON public.responses;
DROP POLICY IF EXISTS "Anyone can submit responses" ON public.responses;
DROP POLICY IF EXISTS "Anyone can update their response" ON public.responses;

DROP POLICY IF EXISTS "Anyone can read topics" ON public.story_topics;
DROP POLICY IF EXISTS "Anyone can submit topics" ON public.story_topics;
DROP POLICY IF EXISTS "Anyone can update topics" ON public.story_topics;

DROP POLICY IF EXISTS "Anyone can read votes" ON public.story_topic_votes;
DROP POLICY IF EXISTS "Anyone can vote" ON public.story_topic_votes;

DROP POLICY IF EXISTS "Anyone can read volunteers" ON public.story_volunteers;
DROP POLICY IF EXISTS "Anyone can update volunteers" ON public.story_volunteers;
DROP POLICY IF EXISTS "Anyone can volunteer" ON public.story_volunteers;

DROP POLICY IF EXISTS "Anyone can read words" ON public.story_words;
DROP POLICY IF EXISTS "Anyone can add words" ON public.story_words;

DROP POLICY IF EXISTS "Anyone can create game state" ON public.story_game_state;
DROP POLICY IF EXISTS "Anyone can read game state" ON public.story_game_state;
DROP POLICY IF EXISTS "Anyone can update game state" ON public.story_game_state;

-- Helper function: check if user is presenter for a session
CREATE OR REPLACE FUNCTION public.is_session_presenter(_session_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.sessions
    WHERE id = _session_id AND presenter_id = auth.uid()
  )
$$;

-- SESSIONS policies
CREATE POLICY "Authenticated users can read active sessions"
  ON public.sessions FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create sessions"
  ON public.sessions FOR INSERT TO authenticated
  WITH CHECK (presenter_id = auth.uid());

CREATE POLICY "Only presenter can update session"
  ON public.sessions FOR UPDATE TO authenticated
  USING (presenter_id = auth.uid());

-- POLLS policies
CREATE POLICY "Authenticated users can read polls"
  ON public.polls FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Presenter can create polls"
  ON public.polls FOR INSERT TO authenticated
  WITH CHECK (public.is_session_presenter(session_id));

CREATE POLICY "Presenter can update polls"
  ON public.polls FOR UPDATE TO authenticated
  USING (public.is_session_presenter(session_id));

-- RESPONSES policies
CREATE POLICY "Authenticated users can read responses"
  ON public.responses FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can submit own responses"
  ON public.responses FOR INSERT TO authenticated
  WITH CHECK (participant_id = auth.uid()::text);

CREATE POLICY "Users can update own responses"
  ON public.responses FOR UPDATE TO authenticated
  USING (participant_id = auth.uid()::text);

-- Allow presenter to delete responses (for clearResponses)
CREATE POLICY "Presenter can delete responses"
  ON public.responses FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.polls p
      JOIN public.sessions s ON s.id = p.session_id
      WHERE p.id = poll_id AND s.presenter_id = auth.uid()
    )
  );

-- STORY_TOPICS policies
CREATE POLICY "Authenticated can read topics"
  ON public.story_topics FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated can submit topics"
  ON public.story_topics FOR INSERT TO authenticated
  WITH CHECK (submitted_by = auth.uid()::text);

CREATE POLICY "Presenter can update topics"
  ON public.story_topics FOR UPDATE TO authenticated
  USING (public.is_session_presenter(session_id));

-- STORY_TOPIC_VOTES policies
CREATE POLICY "Authenticated can read votes"
  ON public.story_topic_votes FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated can vote"
  ON public.story_topic_votes FOR INSERT TO authenticated
  WITH CHECK (participant_id = auth.uid()::text);

-- STORY_VOLUNTEERS policies
CREATE POLICY "Authenticated can read volunteers"
  ON public.story_volunteers FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated can volunteer"
  ON public.story_volunteers FOR INSERT TO authenticated
  WITH CHECK (participant_id = auth.uid()::text);

CREATE POLICY "Presenter can update volunteers"
  ON public.story_volunteers FOR UPDATE TO authenticated
  USING (public.is_session_presenter(session_id));

-- STORY_WORDS policies
CREATE POLICY "Authenticated can read words"
  ON public.story_words FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated can add words"
  ON public.story_words FOR INSERT TO authenticated
  WITH CHECK (added_by = auth.uid()::text);

-- STORY_GAME_STATE policies
CREATE POLICY "Authenticated can read game state"
  ON public.story_game_state FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Presenter can create game state"
  ON public.story_game_state FOR INSERT TO authenticated
  WITH CHECK (public.is_session_presenter(session_id));

CREATE POLICY "Presenter can update game state"
  ON public.story_game_state FOR UPDATE TO authenticated
  USING (public.is_session_presenter(session_id));
