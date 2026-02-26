import { useState, useEffect, useMemo } from "react";
import { PresentationLayout } from "@/components/PresentationLayout";
import { JoinSessionScreen } from "@/components/JoinSessionScreen";
import { useSession } from "@/contexts/SessionContext";
import { usePresentationMode } from "@/contexts/PresentationModeContext";
import { WindshieldQuestionScreen } from "@/components/screens/WindshieldQuestionScreen";
import { TitleScreen } from "@/components/screens/TitleScreen";
import { OneWordStoryScreen } from "@/components/screens/OneWordStoryScreen";
import { AIStoryDemoScreen } from "@/components/screens/AIStoryDemoScreen";
import { StoryRevealScreen } from "@/components/screens/StoryRevealScreen";
import { ElephantManualScreen } from "@/components/screens/ElephantManualScreen";
import { ElephantQuestionScreen } from "@/components/screens/ElephantQuestionScreen";
import { HallucinationExplainerScreen } from "@/components/screens/HallucinationExplainerScreen";
import { ProbabilisticDemoScreen } from "@/components/screens/ProbabilisticDemoScreen";
import { ProbabilisticExplainerScreen } from "@/components/screens/ProbabilisticExplainerScreen";
import { EfficiencyParadoxScreen } from "@/components/screens/EfficiencyParadoxScreen";
import { DiagnosisQuizScreen } from "@/components/screens/DiagnosisQuizScreen";
import { DeveloperQuizScreen } from "@/components/screens/DeveloperQuizScreen";
import { DoctorAIQuizScreen } from "@/components/screens/DoctorAIQuizScreen";
import { ManufacturingQuizScreen } from "@/components/screens/ManufacturingQuizScreen";
import { ChargersBiasScreen } from "@/components/screens/ChargersBiasScreen";
import { ChargersBiasWhyScreen } from "@/components/screens/ChargersBiasWhyScreen";
import { AIParadoxRevealScreen } from "@/components/screens/AIParadoxRevealScreen";
import { AIBiasScreen } from "@/components/screens/AIBiasScreen";
import { AIPerformanceQuizScreen } from "@/components/screens/AIPerformanceQuizScreen";
import { AIReasoningQuizScreen } from "@/components/screens/AIReasoningQuizScreen";
import { AIParadigmShiftScreen } from "@/components/screens/AIParadigmShiftScreen";
import { AIParadigmSummaryScreen } from "@/components/screens/AIParadigmSummaryScreen";
import { BenefitsIntroScreen } from "@/components/screens/BenefitsIntroScreen";
import { EmpathyStudyScreen } from "@/components/screens/EmpathyStudyScreen";
import { CreativityStudyScreen } from "@/components/screens/CreativityStudyScreen";
import { BenefitsSummaryScreen } from "@/components/screens/BenefitsSummaryScreen";
import { LanguageInteractiveScreen } from "@/components/screens/LanguageInteractiveScreen";
import { AnnieDukeStudyScreen } from "@/components/screens/AnnieDukeStudyScreen";
import { LanguageTakeawayScreen } from "@/components/screens/LanguageTakeawayScreen";
import { DataPrivacyScreen } from "@/components/screens/DataPrivacyScreen";
import { PracticalGuardrailsScreen } from "@/components/screens/PracticalGuardrailsScreen";
import { AbundanceIntroScreen } from "@/components/screens/AbundanceIntroScreen";
import { CaseStudiesScreen } from "@/components/screens/CaseStudiesScreen";
import { CorePrinciplesScreen } from "@/components/screens/CorePrinciplesScreen";
import { AILeadersScreen } from "@/components/screens/AILeadersScreen";
import { NewLeadershipRealityScreen } from "@/components/screens/NewLeadershipRealityScreen";
import { CommitmentsScreen } from "@/components/screens/CommitmentsScreen";
import { ResourcesScreen } from "@/components/screens/ResourcesScreen";
import { MindsetProbabilisticScreen } from "@/components/screens/MindsetProbabilisticScreen";
import { MindsetCuriosityScreen } from "@/components/screens/MindsetCuriosityScreen";
import { MindsetMetacognitiveScreen } from "@/components/screens/MindsetMetacognitiveScreen";
import { MindsetFluidIdentitiesScreen } from "@/components/screens/MindsetFluidIdentitiesScreen";
import { MindsetAbundanceScreen } from "@/components/screens/MindsetAbundanceScreen";
import { MindsetDelegateScreen } from "@/components/screens/MindsetDelegateScreen";
import { DemoSynthesisScreen } from "@/components/screens/DemoSynthesisScreen";
import { RoadmapScreen } from "@/components/screens/RoadmapScreen";
import { SalesQuizScreen } from "@/components/screens/SalesQuizScreen";
import { GongLabsStudyScreen } from "@/components/screens/GongLabsStudyScreen";
import { GongLabsTimeSavingsScreen } from "@/components/screens/GongLabsTimeSavingsScreen";
import { GongLabsTransitionScreen } from "@/components/screens/GongLabsTransitionScreen";
import { CostOfInactionScreen } from "@/components/screens/CostOfInactionScreen";
import { KenwayWineStudyScreen } from "@/components/screens/KenwayWineStudyScreen";
import { MicrosoftDeskillStudyScreen } from "@/components/screens/MicrosoftDeskillStudyScreen";
import { ImpartaSkillsStudyScreen } from "@/components/screens/ImpartaSkillsStudyScreen";
import { LLMIntroScreen } from "@/components/screens/LLMIntroScreen";
import { LLMExplainerScreen } from "@/components/screens/LLMExplainerScreen";
import { AIAgeRevealScreen } from "@/components/screens/AIAgeRevealScreen";
import { WhichAreAIScreen } from "@/components/screens/WhichAreAIScreen";
import { WhatChangedScreen } from "@/components/screens/WhatChangedScreen";
import { ThesisScreen } from "@/components/screens/ThesisScreen";
import { StoryTransitionScreen } from "@/components/screens/StoryTransitionScreen";
import { JoinSessionInviteScreen } from "@/components/screens/JoinSessionInviteScreen";
import { ZooxBridgeScreen } from "@/components/screens/ZooxBridgeScreen";
import { AgendaScreen } from "@/components/screens/AgendaScreen";
import { LanguageBridgeScreen } from "@/components/screens/LanguageBridgeScreen";
import { AIThinkingBridgeScreen } from "@/components/screens/AIThinkingBridgeScreen";
// RandomNumberDemoScreen removed - now using direct AI model display in P13c
import { TrueRandomScreen, getTrueRandomNumbers } from "@/components/screens/TrueRandomScreen";
import { AudienceRandomNumberScreen, getHumanRandomNumbers } from "@/components/screens/AudienceRandomNumberScreen";
import { AIRandomNumbersScreen, prefetchAIRandomNumbers, getAIRandomNumbers } from "@/components/screens/AIRandomNumbersScreen";
import { RandomComparisonScreen } from "@/components/screens/RandomComparisonScreen";
import { AboutMeScreen, preloadFirstEffect } from "@/components/screens/AboutMeScreen";
import { ClosingScreen } from "@/components/screens/ClosingScreen";
import { ConvergenceScreen } from "@/components/screens/ConvergenceScreen";
import { PrismTabs } from "@/components/blocks/PrismTabs";
import { AIAssistant } from "@/components/AIAssistant";
import { ParticleBackground } from "@/components/ParticleBackground";

// Mode-aware screens for industry-specific content
import {
  ModeAwareDemoBuyerPrep,
  ModeAwareDemoPromoVelocity,
  ModeAwareDemoConsumerInsights,
  ModeAwareDemoScenarioPlanning,
  ModeAwareDemoCompetitiveStrategy,
  ModeAwareUseCases,
  ModeAwareCaseStudies,
  ModeAwareCaseStudies2,
} from "@/components/screens/ModeAwareScreens";

// Educator-specific screens (shown only in educator mode)
import { AITutoringQuizScreen } from "@/components/screens/educator/AITutoringQuizScreen";
import { HarvardAITutoringScreen } from "@/components/screens/educator/HarvardAITutoringScreen";
import { KhanmigoScaleScreen } from "@/components/screens/educator/KhanmigoScaleScreen";
import { ChatGPTMetaAnalysisScreen } from "@/components/screens/educator/ChatGPTMetaAnalysisScreen";

const screens = [
  {
    id: "P1",
    title: "Title & Intent",
    component: TitleScreen,
    duration: 3,
    notes: "Welcome participants. Set the tone: hands-on, practical, transformative.",
  },
  {
    id: "P1b",
    title: "About Me",
    component: AboutMeScreen,
    duration: 2,
    notes: "Introduce Josh Penzell, MBA + MFA background. Establish Artistic Intelligence framework and Editor → Director metaphor.",
  },
  {
    id: "P2",
    title: "Opening Question",
    component: WindshieldQuestionScreen,
    duration: 3,
    notes: "Opening hook: Challenge assumptions with the Zoox vehicle example. Sets the tone for rethinking AI implementation.",
  },
  {
    id: "P2a",
    title: "Zoox → Presentation Parallel",
    component: ZooxBridgeScreen,
    duration: 2,
    notes: "Bridge: Zoox rebuilt the car, I'm rebuilding the presentation. If the goal is changing how you think, why use PowerPoint?",
  },
  {
    id: "P2b",
    title: "Join the Session",
    component: JoinSessionInviteScreen,
    duration: 3,
    notes: "Invite audience to join on their phones. Frame: I reimagined this presentation—vibe coded my own—and then kept going.",
  },
  {
    id: "P2c",
    title: "Today's Journey",
    component: AgendaScreen,
    duration: 2,
    notes: "Wine-themed agenda overview. Four sections: What is AI, demos, hands-on, mindset shifts.",
  },
  {
    id: "P3",
    title: "The Core Thesis",
    component: ThesisScreen,
    duration: 3,
    notes: "Establish the thesis: AI isn't about doing the same things faster—it's about rethinking what's possible. Editor vs Director framing.",
  },
  {
    id: "P5",
    title: "One-Word Story Game",
    component: OneWordStoryScreen,
    duration: 5,
    notes: "Interactive exercise: Audience builds a story one word at a time. Sets up the AI comparison.",
  },
  {
    id: "P7",
    title: "How LLMs Predict Words",
    component: LLMExplainerScreen,
    duration: 5,
    notes: "Visual explainer: Show how LLMs predict the next word with probabilities - this is exactly how ChatGPT works.",
  },
  {
    id: "P8",
    title: "How Old Is AI?",
    component: AIAgeRevealScreen,
    duration: 2,
    notes: "Surprise reveal: AI is nearly 70 years old (1956). Sets up 'so what's different now?'",
  },
  {
    id: "P9",
    title: "What Changed?",
    component: WhatChangedScreen,
    duration: 3,
    notes: "Progressive reveal: Rules → Learning → Language. Key insight: LLMs learned language from us.",
  },
  {
    id: "P12",
    title: "AI Elephant Question Demo",
    component: ElephantQuestionScreen,
    duration: 4,
    notes: "Ask AI the same impossible question and watch it confidently hallucinate a specific answer.",
  },
  {
    id: "P13",
    title: "Everything is Hallucination",
    component: HallucinationExplainerScreen,
    duration: 5,
    notes: "Right after elephant demo: Explain that ALL AI output is pattern prediction - some patterns just happen to be true.",
  },
  {
    id: "P13a",
    title: "Audience Random Number",
    component: AudienceRandomNumberScreen,
    duration: 3,
    notes: "Collect random numbers from audience before showing PRNGs or AI. Sets baseline for human randomness bias.",
  },
  {
    id: "P13b",
    title: "True Random vs Human Random",
    component: TrueRandomScreen,
    duration: 4,
    notes: "Show true cryptographic randomness. Compare to human numbers collected in P13a.",
  },
  {
    id: "P13c",
    title: "AI Models Pick Random Numbers",
    component: AIRandomNumbersScreen,
    duration: 4,
    notes: "4 AI models pick 'random' numbers side-by-side. Watch clustering patterns emerge in real-time.",
  },
  {
    id: "P14",
    title: "Random Numbers Compared",
    component: RandomComparisonScreen,
    duration: 3,
    notes: "Side-by-side comparison: True Random vs Human vs AI. Shows clustering patterns and statistical differences.",
  },
  {
    id: "P15",
    title: "How LLMs Work - Video",
    component: StoryRevealScreen,
    duration: 8,
    notes: "Anthropic video explaining probabilistic prediction. Deeper dive into how this works.",
  },
  {
    id: "P16",
    title: "Language is Subjective",
    component: LanguageBridgeScreen,
    duration: 2,
    notes: "Bridge: It's not just how AI thinks—it's trained on language, and language is subjective.",
  },
  {
    id: "P17",
    title: "Language Interactive Exercise",
    component: LanguageInteractiveScreen,
    duration: 5,
    notes: "Interactive: Collect audience interpretations of probability words in real-time. Shows variation visually.",
  },
  {
    id: "P18",
    title: "Annie Duke Study",
    component: AnnieDukeStudyScreen,
    duration: 4,
    notes: "Show research data: massive human variation (50-point spreads) and AI model differences (20-point spreads). Evidence-based.",
  },
  {
    id: "P19",
    title: "How AI 'Thinks'",
    component: AIThinkingBridgeScreen,
    duration: 3,
    notes: "Bridge: AI predicts based on training, we don't know exactly how, but it sounds human because it learned from us. Sets up why it's easy to over-trust.",
  },
  {
    id: "P20",
    title: "Two Surprising Studies",
    component: AIParadoxRevealScreen,
    duration: 4,
    notes: "Present the Doctor study (AI didn't help) and Empathy study (AI was 4x better). The reveal: it's not the AI, it's how you work with it. Oracle vs Partner mindset.",
  },
  {
    id: "P21",
    title: "The Hidden Bias Experiment",
    component: ChargersBiasScreen,
    duration: 3,
    notes: "Harvard 2024: Chargers vs Eagles fans got different responses for identical requests. Sets up the 'why?' question.",
  },
  {
    id: "P21b",
    title: "The Real Question: Why?",
    component: ChargersBiasWhyScreen,
    duration: 3,
    notes: "The punchline: we don't know WHY AI is biased. AI learned from humans, acts like humans, makes mistakes like humans—so work with it like one.",
  },
  {
    id: "P22",
    title: "The Empathy Test",
    component: AIPerformanceQuizScreen,
    duration: 4,
    notes: "Quiz: AI was 4× more empathetic than doctors. But AI struggles with novel problem-solving. Punchline: AI isn't better or worse—it's different.",
  },
  {
    id: "P23",
    title: "The Reasoning Test",
    component: AIReasoningQuizScreen,
    duration: 4,
    notes: "Quiz: GPT-4 failed simple logic puzzles 90%+ when wording was unfamiliar. AI pattern-matches, doesn't truly reason.",
  },
  {
    id: "P24c",
    title: "Kenway Wine Study",
    component: KenwayWineStudyScreen,
    duration: 4,
    notes: "AI content matched human revenue. But hybrid editing underperformed—we must be critical thinkers, judging what resonates with artistic mindset.",
    wineOnly: true,
  },
  {
    id: "P24",
    title: "So What Did We Learn?",
    component: AIParadigmSummaryScreen,
    duration: 2,
    notes: "Summary: AI thinks/biased like us, better at some things, worse at others.",
  },
  {
    id: "P24b-edu",
    title: "The AI Tutoring Experiment",
    component: AITutoringQuizScreen,
    duration: 4,
    notes: "Educator-only quiz: Harvard RCT showing 2x+ learning gains with AI tutoring vs active learning classroom.",
    educatorOnly: true,
  },
  {
    id: "P24b-edu2",
    title: "Harvard AI Tutoring RCT",
    component: HarvardAITutoringScreen,
    duration: 3,
    notes: "Nature study: AI tutoring outperformed active learning in authentic classroom RCT.",
    educatorOnly: true,
  },
  {
    id: "P24b-edu3",
    title: "Khanmigo at Scale",
    component: KhanmigoScaleScreen,
    duration: 3,
    notes: "Khan Academy's AI tutor: 40K → 700K students in one school year.",
    educatorOnly: true,
  },
  {
    id: "P24b-edu4",
    title: "ChatGPT Learning Meta-Analysis",
    component: ChatGPTMetaAnalysisScreen,
    duration: 3,
    notes: "Nature meta-analysis: Learning gains vs critical thinking risks depend on how students use AI.",
    educatorOnly: true,
  },
  {
    id: "P24a",
    title: "Gong Labs: Time Savings",
    component: GongLabsTimeSavingsScreen,
    duration: 3,
    notes: "Set up the twist: AI email writing saved the most time by far.",
    wineOnly: true,
  },
  {
    id: "P24a2",
    title: "Gong Labs: The Question",
    component: GongLabsTransitionScreen,
    duration: 1,
    notes: "Pause for effect—did time savings actually translate to more wins?",
    wineOnly: true,
  },
  {
    id: "P24b",
    title: "Gong Labs: AI in Sales",
    component: GongLabsStudyScreen,
    duration: 4,
    notes: "AI insights drove 35% higher win rates—helped reps think differently. But time savings from AI emails didn't translate to more wins.",
    wineOnly: true,
  },
  {
    id: "P24b2",
    title: "Why Efficiency Is Wrong",
    component: AIParadigmShiftScreen,
    duration: 4,
    notes: "Now that the Gong data proves it: efficiency is the wrong goal. GenAI creates value through MORE, not less. Transitions to 'how'.",
  },
  {
    id: "P24d",
    title: "Imparta: When AI Thinks For You",
    component: ImpartaSkillsStudyScreen,
    duration: 4,
    notes: "WHY you get worse: 47% drop in neural engagement. 80% couldn't recall what they wrote. Outsourcing thinking disengages you from the cycle.",
  },
  {
    id: "P24e",
    title: "Microsoft: Cognitive Decline Compounds",
    component: MicrosoftDeskillStudyScreen,
    duration: 4,
    notes: "Not only does it make you worse—the decline compounds. Skills atrophy persists even after AI use stops. The cognitive muscle atrophies.",
  },
  {
    id: "P25",
    title: "Sales AI Quiz",
    component: SalesQuizScreen,
    duration: 4,
    notes: "Interactive quiz about AI adoption in sales teams. Reinforces J-curve concept.",
  },
  {
    id: "P25b",
    title: "Cost of Inaction",
    component: CostOfInactionScreen,
    duration: 3,
    notes: "Historical parallels: electricity (1890s), AI J-curve (2020s), McKinsey 2030 gap. The dip is tuition—skipping it costs more.",
  },
  {
    id: "P26",
    title: "Industry Use Cases",
    component: ModeAwareUseCases,
    duration: 3,
    notes: "Overview: Five demo moments. Quick preview before live demos.",
  },
  {
    id: "P27",
    title: "Demo: Insights Discovery",
    component: ModeAwareDemoConsumerInsights,
    duration: 8,
    notes: "LIVE DEMO: Set up scenario, then switch to AI to show thinking conversation about engagement/sales.",
    hidden: true,
  },
  {
    id: "P28",
    title: "Demo: Data Analysis",
    component: ModeAwareDemoPromoVelocity,
    duration: 8,
    notes: "LIVE DEMO: Set up scenario, then switch to AI to show how to define success before analyzing data.",
    hidden: true,
  },
  {
    id: "P29",
    title: "Demo: Stakeholder Prep",
    component: ModeAwareDemoBuyerPrep,
    duration: 8,
    notes: "LIVE DEMO: Set up scenario, then switch to AI to uncover unknown unknowns before key meetings.",
    hidden: true,
  },
  {
    id: "P30",
    title: "Demo: Scenario Planning",
    component: ModeAwareDemoScenarioPlanning,
    duration: 8,
    notes: "LIVE DEMO: Set up scenario, then switch to AI to structure thinking about timing decisions.",
    hidden: true,
  },
  {
    id: "P31",
    title: "Demo: Strategy Deep-Dive",
    component: ModeAwareDemoCompetitiveStrategy,
    duration: 8,
    notes: "LIVE DEMO: Set up scenario, then switch to AI to get past surface-level answers.",
    hidden: true,
  },
  {
    id: "P31b",
    title: "What We Learned",
    component: DemoSynthesisScreen,
    duration: 2,
    notes: "Bridge slide synthesizing demo learnings. Every demo was a rehearsal. Sets up the six mindsets framework.",
    hidden: true,
  },
  {
    id: "P32",
    title: "Mindset A: Probabilistic Thinking",
    component: MindsetProbabilisticScreen,
    duration: 2,
    notes: "First mindset: AI predicts, it doesn't know. Connect to demo examples and artistic rehearsal concept.",
    hidden: true,
  },
  {
    id: "P33",
    title: "Mindset B: Conversational Curiosity",
    component: MindsetCuriosityScreen,
    duration: 2,
    notes: "Second mindset: Better questions lead to better answers. Connect to prep demo.",
    hidden: true,
  },
  {
    id: "P34",
    title: "Mindset C: Metacognitive Reflection",
    component: MindsetMetacognitiveScreen,
    duration: 2,
    notes: "Third mindset: Think about how you're thinking. Connect to data analysis structure.",
    hidden: true,
  },
  {
    id: "P35",
    title: "Mindset D: Fluid Identities",
    component: MindsetFluidIdentitiesScreen,
    duration: 2,
    notes: "Fourth mindset: Give AI a role. Connect to strategy demo.",
    hidden: true,
  },
  {
    id: "P36",
    title: "Mindset E: Abundance Curation",
    component: MindsetAbundanceScreen,
    duration: 2,
    notes: "Fifth mindset: Generate many, curate the best. Connect to scenario planning demo.",
    hidden: true,
  },
  {
    id: "P36b",
    title: "Mindset F: Develop & Delegate",
    component: MindsetDelegateScreen,
    duration: 2,
    notes: "Sixth mindset: Know when to direct closely vs. let AI run. Calibrate involvement to stakes.",
    hidden: true,
  },
  {
    id: "P37",
    title: "Industry Case Studies",
    component: ModeAwareCaseStudies,
    duration: 20,
    notes: "Real examples from the industry: research-backed evidence of AI impact.",
  },
  {
    id: "P37c",
    title: "More Education Research",
    component: ModeAwareCaseStudies2,
    duration: 10,
    notes: "Educator-only: Additional research on AI tutoring, Khan Academy efficacy, and the deskilling paradox.",
    educatorOnly: true,
  },
  {
    id: "P37d",
    title: "Convergence",
    component: ConvergenceScreen,
    duration: 3,
    notes: "Features are converging. Over-engineering is the real risk. This is the worst AI you'll ever use. Learn the thinking, not the tool.",
  },
  {
    id: "P38",
    title: "Closing",
    component: ClosingScreen,
    duration: 3,
    notes: "Callback to Zoox opening. Restate Editor → Director shift. Artistic Intelligence framework. Call to action: Your next AI conversation is a rehearsal.",
  },
];

const Index = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showJoinScreen, setShowJoinScreen] = useState(false);
  const [joinCode, setJoinCode] = useState<string | null>(null);
  
  const { session, isParticipant } = useSession();
  const { mode: presentationMode } = usePresentationMode();
  
  // Memoize filtered screens to prevent infinite re-renders
  const filteredScreens = useMemo(() => {
    return screens.filter(screen => {
      if ((screen as any).hidden) return false;
      if ((screen as any).educatorOnly && presentationMode !== "educator") {
        return false;
      }
      if ((screen as any).wineOnly && presentationMode !== "wine") {
        return false;
      }
      return true;
    });
  }, [presentationMode]);
  
  // Detect mode from URL params: ?mode=presenter|participant|present or ?join=XXXX
  const params = new URLSearchParams(window.location.search);
  const joinParam = params.get("join");
  const modeParam = params.get("mode");
  
  // If join code provided, show join screen
  useEffect(() => {
    if (joinParam && !session) {
      setJoinCode(joinParam.toUpperCase());
      setShowJoinScreen(true);
    }
  }, [joinParam, session]);
  
  // Determine mode: if joined as participant, force participant mode
  const mode = isParticipant ? "participant" : (modeParam || "presenter");

  // Initialize from URL hash on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const index = filteredScreens.findIndex((s) => s.id === hash);
      if (index !== -1) setCurrentIndex(index);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update URL hash when slide changes
  useEffect(() => {
    const screenId = filteredScreens[currentIndex]?.id;
    if (screenId) {
      window.location.hash = screenId;
    }
  }, [currentIndex, filteredScreens]);

  // Sync to presenter's current slide when participant
  useEffect(() => {
    if (isParticipant && session?.current_slide) {
      const index = filteredScreens.findIndex((s) => s.id === session.current_slide);
      if (index !== -1 && index !== currentIndex) {
        setCurrentIndex(index);
      }
    }
  }, [isParticipant, session?.current_slide, currentIndex, filteredScreens]);

  // Prefetch data when approaching certain slides
  useEffect(() => {
    const currentId = filteredScreens[currentIndex]?.id;
    // Prefetch AI random numbers when on P13b (one slide before P13c)
    if (currentId === "P13b") {
      prefetchAIRandomNumbers();
    }
  }, [currentIndex, filteredScreens]);

  // Preload headshot transform on app load (so it's ready by P1b)
  useEffect(() => {
    preloadFirstEffect();
  }, []);

  const CurrentComponent = filteredScreens[currentIndex]?.component;
  const currentScreenId = filteredScreens[currentIndex]?.id || "";
  
  // Auto-advance handler for transition slides
  const handleAutoAdvance = () => {
    if (currentIndex < filteredScreens.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Determine if current screen needs auto-advance prop
  
  // Show join screen for participants who haven't joined yet
  if (showJoinScreen && !session) {
    return (
      <JoinSessionScreen 
        initialCode={joinCode || undefined}
        onJoined={() => setShowJoinScreen(false)}
      />
    );
  }
  
  return (
    <>
      <ParticleBackground />
      <PresentationLayout
        currentScreen={currentScreenId}
        totalScreens={filteredScreens.length}
        currentIndex={currentIndex}
        onNavigate={setCurrentIndex}
        title="The Agile AI Mindset"
        duration={240}
        notes={filteredScreens[currentIndex]?.notes}
        mode={mode as "presenter" | "participant" | "present"}
      >
        {currentScreenId === "P1b" ? (
          <AboutMeScreen isActive={true} />
        ) : (
          CurrentComponent ? <CurrentComponent /> : null
        )}
      </PresentationLayout>
    </>
  );
};

export default Index;
