import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type PresentationMode = "wine" | "educator";

interface PresentationModeContextType {
  mode: PresentationMode;
  setMode: (mode: PresentationMode) => void;
  // Mode-specific content helpers
  industryName: string;
  industryExamples: {
    scenario1: string;
    scenario2: string;
    scenario3: string;
    scenario4: string;
    scenario5: string;
  };
  caseStudyTitle: string;
  presentationTitle: string;
  closingCallback: string;
}

const PresentationModeContext = createContext<PresentationModeContextType | undefined>(undefined);

// Mode-specific content configurations
const modeConfigs: Record<PresentationMode, Omit<PresentationModeContextType, "mode" | "setMode">> = {
  wine: {
    industryName: "Wine Sales",
    presentationTitle: "The Artistic AI Mindset",
    caseStudyTitle: "Wine Industry Case Studies",
    closingCallback: "Your next AI conversation is a rehearsal—what will you explore?",
    industryExamples: {
      scenario1: "You have a line review at Kroger next week. You've prepared your standard deck and talking points.",
      scenario2: "You have 18 months of promo data across accounts. Leadership wants to know which promotions \"worked.\"",
      scenario3: "Our rosé sales are flat with buyers under 35, and you need to understand why before the category review.",
      scenario4: "A buyer wants to move your summer promo from July 4th to Memorial Day. They need an answer this week.",
      scenario5: "19 Crimes is eating your lunch in the $10-15 segment. Leadership wants a competitive response strategy.",
    },
  },
  educator: {
    industryName: "K-12 Education",
    presentationTitle: "The Agile AI Mindset",
    caseStudyTitle: "Education Case Studies",
    closingCallback: "Your next AI conversation is a rehearsal—what will you explore with your students?",
    industryExamples: {
      scenario1: "You have parent-teacher conferences next week. You've prepared your standard talking points about each student.",
      scenario2: "You have 18 months of student assessment data. Administration wants to know which interventions \"worked.\"",
      scenario3: "Student engagement is flat in your 10th grade English class, and you need to understand why before curriculum review.",
      scenario4: "Your department wants to shift the research project from spring to winter break. You need to adapt the scaffolding this week.",
      scenario5: "Students are using AI to write essays. Your colleagues want a policy response—but you're wondering if there's a better approach.",
    },
  },
};

export const PresentationModeProvider = ({ children }: { children: ReactNode }) => {
  // Check URL params and localStorage for initial mode
  const getInitialMode = (): PresentationMode => {
    const params = new URLSearchParams(window.location.search);
    const urlMode = params.get("presentation");
    if (urlMode === "wine" || urlMode === "educator") return urlMode;
    
    const stored = localStorage.getItem("presentationMode");
    if (stored === "wine" || stored === "educator") return stored as PresentationMode;
    
    return "wine"; // Default to wine
  };

  const [mode, setModeState] = useState<PresentationMode>(getInitialMode);

  const setMode = (newMode: PresentationMode) => {
    setModeState(newMode);
    localStorage.setItem("presentationMode", newMode);
    
    // Update URL without reload
    const url = new URL(window.location.href);
    url.searchParams.set("presentation", newMode);
    window.history.replaceState({}, "", url.toString());
  };

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.remove("theme-wine", "theme-educator");
    document.documentElement.classList.add(`theme-${mode}`);
  }, [mode]);

  const config = modeConfigs[mode];

  return (
    <PresentationModeContext.Provider value={{ mode, setMode, ...config }}>
      {children}
    </PresentationModeContext.Provider>
  );
};

export const usePresentationMode = () => {
  const context = useContext(PresentationModeContext);
  if (!context) {
    throw new Error("usePresentationMode must be used within PresentationModeProvider");
  }
  return context;
};
