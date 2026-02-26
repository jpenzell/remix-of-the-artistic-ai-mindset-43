-- Create sessions table for presentation instances
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  current_slide TEXT DEFAULT 'P1',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create poll_type enum
CREATE TYPE public.poll_type AS ENUM ('multiple_choice', 'slider', 'text');

-- Create polls table for tracking active polls
CREATE TABLE public.polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  slide_id TEXT NOT NULL,
  poll_type poll_type NOT NULL,
  poll_config JSONB DEFAULT '{}',
  is_open BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(session_id, slide_id)
);

-- Create responses table for participant votes
CREATE TABLE public.responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  participant_id TEXT NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(poll_id, participant_id)
);

-- Enable RLS on all tables
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;

-- Sessions policies: anyone can create and read sessions
CREATE POLICY "Anyone can create sessions" ON public.sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read active sessions" ON public.sessions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update sessions" ON public.sessions
  FOR UPDATE USING (true);

-- Polls policies: anyone can read and manage polls
CREATE POLICY "Anyone can create polls" ON public.polls
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read polls" ON public.polls
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update polls" ON public.polls
  FOR UPDATE USING (true);

-- Responses policies: anyone can submit and view responses
CREATE POLICY "Anyone can submit responses" ON public.responses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read responses" ON public.responses
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update their response" ON public.responses
  FOR UPDATE USING (true);

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.polls;
ALTER PUBLICATION supabase_realtime ADD TABLE public.responses;