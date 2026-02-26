import { Brain, Youtube, Bookmark, ExternalLink, Copy, Check } from "lucide-react";
import { useSession } from "@/contexts/SessionContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const VIDEO_URL = "https://www.youtube.com/watch?v=Bj9BD2D3DzA";
const VIDEO_TITLE = "Understanding Probabilistic AI - Anthropic";

export const ProbabilisticExplainerScreen = () => {
  const { isPresenter } = useSession();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(VIDEO_URL);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const openVideo = () => {
    window.open(VIDEO_URL, "_blank");
  };

  return (
    <div className="flex-1 flex flex-col justify-center space-y-8 animate-slide-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-6 py-3 glass-effect rounded-full mb-4">
          <Brain className="h-5 w-5 text-primary" />
          <span className="text-primary font-semibold text-lg">Core Concept</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
          LLMs Predict, They Don't Know
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto font-light">
          Understanding probabilistic models vs. knowledge databases
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 border-l-4 border-l-primary p-8 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Language Models = Pattern Prediction Engines
          </h3>
          <p className="text-foreground text-lg mb-4 leading-relaxed">
            Large Language Models predict likely tokens (words/characters) based on statistical patterns,
            not certain truth. They're extraordinarily fluent pattern-matchers, not fact databases.
          </p>
          <p className="text-primary font-semibold text-lg">
            → Treat all outputs as drafts to coach, not finished truth.
          </p>
        </div>

        {isPresenter ? (
          // Presenter sees the embedded video
          <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/20">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/Bj9BD2D3DzA"
              title="Understanding Probabilistic AI"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        ) : (
          // Participants see a save/watch later card
          <div className="bg-gradient-to-br from-card to-card/80 border-2 border-primary/30 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/30">
                <Youtube className="h-8 w-8 text-red-500" />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-foreground mb-1">
                  {VIDEO_TITLE}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Save to watch later
                </p>
                <div className="bg-muted/50 rounded-lg px-3 py-2 font-mono text-xs text-foreground break-all">
                  {VIDEO_URL}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={copyLink} variant="outline" size="sm" className="gap-1">
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button onClick={openVideo} size="sm" className="gap-1">
                  <ExternalLink className="h-4 w-4" />
                  Open
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card border-2 border-border p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-foreground mb-4">
              ✓ What AI is Great At:
            </h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Pattern recognition across large datasets</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Generating fluent, natural-sounding text</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Drafting, summarizing, and rewriting</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Brainstorming and creative exploration</span>
              </li>
            </ul>
          </div>

          <div className="bg-destructive/10 border-2 border-destructive/30 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-destructive mb-4">
              ⚠️ What AI Struggles With:
            </h3>
            <ul className="space-y-3 text-foreground">
              <li className="flex gap-2">
                <span className="text-destructive">•</span>
                <span>Verifying facts it hasn't been trained on</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">•</span>
                <span>Understanding context it can't access</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">•</span>
                <span>Making final decisions on critical matters</span>
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">•</span>
                <span>Knowing when it doesn't know something</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-accent/10 border-2 border-accent/20 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-accent mb-4 flex items-center gap-2">
            <span className="text-3xl">🔑</span>
            Key Takeaway
          </h3>
          <p className="text-foreground text-xl leading-relaxed">
            AI is a <strong>copilot</strong>, not an <strong>autopilot</strong>. 
            The fluency can be deceiving—always verify outputs before using them with students, 
            especially in high-stakes situations like assessments, feedback, or parent communications.
          </p>
        </div>
      </div>
    </div>
  );
};
