import { useState, useEffect, useCallback } from "react";
import { TrendingDown, Clock, AlertTriangle, Zap, BarChart3 } from "lucide-react";

const parallels = [
  {
    id: "electricity",
    era: "1890s–1920s",
    title: "Electricity",
    icon: Zap,
    fact: "Factories took 30 years to see gains—had to redesign workflows, not just swap power sources.",
    consequence: "Factories that didn't adopt didn't stay flat. They went bankrupt.",
    source: "Paul David, 1990",
    color: "accent",
  },
  {
    id: "gong",
    era: "2024",
    title: "Sales Teams (Gong Labs)",
    icon: BarChart3,
    fact: "Teams using AI to optimize actions saw +50% win rates. Teams using AI to guide strategy saw +35%.",
    consequence: "Teams not using AI at all? Their competitors pulled ahead by 26–50%.",
    source: "Gong Labs, 1M+ opportunities",
    color: "primary",
  },
  {
    id: "ai",
    era: "2025",
    title: "The J-Curve Pattern",
    icon: Clock,
    fact: "The J-curve shows a productivity dip before growth—but the dip is where learning happens.",
    consequence: "Companies that skip the dip skip the learning. Competitors who endured it surpass them.",
    source: "Brynjolfsson et al., 2025",
    color: "primary",
  },
  {
    id: "gap",
    era: "By 2030",
    title: "The Growing Divide",
    icon: TrendingDown,
    fact: "Non-adopters face a 20–30% productivity gap vs. companies that invested through the dip.",
    consequence: "The cost of inaction isn't zero—it's falling behind.",
    source: "McKinsey Global Institute, 2024",
    color: "destructive",
  },
];

export const CostOfInactionScreen = () => {
  const [revealed, setRevealed] = useState(0);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === " " || e.key === "ArrowRight") {
      if (revealed < parallels.length) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setRevealed(prev => prev + 1);
      }
    } else if (e.key === "ArrowLeft") {
      if (revealed > 0) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setRevealed(prev => prev - 1);
      }
    }
  }, [revealed]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey, { capture: true });
    return () => window.removeEventListener("keydown", handleKey, { capture: true } as any);
  }, [handleKey]);

  return (
    <div className="flex-1 flex flex-col justify-center px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-destructive/10 border border-destructive/30 rounded-full mb-3">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-destructive font-semibold text-sm uppercase tracking-widest">
              The Other Side of the J-Curve
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            The Cost of <span className="text-destructive">Doing Nothing</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            The dip is uncomfortable. But the alternative is worse.
          </p>
        </div>

        {/* Parallels */}
        <div className="grid md:grid-cols-4 gap-5">
          {parallels.map((p, i) => {
            const isVisible = i < revealed;
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className={`transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
                }`}
              >
                <div className={`bg-card border-2 border-${p.color}/30 rounded-2xl p-6 h-full flex flex-col`}>
                  {/* Era badge */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-${p.color}/20 flex items-center justify-center shrink-0`}>
                      <Icon className={`h-5 w-5 text-${p.color}`} />
                    </div>
                    <div>
                      <p className={`font-bold text-${p.color} tracking-wider`} style={{ fontSize: '0.75rem' }}>{p.era}</p>
                      <p className="text-xl font-bold text-foreground">{p.title}</p>
                    </div>
                  </div>

                  {/* Fact */}
                  <p className="text-base text-foreground leading-relaxed mb-4 flex-1">
                    {p.fact}
                  </p>

                  {/* Consequence */}
                  <div className={`bg-${p.color}/10 border border-${p.color}/30 rounded-xl p-4`}>
                    <p className={`text-base font-bold text-${p.color}`}>
                      {p.consequence}
                    </p>
                  </div>

                  {/* Source */}
                  <p className="text-xs text-muted-foreground mt-3">{p.source}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Takeaway after all revealed */}
        {revealed >= parallels.length && (
          <div className="mt-8 text-center animate-fade-in">
            <div className="inline-block bg-gradient-to-r from-primary/10 to-destructive/10 border-2 border-primary/30 rounded-2xl px-10 py-5">
              <p className="text-2xl md:text-3xl font-bold text-foreground">
                The J-curve dip is the <span className="text-primary">tuition</span>.
              </p>
              <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">
                Skipping it means <span className="text-destructive">paying more later</span>.
              </p>
            </div>
          </div>
        )}

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mt-6 opacity-30">
          {parallels.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i < revealed ? "bg-muted-foreground" : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
