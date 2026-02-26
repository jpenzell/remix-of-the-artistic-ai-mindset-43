import { useState } from "react";
import { Copy, Check, Users, GraduationCap, Wine } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import vineyardHero from "@/assets/vineyard-hero.jpg";
import { useSession } from "@/contexts/SessionContext";
import { usePresentationMode } from "@/contexts/PresentationModeContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const TitleScreen = () => {
  const { session, isParticipant, participantCount } = useSession();
  const { mode } = usePresentationMode();
  const [copied, setCopied] = useState(false);
  
  const isEducator = mode === "educator";

  // Include presentation mode in join URL so participants get correct branding
  const joinUrl = session 
    ? `${window.location.origin}/?join=${session.code}&presentation=${mode}`
    : "";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center animate-fade-in relative overflow-hidden min-h-0">
      {/* Background - different styling per mode */}
      <div className="absolute inset-0" style={{ isolation: 'isolate' }}>
        {isEducator ? (
          <>
            {/* Educator: Solid gradient background - no decorative elements that could cause blur */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
          </>
        ) : (
          <>
            {/* Wine: Original vineyard background */}
            <img 
              src={vineyardHero} 
              alt="Delicato vineyard at sunset" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-secondary/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
          </>
        )}
      </div>

      {/* Content - Main title + Join panel */}
      <div 
        className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8"
        style={{ 
          isolation: 'isolate',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        {/* Left: Title */}
        <div className="text-center lg:text-left space-y-4 flex-1 min-w-0">
          {/* Brand Badge - mode-specific */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/50 rounded-full border border-white/20">
            {isEducator ? (
              <>
                <GraduationCap className="h-4 w-4 text-white" />
                <span className="text-white font-semibold text-sm">Penn Learning Network</span>
                <span className="w-1 h-1 rounded-full bg-white/50" />
                <span className="text-white/80 text-xs">Module 4</span>
              </>
            ) : (
              <>
                <Wine className="h-4 w-4 text-secondary" />
                <span className="text-secondary font-semibold text-sm">Delicato Family Wines</span>
                <span className="w-1 h-1 rounded-full bg-white/50" />
                <span className="text-white/80 text-xs">National Accounts</span>
              </>
            )}
          </div>
          
          {/* Main Title - mode-specific */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
            {isEducator ? "The Agile" : "The Artistic"}
            <span className={`block ${isEducator ? "text-white" : "text-secondary"}`}>
              AI Mindset
            </span>
          </h1>
          
          {/* Single Tagline - mode-specific */}
          <p className="text-lg md:text-xl text-white/90 font-light tracking-wide">
            {isEducator 
              ? "Adaptive approaches to AI integration in education" 
              : "Think differently. Sell smarter."}
          </p>

          {/* Presenter hint */}
          {!isParticipant && (
            <div className="pt-4">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-white/40 text-sm">
                <kbd className="px-2 py-1 text-xs bg-white/20 rounded border border-white/20">Space</kbd>
                <span>to begin</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Join Panel - only show when session active or participant */}
        {(isParticipant || session) && (
          <div className="flex-shrink-0 w-full lg:w-auto max-w-sm">
            {isParticipant ? (
              <div className="bg-black/40 rounded-2xl p-5 border border-white/20 text-center">
                <div className="flex items-center justify-center gap-2 text-white mb-2">
                  <Users className="h-5 w-5 text-secondary" />
                  <span className="font-semibold">You're connected!</span>
                </div>
                <p className="text-white/70 text-sm">
                  Keep this screen handy — we'll use it for interactive moments throughout.
                </p>
              </div>
            ) : (
              <div className="bg-black/40 rounded-2xl p-5 border border-white/20 text-center space-y-3">
                {/* Join instruction */}
                <p className="text-white/90 font-medium">
                  Join the session
                </p>
                
                {/* QR Code */}
                <div className="bg-white p-3 rounded-xl mx-auto w-fit">
                  <QRCodeSVG value={joinUrl} size={140} level="M" />
                </div>
                
                {/* Session Code */}
                <div className="text-center">
                  <p className="text-white/80 text-sm mb-1">Or enter code</p>
                  <p className="text-3xl font-black text-secondary tracking-wider">
                    {session?.code}
                  </p>
                </div>
                
                {/* URL + Copy */}
                <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                  <p className="text-white/90 font-mono text-sm break-all mb-2">
                    {joinUrl.replace('https://', '').replace('http://', '')}
                  </p>
                  <Button
                    size="sm"
                    onClick={copyToClipboard}
                    className="bg-white text-foreground hover:bg-white/90 font-medium"
                  >
                    {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                </div>
                
                {/* Participant count */}
                {participantCount > 0 && (
                  <div className="flex items-center justify-center gap-2 text-secondary pt-1">
                    <Users className="h-4 w-4" />
                    <span className="font-bold text-sm">{participantCount} joined</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
