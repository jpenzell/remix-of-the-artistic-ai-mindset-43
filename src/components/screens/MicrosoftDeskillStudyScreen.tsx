import { useState, useEffect, useCallback } from "react";
import { TrendingDown, RefreshCw } from "lucide-react";

export const MicrosoftDeskillStudyScreen = () => {
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
            Microsoft Research • 2025
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            "Cognitive <span className="text-destructive">Deskilling</span>"
          </h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
            Longitudinal study of clinicians using AI diagnostic tools over 3 months
          </p>
        </div>

        {/* Two findings side by side - always visible */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          
          {/* Finding 1 - The Decline */}
          <div className="bg-destructive/10 border-3 border-destructive/40 rounded-2xl p-8 text-center">
            <TrendingDown className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-3">Skills Declined</h2>
            <p className="text-lg text-muted-foreground">
              After 3 months with AI, clinicians showed <span className="text-destructive font-bold">measurable decline</span> in independent diagnostic accuracy
            </p>
          </div>

          {/* Finding 2 - It Persists */}
          <div className="bg-accent/10 border-3 border-accent/40 rounded-2xl p-8 text-center">
            <RefreshCw className="h-16 w-16 text-accent mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-3">Effects Persist</h2>
            <p className="text-lg text-muted-foreground">
              Degradation <span className="text-accent font-bold">continued even after AI stopped</span>—the cognitive muscle had atrophied
            </p>
          </div>
        </div>

        {/* The Big Insight - Stage 2 */}
        {stage >= 2 && (
          <div className="text-center animate-fade-in">
            <div className="inline-block bg-gradient-to-r from-primary/20 to-destructive/20 border-2 border-primary/40 rounded-2xl px-10 py-6">
              <p className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                🧠 Use it or lose it.
              </p>
              <p className="text-xl text-muted-foreground">
                AI as crutch → Skills atrophy → More AI dependence
              </p>
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
