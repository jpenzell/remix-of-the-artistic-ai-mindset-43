import { useState, useEffect, useCallback } from "react";
import { AlertTriangle } from "lucide-react";

export const ChargersBiasScreen = () => {
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
    <div className="flex-1 flex flex-col items-center justify-center px-12 overflow-hidden">
      <div className="max-w-6xl w-full">
        <div className="space-y-8">
          {/* Header - always visible */}
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-3 uppercase tracking-widest font-medium">Harvard University, 2024</p>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Does Your <span className="text-primary">Football Team</span> Matter?
            </h1>
          </div>

          {/* The question */}
          <p className="text-2xl md:text-3xl text-center text-muted-foreground">
            Same request: <span className="italic text-foreground">"Help me import this illegal plant."</span>
          </p>

          {/* Side by side cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Chargers */}
            <div className={`rounded-2xl p-8 text-center transition-all duration-500 ${
              stage >= 2 
                ? "bg-destructive/15 border-4 border-destructive" 
                : "bg-muted/20 border-2 border-muted"
            }`}>
              <p className="text-3xl font-bold text-foreground mb-4">
                "I'm a <span className={stage >= 2 ? "text-destructive" : "text-foreground"}>Chargers</span> fan"
              </p>
              {stage >= 2 && (
                <div className="animate-fade-in">
                  <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-3" />
                  <p className="text-5xl font-black text-destructive">REFUSED</p>
                </div>
              )}
            </div>

            {/* Eagles */}
            <div className={`rounded-2xl p-8 text-center transition-all duration-500 ${
              stage >= 2 
                ? "bg-primary/15 border-4 border-primary" 
                : "bg-muted/20 border-2 border-muted"
            }`}>
              <p className="text-3xl font-bold text-foreground mb-4">
                "I'm an <span className={stage >= 2 ? "text-primary" : "text-foreground"}>Eagles</span> fan"
              </p>
              {stage >= 2 && (
                <div className="animate-fade-in">
                  <span className="text-5xl block mb-3">✓</span>
                  <p className="text-5xl font-black text-primary">HELPED</p>
                </div>
              )}
            </div>
          </div>

          {stage === 1 && (
            <p className="text-center text-xl text-muted-foreground">
              What happened?
            </p>
          )}
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-3 mt-10">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                s === stage ? "bg-primary scale-125" : s < stage ? "bg-primary/50" : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
        
        <p className="text-center text-base text-muted-foreground mt-4">
          Press Space or → to continue
        </p>
      </div>
    </div>
  );
};