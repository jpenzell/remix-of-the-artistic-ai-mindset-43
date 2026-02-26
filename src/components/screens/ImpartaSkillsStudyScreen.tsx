import { useState, useEffect, useCallback } from "react";
import { Brain, HelpCircle, RefreshCw } from "lucide-react";

export const ImpartaSkillsStudyScreen = () => {
  const [stage, setStage] = useState(1);
  const maxStage = 2;

  const handleAdvance = useCallback((e: KeyboardEvent) => {
    if (e.key === " " || e.key === "ArrowRight") {
      if (stage < maxStage) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setStage((s) => s + 1);
      }
    } else if (e.key === "ArrowLeft") {
      if (stage > 1) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setStage((s) => s - 1);
      }
    }
  }, [stage, maxStage]);

  useEffect(() => {
    window.addEventListener("keydown", handleAdvance, { capture: true });
    return () => window.removeEventListener("keydown", handleAdvance, { capture: true } as any);
  }, [handleAdvance]);

  return (
    <div className="flex-1 flex flex-col justify-center px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-base text-muted-foreground uppercase tracking-widest mb-1">
            Imparta & Carnegie Mellon • 2025
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            When AI <span className="text-accent">Thinks For You</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
            fMRI study of professionals writing with AI assistance—measured neural activity and recall
          </p>
        </div>

        {/* Two massive stats side by side - always visible */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          
          {/* Stat 1 - Neural Drop */}
          <div className="bg-destructive/10 border-3 border-destructive/40 rounded-2xl p-8 text-center">
            <Brain className="h-14 w-14 text-destructive mx-auto mb-3" />
            <div className="text-7xl md:text-8xl font-black text-destructive mb-2">
              47%
            </div>
            <p className="text-xl text-foreground font-semibold">Drop in Brain Activity</p>
            <p className="text-base text-muted-foreground mt-1">When AI drafted content</p>
          </div>

          {/* Stat 2 - Memory Loss */}
          <div className="bg-accent/10 border-3 border-accent/40 rounded-2xl p-8 text-center">
            <HelpCircle className="h-14 w-14 text-accent mx-auto mb-3" />
            <div className="text-7xl md:text-8xl font-black text-accent mb-2">
              80%
            </div>
            <p className="text-xl text-foreground font-semibold">Couldn't Recall</p>
            <p className="text-base text-muted-foreground mt-1">What they "wrote" with AI</p>
          </div>
        </div>

        {/* The Cycle - Stage 2 */}
        {stage >= 2 && (
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-5 bg-gradient-to-r from-primary/20 to-destructive/20 border-2 border-primary/40 rounded-2xl px-8 py-5">
              <RefreshCw className="h-10 w-10 text-primary flex-shrink-0" />
              <div className="text-left">
                <p className="text-2xl md:text-3xl font-bold text-foreground">
                  The AI Dependence Cycle
                </p>
                <p className="text-lg text-muted-foreground mt-1">
                  High AI confidence → Suppressed thinking → Skill decay → More AI
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress - subtle */}
        <div className="flex justify-center gap-1.5 mt-6 opacity-30">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                s <= stage ? "bg-muted-foreground" : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
