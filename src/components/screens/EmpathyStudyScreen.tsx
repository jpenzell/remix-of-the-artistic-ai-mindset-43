import { Heart } from "lucide-react";

export const EmpathyStudyScreen = () => {
  return (
    <div className="flex-1 flex flex-col justify-center space-y-8 animate-slide-in">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
          AI-Assisted Communication Is More Empathetic
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-3xl mx-auto">
          Nature study, 2024
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl p-10 shadow-xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Third-Party Evaluators Study
              </h2>
              <p className="text-muted-foreground text-lg italic">Published in Nature Communications Medicine</p>
            </div>
          </div>

          <div className="space-y-8">
            <p className="text-foreground text-xl leading-relaxed">
              Researchers compared empathetic professional responses from expert humans versus 
              AI-generated responses. Third-party evaluators rated each response on compassion and quality.
            </p>

            <div className="bg-primary/20 border-4 border-primary rounded-2xl p-8">
              <p className="text-5xl font-bold text-primary text-center mb-4">4:1</p>
              <p className="text-foreground text-2xl text-center leading-relaxed">
                Evaluators <strong>preferred AI-generated responses over human responses</strong> 
                by a ratio of 4 to 1
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-background/60 border-2 border-primary/30 p-6 rounded-xl">
                <p className="font-bold text-primary mb-3 text-lg">Why AI Responses Scored Higher</p>
                <ul className="text-foreground space-y-2">
                  <li>• More comprehensive and detailed</li>
                  <li>• Consistently empathetic tone</li>
                  <li>• Took time to address concerns</li>
                  <li>• No fatigue or burnout affecting quality</li>
                </ul>
              </div>

              <div className="bg-background/60 border-2 border-accent/30 p-6 rounded-xl">
                <p className="font-bold text-accent mb-3 text-lg">What This Means for Educators</p>
                <ul className="text-foreground space-y-2">
                  <li>• Draft empathetic communications to parents</li>
                  <li>• Use AI to review tone and compassion in feedback</li>
                  <li>• Consistent quality even under time pressure</li>
                  <li>• You still review and personalize</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-accent/10 border-l-4 border-accent rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-accent mb-4">
            💡 The Director's Insight
          </h3>
          <p className="text-foreground text-xl leading-relaxed">
            This wasn't "AI replacing humans." It was <strong>AI helping humans communicate better</strong>. 
            The humans still reviewed and approved the responses—<em className="text-secondary">directing the scene</em>, 
            not letting the AI perform solo.
          </p>
        </div>
      </div>
    </div>
  );
};
