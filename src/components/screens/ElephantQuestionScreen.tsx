import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/contexts/SessionContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, 
  Loader2, 
  ChevronRight,
  MessageSquare,
  Hand,
  PenTool,
  Bot,
  Users,
  RotateCcw,
  Play,
  CheckCircle2
} from "lucide-react";
import levisStadiumImg from "@/assets/levis-stadium.jpg";

type Stage = "volunteering" | "answering" | "ai-compare";

// Fixed question - revealed only when answering starts
const FIXED_QUESTION = "How many elephants can fit inside Petco Park in San Diego, California?";

interface Volunteer {
  id: string;
  participant_id: string;
  participant_name: string;
  position: number;
}

interface AnswerWord {
  id: string;
  word: string;
  added_by: string;
  position: number;
}

export const ElephantQuestionScreen = () => {
  const { session, isPresenter, participantId, isSoloMode } = useSession();
  const { toast } = useToast();

  // Stage state - solo mode skips straight to AI comparison
  const [stage, setStage] = useState<Stage>(isSoloMode ? "ai-compare" : "volunteering");
  
  // Treat solo mode as presenter for controls
  const canControl = isPresenter || isSoloMode;
  
  // Volunteer/answer state - reuses volunteers from P5 (One Word Story)
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [words, setWords] = useState<AnswerWord[]>([]);
  const [currentWriterPosition, setCurrentWriterPosition] = useState(1);
  const [maxVolunteers, setMaxVolunteers] = useState(5);
  
  // Input state
  const [newWord, setNewWord] = useState("");
  const [reconnectName, setReconnectName] = useState("");
  const [showReconnect, setShowReconnect] = useState(false);
  
  // AI comparison state
  const [aiAnswers, setAiAnswers] = useState<{model: string, answer: string}[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [streamingModelName, setStreamingModelName] = useState<string | null>(null);

  // Audience answer collection state
  const [audienceAnswers, setAudienceAnswers] = useState<{name: string, number: number, note?: string}[]>([]);
  const [newAudienceName, setNewAudienceName] = useState("");
  const [newAudienceNumber, setNewAudienceNumber] = useState("");

  // Solo mode: stream AI answers one at a time on mount
  const soloModels = [
    "ChatGPT", "Claude", "Gemini", "Copilot", "Perplexity", "Grok", "ChatGPT (retry)", "Claude (retry)"
  ];

  useEffect(() => {
    if (!isSoloMode || stage !== "ai-compare") return;
    let cancelled = false;
    
    const fetchNext = async (index: number) => {
      if (cancelled || index >= soloModels.length) {
        setStreamingModelName(null);
        setIsLoadingAI(false);
        return;
      }
      
      const model = soloModels[index];
      setStreamingModelName(model);
      setIsLoadingAI(true);
      
      try {
        const { data, error } = await supabase.functions.invoke('test-prompt', {
          body: { 
            prompt: FIXED_QUESTION,
            context: `You are ${model.replace(' (retry)', '')}. Answer this estimation question. State your assumptions clearly, then give a specific number. Be confident. Keep it to 2-3 sentences. Give a different answer and reasoning than before.`
          }
        });
        
        if (!cancelled && !error && data?.response) {
          setAiAnswers(prev => [...prev, { model, answer: data.response }]);
        }
      } catch {
        // continue to next
      }
      
      if (!cancelled) {
        // Small delay before fetching next
        setTimeout(() => fetchNext(index + 1), 1500);
      }
    };
    
    fetchNext(0);
    return () => { cancelled = true; };
  }, [isSoloMode, stage]);

  // Demo preview state (runs during volunteering)
  const [demoWords, setDemoWords] = useState<string[]>([]);
  const [demoWriterIndex, setDemoWriterIndex] = useState(0);
  
  const demoWriters = ["Alex", "Jordan", "Sam", "Taylor", "Casey"];
  const demoAnswerWords = ["I", "think", "around", "fifty", "pennies", "could", "fit", "into", "a", "teapot."];

  // Run demo animation during volunteering stage
  useEffect(() => {
    if (stage !== 'volunteering') {
      setDemoWords([]);
      setDemoWriterIndex(0);
      return;
    }
    
    if (demoWords.length >= demoAnswerWords.length) {
      // Reset demo after a pause
      const resetTimer = setTimeout(() => {
        setDemoWords([]);
        setDemoWriterIndex(0);
      }, 2000);
      return () => clearTimeout(resetTimer);
    }
    
    const timer = setTimeout(() => {
      setDemoWords(prev => [...prev, demoAnswerWords[prev.length]]);
      setDemoWriterIndex(prev => (prev + 1) % demoWriters.length);
    }, 700);
    
    return () => clearTimeout(timer);
  }, [stage, demoWords.length]);

  // Keyboard navigation for presenter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!canControl) return;
      if (e.key === "ArrowRight" || e.key === " ") {
        // In ai-compare stage -> let PresentationLayout handle navigation
        if (stage === "ai-compare") {
          return;
        }
        // In volunteering stage with no volunteers -> start solo mode
        if (stage === "volunteering" && volunteers.length === 0) {
          e.preventDefault();
          e.stopImmediatePropagation();
          startAnswering(true);
        }
        // In answering stage -> show AI comparison (even with 0 words)
        else if (stage === "answering") {
          e.preventDefault();
          e.stopImmediatePropagation();
          showAIComparison();
        }
        // In volunteering stage with volunteers -> start answering
        else if (stage === "volunteering" && volunteers.length >= 2) {
          e.preventDefault();
          e.stopImmediatePropagation();
          startAnswering(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", handleKeyDown, { capture: true } as any);
  }, [canControl, stage, volunteers.length, words.length]);

  // Check if current user is a volunteer and if it's their turn
  const myVolunteer = volunteers.find(v => v.participant_id === participantId);
  const isMyTurn = myVolunteer && myVolunteer.position === currentWriterPosition;
  const currentWriter = volunteers.find(v => v.position === currentWriterPosition);

  useEffect(() => {
    if (!session?.id) return;

    const loadData = async () => {
      const { data: volunteersData } = await supabase
        .from('story_volunteers')
        .select('*')
        .eq('session_id', session.id)
        .order('position', { ascending: true });
      if (volunteersData) setVolunteers(volunteersData);

      const { data: wordsData } = await supabase
        .from('story_words')
        .select('*')
        .eq('session_id', session.id)
        .order('position', { ascending: true });
      if (wordsData) setWords(wordsData);

      const { data: gameState } = await supabase
        .from('story_game_state')
        .select('current_writer_position, max_volunteers, stage')
        .eq('session_id', session.id)
        .single();
      if (gameState) {
        setCurrentWriterPosition(gameState.current_writer_position || 1);
        setMaxVolunteers(gameState.max_volunteers || 3);
        // Map stage from DB if exists
        if (gameState.stage === 'answering' || gameState.stage === 'ai-compare') {
          setStage(gameState.stage as Stage);
        }
      }
    };

    loadData();
  }, [session?.id]);

  // Real-time subscriptions
  useEffect(() => {
    if (!session?.id) return;

    const channel = supabase
      .channel(`elephant:${session.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'story_volunteers',
        filter: `session_id=eq.${session.id}`
      }, async () => {
        const { data } = await supabase
          .from('story_volunteers')
          .select('*')
          .eq('session_id', session.id)
          .order('position', { ascending: true });
        if (data) setVolunteers(data);
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'story_words',
        filter: `session_id=eq.${session.id}`
      }, async () => {
        const { data } = await supabase
          .from('story_words')
          .select('*')
          .eq('session_id', session.id)
          .order('position', { ascending: true });
        if (data) setWords(data);
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'story_game_state',
        filter: `session_id=eq.${session.id}`
      }, (payload) => {
        if (payload.new) {
          const newState = payload.new as any;
          setCurrentWriterPosition(newState.current_writer_position || 1);
          setMaxVolunteers(newState.max_volunteers || 3);
          if (newState.stage === 'answering' || newState.stage === 'ai-compare') {
            setStage(newState.stage as Stage);
          }
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [session?.id]);

  // Add word action
  const addWord = async () => {
    if (!newWord.trim() || !session?.id || !isMyTurn) return;
    
    const nextPosition = words.length + 1;
    await supabase.from('story_words').insert({
      session_id: session.id,
      word: newWord.trim(),
      added_by: participantId,
      position: nextPosition
    });
    
    const nextWriter = (currentWriterPosition % volunteers.length) + 1;
    await supabase
      .from('story_game_state')
      .update({ current_writer_position: nextWriter })
      .eq('session_id', session.id);
    
    setNewWord("");
  };

  // Add word (presenter can always add for demo purposes)
  const addWordAsPresenter = async () => {
    if (!newWord.trim()) return;
    if (!canControl && !isMyTurn) return;
    
    // If session exists, save to database
    if (session?.id) {
      const nextPosition = words.length + 1;
      await supabase.from('story_words').insert({
        session_id: session.id,
        word: newWord.trim(),
        added_by: participantId,
        position: nextPosition
      });
      
      // Advance to next writer if there are volunteers
      if (volunteers.length > 0) {
        const nextWriter = (currentWriterPosition % volunteers.length) + 1;
        await supabase
          .from('story_game_state')
          .update({ current_writer_position: nextWriter })
          .eq('session_id', session.id);
      }
    } else {
      // Local mode - add to local state
      setWords(prev => [...prev, { 
        id: `local-${Date.now()}`, 
        word: newWord.trim(), 
        added_by: 'presenter', 
        position: prev.length + 1 
      }]);
    }
    
    setNewWord("");
  };

  // Reconnect to existing volunteer slot by name
  const reconnectAsVolunteer = async () => {
    if (!session?.id || !reconnectName.trim()) return;
    
    const matchingVolunteer = volunteers.find(
      v => v.participant_name.toLowerCase() === reconnectName.trim().toLowerCase()
    );
    
    if (matchingVolunteer) {
      await supabase
        .from('story_volunteers')
        .update({ participant_id: participantId })
        .eq('id', matchingVolunteer.id);
      
      toast({
        title: "Reconnected!",
        description: `You're Writer #${matchingVolunteer.position} again.`,
      });
      setReconnectName("");
      setShowReconnect(false);
    } else {
      toast({
        title: "Name not found",
        description: "No writer with that name. Check the spelling!",
        variant: "destructive",
      });
    }
  };

  // Presenter: Start answering (reveals the question)
  // Can start with or without volunteers (solo mode)
  const startAnswering = async (soloMode = false) => {
    if (!canControl) return;
    if (!soloMode && volunteers.length < 2) return;
    
    if (session?.id) {
      await supabase
        .from('story_game_state')
        .upsert({
          session_id: session.id,
          stage: 'answering',
          current_writer_position: 1,
          max_volunteers: soloMode ? 1 : maxVolunteers,
          topic: FIXED_QUESTION
        }, { onConflict: 'session_id' });
    }
    
    setCurrentWriterPosition(1);
    setStage("answering");
  };

  // Presenter: Show AI comparison
  const showAIComparison = async () => {
    setStage("ai-compare");
    setIsLoadingAI(true);
    
    try {
      const models = ["ChatGPT", "Claude", "Gemini"];
      const responses: {model: string, answer: string}[] = [];
      
      for (const model of models) {
        const { data, error } = await supabase.functions.invoke('test-prompt', {
          body: { 
            prompt: FIXED_QUESTION,
            context: `You are ${model}. Answer this estimation question. State your assumptions clearly, then give a specific number. Be confident. Keep it to 2-3 sentences.`
          }
        });
        
        if (!error && data?.response) {
          responses.push({ model, answer: data.response });
        }
      }
      
      setAiAnswers(responses);
    } catch (error) {
      console.error('Error getting AI responses:', error);
      toast({
        title: "Error",
        description: "Failed to get AI responses",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Reset game
  const resetGame = async () => {
    if (!canControl) return;
    
    if (session?.id) {
      await supabase.from('story_words').delete().eq('session_id', session.id);
      await supabase.from('story_volunteers').delete().eq('session_id', session.id);
      
      await supabase
        .from('story_game_state')
        .update({
          stage: 'volunteering',
          current_writer_position: 1,
          topic: null
        })
        .eq('session_id', session.id);
    }
    
    setVolunteers([]);
    setWords([]);
    setAiAnswers([]);
    setCurrentWriterPosition(1);
    setStage("volunteering");
  };

  const humanAnswer = words.map(w => w.word).join(" ");

  // Stage indicators
  const stages = [
    { key: 'volunteering', label: 'Ready', icon: Users },
    { key: 'answering', label: 'Answer', icon: PenTool },
    { key: 'ai-compare', label: 'AI Compare', icon: Bot },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/30 rounded-full mb-3">
            <MessageSquare className="h-3.5 w-3.5 text-accent" />
            <span className="text-accent font-semibold tracking-wide text-xs uppercase">
              {stage === "volunteering" ? "Round 2: One-Word Answer" : "The Estimation Challenge"}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {stage === "volunteering" && "Ready for Round 2?"}
            {stage === "answering" && "Build the Answer"}
            {stage === "ai-compare" && "Human vs AI"}
          </h1>
        </div>

        {/* Stage Progress */}
        <div className="flex justify-center gap-2 md:gap-4 mb-6">
          {stages.map((s, i) => {
            const Icon = s.icon;
            const isActive = s.key === stage;
            const isPast = stages.findIndex(st => st.key === stage) > i;
            return (
              <div
                key={s.key}
                className={`flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : isPast
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted/50 text-muted-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* STAGE: Volunteering (Question NOT yet revealed) */}
        {stage === "volunteering" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Demo Preview */}
            <div className="bg-gradient-to-br from-accent/10 to-secondary/10 border-2 border-accent/30 rounded-2xl p-5 space-y-3">
              <h3 className="text-lg font-bold text-accent flex items-center gap-2">
                <Play className="h-5 w-5" />
                Same Game, New Question!
              </h3>
              
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <p className="text-sm text-muted-foreground">This time you'll answer:</p>
                <p className="text-lg font-medium text-foreground mt-1">"How many [X] can fit in [Y]?"</p>
              </div>
              
              {/* Demo Answer Display */}
              <div className="bg-card/80 border border-border/50 rounded-xl p-4 min-h-[80px]">
                <p className="text-foreground text-xl md:text-2xl leading-relaxed">
                  {demoWords.length === 0 ? (
                    <span className="text-muted-foreground italic">Answer starts here...</span>
                  ) : (
                    <>
                      {demoWords.join(" ")}
                      <span className="animate-pulse text-primary">▌</span>
                    </>
                  )}
                </p>
              </div>
              
              {/* Demo Writer Indicator */}
              <div className="flex justify-center">
                <div className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold animate-pulse">
                  🎤 {demoWriters[demoWriterIndex]}'s turn!
                </div>
              </div>
              
              {/* Demo Writer Roster */}
              <div className="flex justify-center gap-1.5 flex-wrap">
                {demoWriters.map((name, i) => (
                  <div
                    key={name}
                    className={`px-2 py-0.5 rounded-full text-xs transition-all ${
                      i === demoWriterIndex
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-muted-foreground'
                    }`}
                  >
                    {i + 1}. {name}
                  </div>
                ))}
              </div>
              
              <p className="text-center text-xs text-muted-foreground">
                Each person adds one word, then it's the next person's turn!
              </p>
            </div>

            {/* Right: Ready Team */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-secondary/20 to-primary/10 border-2 border-secondary/40 rounded-2xl p-6 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  🎯 Same Team, New Challenge!
                </h2>
                <p className="text-muted-foreground">
                  {isSoloMode && volunteers.length === 0
                    ? "Same rules — one word at a time!"
                    : `Our ${volunteers.length} writers are ready for round two!`}
                </p>
              </div>

              {/* Presenter/Solo View */}
              {canControl ? (
                <div className="bg-card/50 border border-border/50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Users className="h-6 w-6 text-secondary" />
                    {isSoloMode && volunteers.length === 0 ? "Ready to Go" : `Your Writers (${volunteers.length})`}
                  </h3>
                  
                  {/* Volunteer slots - show actual volunteers from P5 */}
                  {volunteers.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {volunteers.map((vol) => (
                        <div
                          key={vol.id}
                          className="p-3 rounded-xl border-2 text-center border-primary bg-primary/10"
                        >
                          <div className="text-xl font-bold mb-1">{vol.position}</div>
                          <div className="text-sm truncate text-primary font-medium">
                            {vol.participant_name}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : isSoloMode ? (
                    <div className="bg-muted/30 rounded-xl p-4 mb-6 text-center">
                      <p className="text-muted-foreground text-sm">Ask for 3 volunteers, then start!</p>
                    </div>
                  ) : (
                    <div className="bg-muted/30 rounded-xl p-4 mb-6 text-center">
                      <p className="text-muted-foreground text-sm">Waiting for volunteers to join...</p>
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-3">
                    {volunteers.length >= 2 && (
                      <Button 
                        onClick={() => startAnswering(false)} 
                        size="lg"
                        className="gap-2 w-full"
                      >
                        Reveal the Question!
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      onClick={() => startAnswering(true)} 
                      variant={volunteers.length >= 2 ? "outline" : "default"}
                      size="lg"
                      className="gap-2 w-full"
                    >
                      <PenTool className="h-4 w-4" />
                      Solo Mode (I'll type the words)
                    </Button>
                  </div>
                </div>
              ) : (
                /* Participant View */
                <div className="bg-card/50 border border-border/50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-secondary" />
                    Your Team ({volunteers.length})
                  </h3>
                  
                  {/* Show actual volunteers from P5 */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                    {volunteers.map((vol) => (
                      <div
                        key={vol.id}
                        className={`p-3 rounded-xl border-2 text-center ${
                          vol.participant_id === participantId
                            ? 'border-secondary bg-secondary/20'
                            : 'border-primary bg-primary/10'
                        }`}
                      >
                        <div className="text-xl font-bold mb-1">{vol.position}</div>
                        <div className={`text-sm truncate ${vol.participant_id === participantId ? 'text-secondary font-medium' : 'text-primary font-medium'}`}>
                          {vol.participant_name}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {myVolunteer ? (
                    <p className="text-center text-secondary font-semibold text-lg">
                      You're Writer #{myVolunteer.position}! Get ready! 🎯
                    </p>
                  ) : volunteers.length > 0 ? (
                    <div className="space-y-3">
                      {!showReconnect ? (
                        <div className="text-center">
                          <p className="text-muted-foreground mb-2">
                            Were you a writer before? Reconnect to your slot:
                          </p>
                          <Button 
                            variant="outline" 
                            onClick={() => setShowReconnect(true)}
                            className="gap-2"
                          >
                            <Hand className="h-4 w-4" />
                            Reconnect as Writer
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-center">
                          <Input
                            value={reconnectName}
                            onChange={(e) => setReconnectName(e.target.value)}
                            placeholder="Enter your name"
                            className="max-w-[180px]"
                            onKeyDown={(e) => e.key === 'Enter' && reconnectAsVolunteer()}
                          />
                          <Button onClick={reconnectAsVolunteer} disabled={!reconnectName.trim()}>
                            Reconnect
                          </Button>
                          <Button variant="ghost" onClick={() => setShowReconnect(false)}>
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground">
                      No writers yet. Complete the One-Word Story first!
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STAGE: Answering (Question NOW revealed) */}
        {stage === "answering" && (
          <div className="space-y-6">
            {/* The Question - Big Reveal with Stadium Image */}
            <div className="bg-gradient-to-br from-accent/20 to-primary/10 border-2 border-accent/40 rounded-2xl p-6 animate-fade-in">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="text-center md:text-left">
                  <p className="text-sm text-muted-foreground uppercase tracking-wider mb-3">The Estimation Challenge</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    {FIXED_QUESTION}
                  </h2>
                </div>
                <div className="rounded-xl overflow-hidden border border-accent/30">
                  <img src={levisStadiumImg} alt="Petco Park" className="w-full h-auto" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left: The Human Answer */}
              <div className="bg-card/50 border-2 border-secondary/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <PenTool className="h-5 w-5 text-secondary" />
                  The Human Answer
                </h3>
                <div className="min-h-[120px] bg-muted/30 rounded-xl p-4 text-xl md:text-2xl font-medium text-foreground">
                  {humanAnswer || <span className="text-muted-foreground italic">Waiting for the first word...</span>}
                  <span className="animate-pulse text-primary">|</span>
                </div>
              </div>

              {/* Right: Current Writer */}
              <div className="bg-primary/10 border border-primary/30 rounded-2xl p-6">
                {currentWriter && (
                  <div className="text-center mb-4">
                    <p className="text-sm text-muted-foreground uppercase tracking-wider">Now Writing</p>
                    <p className="text-2xl font-bold text-primary">
                      #{currentWriter.position}: {currentWriter.participant_name}
                    </p>
                  </div>
                )}
                
                {(isMyTurn || canControl) ? (
                  <div className="space-y-3">
                    <p className="text-center text-sm text-muted-foreground">Add ONE word to the answer:</p>
                    <div className="flex gap-3 max-w-md mx-auto">
                      <Input
                        value={newWord}
                        onChange={(e) => setNewWord(e.target.value.split(" ")[0])}
                        onKeyDown={(e) => e.key === 'Enter' && addWordAsPresenter()}
                        placeholder="Your word..."
                        className="flex-1 text-lg text-center"
                        autoFocus
                      />
                      <Button onClick={addWordAsPresenter} disabled={!newWord.trim()} size="lg">Add</Button>
                    </div>
                  </div>
                ) : myVolunteer ? (
                  <p className="text-center text-muted-foreground">Wait for your turn... (You're #{myVolunteer.position})</p>
                ) : (
                  <p className="text-center text-muted-foreground">Watch the answer being built word by word!</p>
                )}

                {/* Writer Roster */}
                <div className="mt-6 pt-4 border-t border-border/30">
                  <div className="flex justify-center gap-2 flex-wrap">
                    {volunteers.map((v) => (
                      <div
                        key={v.id}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          v.position === currentWriterPosition
                            ? 'bg-primary text-primary-foreground animate-pulse'
                            : 'bg-muted/50 text-muted-foreground'
                        }`}
                      >
                        {v.position}. {v.participant_name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Presenter/Solo Controls */}
            {canControl && (
              <div className="flex justify-center gap-3">
                <Button onClick={showAIComparison} size="lg" className="gap-2" disabled={words.length < 3}>
                  <Bot className="h-5 w-5" />
                  Compare with AI
                </Button>
                <Button onClick={resetGame} variant="outline" size="lg" className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            )}
          </div>
        )}

        {/* STAGE: AI Comparison */}
        {stage === "ai-compare" && (
          <AiCompareStage
            aiAnswers={aiAnswers}
            isLoadingAI={isLoadingAI}
            streamingModelName={streamingModelName}
            audienceAnswers={audienceAnswers}
            setAudienceAnswers={setAudienceAnswers}
            newAudienceName={newAudienceName}
            setNewAudienceName={setNewAudienceName}
            newAudienceNumber={newAudienceNumber}
            setNewAudienceNumber={setNewAudienceNumber}
            canControl={canControl}
            isSoloMode={isSoloMode}
            humanAnswer={humanAnswer}
            resetGame={resetGame}
            fixedQuestion={FIXED_QUESTION}
            stadiumImg={levisStadiumImg}
          />
        )}
      </div>
    </div>
  );
};

// ─── AI Compare Stage (extracted component) ─────────────────────────────────

// Helper: extract a number from AI answer text
function extractNumber(text: string): number | null {
  // Look for patterns like "approximately 2,000" or "around 1500" or "2000 elephants"
  const matches = text.match(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?)/g);
  if (!matches) return null;
  // Return the largest number found (likely the answer, not a dimension)
  const numbers = matches.map(m => parseFloat(m.replace(/,/g, ''))).filter(n => n >= 10);
  return numbers.length > 0 ? Math.max(...numbers) : null;
}

interface AiCompareStageProps {
  aiAnswers: {model: string, answer: string}[];
  isLoadingAI: boolean;
  streamingModelName: string | null;
  audienceAnswers: {name: string, number: number, note?: string}[];
  setAudienceAnswers: React.Dispatch<React.SetStateAction<{name: string, number: number, note?: string}[]>>;
  newAudienceName: string;
  setNewAudienceName: React.Dispatch<React.SetStateAction<string>>;
  newAudienceNumber: string;
  setNewAudienceNumber: React.Dispatch<React.SetStateAction<string>>;
  canControl: boolean;
  isSoloMode: boolean;
  humanAnswer: string;
  resetGame: () => void;
  fixedQuestion: string;
  stadiumImg: string;
}

const AiCompareStage = ({
  aiAnswers, isLoadingAI, streamingModelName,
  audienceAnswers, setAudienceAnswers,
  newAudienceName, setNewAudienceName,
  newAudienceNumber, setNewAudienceNumber,
  canControl, isSoloMode, humanAnswer, resetGame,
  fixedQuestion, stadiumImg,
}: AiCompareStageProps) => {

  const addAudienceAnswer = () => {
    const num = parseInt(newAudienceNumber.replace(/,/g, ''));
    if (isNaN(num)) return;
    const name = newAudienceName.trim() || `#${audienceAnswers.length + 1}`;
    setAudienceAnswers(prev => [...prev, { name, number: num }]);
    setNewAudienceName("");
    setNewAudienceNumber("");
  };

  // Collect all numbers for comparison
  const allNumbers = useMemo(() => {
    const nums: {source: string, number: number}[] = [];
    aiAnswers.forEach(ai => {
      const n = extractNumber(ai.answer);
      if (n) nums.push({ source: ai.model, number: n });
    });
    audienceAnswers.forEach(a => {
      nums.push({ source: a.name, number: a.number });
    });
    return nums.sort((a, b) => a.number - b.number);
  }, [aiAnswers, audienceAnswers]);

  const minNum = allNumbers.length > 0 ? allNumbers[0].number : 0;
  const maxNum = allNumbers.length > 0 ? allNumbers[allNumbers.length - 1].number : 1;
  const range = maxNum - minNum || 1;

  return (
    <div className="space-y-4">
      {/* Question */}
      <div className="bg-gradient-to-br from-accent/20 to-primary/10 border-2 border-accent/40 rounded-2xl p-4">
        <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">The Estimation Challenge</p>
        <h2 className="text-lg md:text-xl font-bold text-foreground">{fixedQuestion}</h2>
      </div>

      {/* Human Answer (session mode only) */}
      {!isSoloMode && humanAnswer && (
        <div className="bg-secondary/10 border-2 border-secondary/40 rounded-xl p-4">
          <h3 className="text-base font-bold mb-2 flex items-center gap-2 text-secondary">
            <Users className="h-4 w-4" />
            Human Answer
          </h3>
          <p className="text-foreground">{humanAnswer}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {/* Left: AI Answers */}
        <div className="bg-primary/10 border-2 border-primary/40 rounded-2xl p-4">
          <h3 className="text-base font-bold flex items-center gap-2 text-primary mb-3">
            <Bot className="h-5 w-5" />
            AI Answers
          </h3>
          
          {aiAnswers.length === 0 && isLoadingAI ? (
            <div className="flex items-center justify-center gap-2 py-6">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-muted-foreground text-sm">Asking {streamingModelName || 'the AIs'}...</span>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {aiAnswers.map((ai) => {
                const num = extractNumber(ai.answer);
                return (
                  <div key={ai.model} className="bg-card/80 rounded-lg p-3 border border-primary/20 animate-fade-in">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-primary">{ai.model}</span>
                      {num && <span className="text-xs font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full">{num.toLocaleString()}</span>}
                    </div>
                    <p className="text-foreground text-xs leading-relaxed">{ai.answer}</p>
                  </div>
                );
              })}
              {isLoadingAI && streamingModelName && (
                <div className="bg-card/40 rounded-lg p-3 border border-primary/10 border-dashed flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin text-primary" />
                  <span className="text-xs text-muted-foreground">Asking {streamingModelName}...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Audience Answers */}
        <div className="bg-secondary/10 border-2 border-secondary/40 rounded-2xl p-4">
          <h3 className="text-base font-bold flex items-center gap-2 text-secondary mb-3">
            <Users className="h-5 w-5" />
            Audience Answers
          </h3>

          {/* Entry form */}
          {canControl && (
            <div className="flex gap-2 mb-3">
              <Input
                value={newAudienceNumber}
                onChange={(e) => setNewAudienceNumber(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addAudienceAnswer()}
                placeholder="Enter a number"
                className="flex-1 text-sm h-9"
                autoFocus
              />
              <Button onClick={addAudienceAnswer} size="sm" className="h-9 px-3" disabled={!newAudienceNumber.trim()}>
                Add
              </Button>
            </div>
          )}

          {audienceAnswers.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-sm text-muted-foreground italic">
                {canControl ? "Enter answers as audience members share theirs" : "Waiting for answers..."}
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[250px] overflow-y-auto">
              {audienceAnswers.map((a, i) => (
              <div key={i} className="bg-card/80 rounded-lg px-4 py-2 border border-secondary/20 animate-fade-in flex items-center justify-center">
                  <span className="text-lg font-bold text-secondary">
                    {a.number.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Number Comparison Visualization */}
      {allNumbers.length >= 2 && (
        <div className="bg-accent/10 border-2 border-accent/30 rounded-2xl p-4">
          <h3 className="text-base font-bold flex items-center gap-2 text-accent mb-3">
            <Sparkles className="h-5 w-5" />
            The Range of "Answers" — {allNumbers.length} different numbers!
          </h3>
          <div className="relative h-16 bg-muted/30 rounded-xl overflow-hidden">
            {/* Scale bar */}
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-border/50 -translate-y-1/2" />
            {/* Number dots */}
            {allNumbers.map((item, i) => {
              const pct = ((item.number - minNum) / range) * 90 + 5; // 5-95% range
              const isAudience = audienceAnswers.some(a => a.name === item.source);
              return (
                <div
                  key={`${item.source}-${i}`}
                  className="absolute -translate-x-1/2 flex flex-col items-center transition-all duration-500"
                  style={{ left: `${pct}%`, top: '8px' }}
                >
                  <span className="text-[9px] font-medium text-muted-foreground whitespace-nowrap">{item.source}</span>
                  <div className={`w-3 h-3 rounded-full border-2 ${isAudience ? 'bg-secondary border-secondary' : 'bg-primary border-primary'}`} />
                  <span className="text-[10px] font-bold text-foreground">{item.number.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
            <span>{minNum.toLocaleString()}</span>
            <span>{maxNum.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Key Insight */}
      <div className="bg-accent/20 border-2 border-accent/40 rounded-xl p-4 text-center">
        <p className="text-base text-foreground">
          <strong className="text-accent">Key Insight:</strong> There is no "right" answer. Every response reflects <strong>different assumptions</strong>.
        </p>
        <p className="text-muted-foreground text-xs mt-1">Same question → different interpretations → wildly different numbers.</p>
      </div>

      {/* Reset Button */}
      {canControl && (
        <div className="flex justify-center">
          <Button onClick={resetGame} variant="outline" size="lg" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
};
