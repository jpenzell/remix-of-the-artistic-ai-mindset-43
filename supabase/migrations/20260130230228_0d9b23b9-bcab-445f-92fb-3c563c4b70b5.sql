-- Create table for story topics (suggestions from audience)
CREATE TABLE public.story_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  submitted_by TEXT NOT NULL,
  vote_count INTEGER DEFAULT 0,
  is_winner BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for topic votes
CREATE TABLE public.story_topic_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID NOT NULL REFERENCES public.story_topics(id) ON DELETE CASCADE,
  participant_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(topic_id, participant_id)
);

-- Create table for story volunteers
CREATE TABLE public.story_volunteers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  participant_id TEXT NOT NULL,
  participant_name TEXT NOT NULL DEFAULT 'Writer',
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(session_id, participant_id),
  UNIQUE(session_id, position)
);

-- Create table for story words
CREATE TABLE public.story_words (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  added_by TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for story game state
CREATE TABLE public.story_game_state (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE UNIQUE,
  stage TEXT NOT NULL DEFAULT 'collecting', -- collecting, voting, volunteering, writing, complete
  max_volunteers INTEGER DEFAULT 5,
  current_writer_position INTEGER DEFAULT 1,
  topic TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.story_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_topic_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_game_state ENABLE ROW LEVEL SECURITY;

-- RLS policies for story_topics
CREATE POLICY "Anyone can read topics" ON public.story_topics FOR SELECT USING (true);
CREATE POLICY "Anyone can submit topics" ON public.story_topics FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update topics" ON public.story_topics FOR UPDATE USING (true);

-- RLS policies for story_topic_votes
CREATE POLICY "Anyone can read votes" ON public.story_topic_votes FOR SELECT USING (true);
CREATE POLICY "Anyone can vote" ON public.story_topic_votes FOR INSERT WITH CHECK (true);

-- RLS policies for story_volunteers
CREATE POLICY "Anyone can read volunteers" ON public.story_volunteers FOR SELECT USING (true);
CREATE POLICY "Anyone can volunteer" ON public.story_volunteers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update volunteers" ON public.story_volunteers FOR UPDATE USING (true);

-- RLS policies for story_words
CREATE POLICY "Anyone can read words" ON public.story_words FOR SELECT USING (true);
CREATE POLICY "Anyone can add words" ON public.story_words FOR INSERT WITH CHECK (true);

-- RLS policies for story_game_state
CREATE POLICY "Anyone can read game state" ON public.story_game_state FOR SELECT USING (true);
CREATE POLICY "Anyone can create game state" ON public.story_game_state FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update game state" ON public.story_game_state FOR UPDATE USING (true);

-- Enable realtime for all story tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.story_topics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.story_topic_votes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.story_volunteers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.story_words;
ALTER PUBLICATION supabase_realtime ADD TABLE public.story_game_state;