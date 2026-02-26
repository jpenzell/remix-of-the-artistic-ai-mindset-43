import { HelpCircle } from "lucide-react";

export const ChargersBiasWhyScreen = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-12 overflow-hidden">
      <div className="max-w-6xl w-full">
        <div className="text-center space-y-8 animate-fade-in">
          <p className="text-xl text-muted-foreground uppercase tracking-widest font-medium">
            The real question:
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <HelpCircle className="h-14 w-14 text-accent" />
            <h2 className="text-5xl md:text-6xl font-bold text-accent">Why?</h2>
          </div>
          
          <p className="text-2xl md:text-3xl text-muted-foreground max-w-4xl mx-auto">
            Nobody knows. Not even the people who built it.
          </p>
          
          <div className="bg-accent/10 border-4 border-accent rounded-2xl p-8 max-w-4xl mx-auto space-y-6">
            <p className="text-2xl md:text-3xl font-semibold text-foreground">
              AI learned from <span className="text-primary">humans</span>.
            </p>
            <p className="text-2xl md:text-3xl font-semibold text-foreground">
              It acts like a <span className="text-primary">human</span>.
            </p>
            <p className="text-2xl md:text-3xl font-semibold text-foreground">
              It makes mistakes like a <span className="text-primary">human</span>.
            </p>
          </div>
          
          <p className="text-2xl text-foreground max-w-3xl mx-auto">
            So maybe... <span className="text-accent font-bold">work with it like one</span>.
          </p>
        </div>
      </div>
    </div>
  );
};
