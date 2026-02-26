import { TrendingUp } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const AnnieDukeStudyScreen = () => {
  const [stage, setStage] = useState(1);
  const maxStage = 3;

  const handleAdvance = useCallback((e: KeyboardEvent) => {
    if (e.key === " " || e.key === "ArrowRight") {
      if (stage < maxStage) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setStage((s) => s + 1);
      }
      // Don't prevent default at maxStage - let parent handle navigation
    } else if (e.key === "ArrowLeft") {
      if (stage > 1) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setStage((s) => s - 1);
      }
      // Don't prevent default at stage 1 - let parent handle navigation
    }
  }, [stage, maxStage]);

  useEffect(() => {
    // Capture phase so we can intercept before PresentationLayout's global handler.
    window.addEventListener("keydown", handleAdvance, { capture: true });
    return () => window.removeEventListener("keydown", handleAdvance, { capture: true } as any);
  }, [handleAdvance]);

  const tableData = [
    { word: "Slam dunk", humanAvg: "90%", humanRange: "50-100", chatgpt: "85%", gemini: "85%" },
    { word: "Always", humanAvg: "91%", humanRange: "50-100", chatgpt: "100%", gemini: "100%" },
    { word: "Never", humanAvg: "9%", humanRange: "0-50", chatgpt: "0%", gemini: "0%" },
    { word: "Serious possibility", humanAvg: "58%", humanRange: "30-80", chatgpt: "70%", gemini: "50%", highlight: true },
    { word: "Rarely", humanAvg: "16%", humanRange: "5-50", chatgpt: "15%", gemini: "5%", highlight: true },
  ];

  return (
    <div className="flex-1 flex flex-col animate-slide-in">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Same Words, Different Meanings
          </h1>
        </div>
        <p className="text-lg text-muted-foreground font-light">
          {stage === 1 && "How do humans interpret probability words?"}
          {stage === 2 && "How do AI models compare to human averages?"}
          {stage === 3 && "Do AI models even agree with each other?"}
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left callout area */}
            <div className="hidden lg:flex items-center justify-center">
              {stage === 1 && (
                <div className="bg-destructive/15 border-2 border-destructive rounded-2xl p-6 animate-fade-in shadow-lg">
                  <p className="text-xl text-foreground font-medium">
                    <strong className="text-destructive text-2xl block mb-2">Humans vary wildly.</strong>
                    "Serious possibility" ranges from 30% to 80% — a <span className="text-destructive font-bold">50-point spread</span> on the same words.
                  </p>
                </div>
              )}
              {stage === 2 && (
                <div className="bg-accent/15 border-2 border-accent rounded-2xl p-6 animate-fade-in shadow-lg">
                  <p className="text-xl text-foreground font-medium">
                    <strong className="text-accent text-2xl block mb-2">AI is more precise.</strong>
                    Humans average 91% for "always," but AI says <span className="text-accent font-bold">100%</span>.
                  </p>
                </div>
              )}
              {stage === 3 && (
                <div className="bg-primary/15 border-2 border-primary rounded-2xl p-6 animate-fade-in shadow-lg">
                  <p className="text-xl text-foreground font-medium">
                    <strong className="text-primary text-2xl block mb-2">Even AI models disagree.</strong>
                    "Serious possibility": ChatGPT says <span className="text-accent font-bold">70%</span>, Gemini says <span className="text-secondary font-bold">50%</span>.
                  </p>
                </div>
              )}
            </div>

            {/* Center table */}
            <div className="lg:col-span-2">
              <div className="bg-background/80 border-2 border-foreground/20 rounded-2xl overflow-hidden shadow-lg">
                <Table>
                  <TableHeader className="bg-primary/20">
                    <TableRow>
                      <TableHead className="text-foreground font-bold text-lg py-4">Word</TableHead>
                      <TableHead className="text-center text-foreground font-bold text-lg">Human Avg</TableHead>
                      <TableHead className="text-center text-destructive font-bold text-lg">
                        Human Range
                        {stage === 1 && <span className="block text-xs font-normal text-destructive/70">50-point spreads!</span>}
                      </TableHead>
                      <TableHead 
                        className={`text-center font-bold text-lg transition-all duration-500 ${
                          stage >= 2 ? "text-accent opacity-100" : "text-muted-foreground/30 opacity-50"
                        }`}
                      >
                        ChatGPT
                      </TableHead>
                      <TableHead 
                        className={`text-center font-bold text-lg transition-all duration-500 ${
                          stage >= 2 ? "text-secondary opacity-100" : "text-muted-foreground/30 opacity-50"
                        }`}
                      >
                        Gemini
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((row, idx) => (
                      <TableRow 
                        key={idx} 
                        className={`transition-all duration-500 ${
                          stage === 3 && row.highlight 
                            ? "bg-primary/20 border-2 border-primary/50" 
                            : ""
                        }`}
                      >
                        <TableCell className="font-semibold text-foreground text-lg py-4">{row.word}</TableCell>
                        <TableCell className="text-center text-foreground text-lg">{row.humanAvg}</TableCell>
                        <TableCell className="text-center text-destructive font-bold text-lg">{row.humanRange}</TableCell>
                        <TableCell 
                          className={`text-center text-lg transition-all duration-500 ${
                            stage >= 2 
                              ? stage === 3 && row.highlight 
                                ? "text-accent font-bold text-xl" 
                                : "text-accent" 
                              : "text-muted-foreground/30"
                          }`}
                        >
                          {row.chatgpt}
                        </TableCell>
                        <TableCell 
                          className={`text-center text-lg transition-all duration-500 ${
                            stage >= 2 
                              ? stage === 3 && row.highlight 
                                ? "text-secondary font-bold text-xl" 
                                : "text-secondary" 
                              : "text-muted-foreground/30"
                          }`}
                        >
                          {row.gemini}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile callouts - shown below table on smaller screens */}
              <div className="lg:hidden mt-6">
                {stage === 1 && (
                  <div className="bg-destructive/15 border-2 border-destructive rounded-2xl p-4 animate-fade-in">
                    <p className="text-lg text-foreground">
                      <strong className="text-destructive">Humans vary wildly.</strong> "Serious possibility" ranges from 30% to 80% — a 50-point spread.
                    </p>
                  </div>
                )}
                {stage === 2 && (
                  <div className="bg-accent/15 border-2 border-accent rounded-2xl p-4 animate-fade-in">
                    <p className="text-lg text-foreground">
                      <strong className="text-accent">AI is more precise</strong> — but different from humans. "Always" = 100% for AI, 91% for humans.
                    </p>
                  </div>
                )}
                {stage === 3 && (
                  <div className="bg-primary/15 border-2 border-primary rounded-2xl p-4 animate-fade-in">
                    <p className="text-lg text-foreground">
                      <strong className="text-primary">Even AI models disagree.</strong> "Serious possibility": 70% vs 50%.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  s === stage ? "bg-primary scale-125" : s < stage ? "bg-primary/50" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-2">
            Press Space or → to advance
          </p>
        </div>
      </div>
    </div>
  );
};
