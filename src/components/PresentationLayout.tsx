import { ReactNode, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, Info, ZoomIn, ZoomOut, Maximize2, Users, Play, RotateCcw, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ModeSelector } from "@/components/ModeSelector";
import { SessionQRCode } from "@/components/SessionQRCode";
import { PresentationModeToggle } from "@/components/PresentationModeToggle";
import { useSession } from "@/contexts/SessionContext";
import { usePresentationMode } from "@/contexts/PresentationModeContext";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface PresentationLayoutProps {
  children: ReactNode;
  currentScreen: string;
  totalScreens: number;
  currentIndex: number;
  onNavigate: (index: number) => void;
  title: string;
  duration?: number;
  notes?: string;
  mode?: "presenter" | "participant" | "present";
}

export const PresentationLayout = ({
  children,
  currentScreen,
  totalScreens,
  currentIndex,
  onNavigate,
  title,
  duration = 240,
  notes,
  mode = "presenter",
}: PresentationLayoutProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const { session, createSession, endSession, updateSlide, isPresenter: hasSession } = useSession();
  const { presentationTitle } = usePresentationMode();
  const [isRestarting, setIsRestarting] = useState(false);
  
  const handleRestart = async () => {
    setIsRestarting(true);
    await endSession(true);
    await createSession();
    setIsRestarting(false);
    toast.success("New session started!");
  };
  
  const isPresenter = mode === "presenter";
  const isPresent = mode === "present";
  const isParticipant = mode === "participant";

  // Sync slide changes to session when presenter navigates
  useEffect(() => {
    if (isPresenter && session) {
      updateSlide(currentScreen);
    }
  }, [currentScreen, isPresenter, session, updateSlide]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 60000); // Update every minute
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}:${mins.toString().padStart(2, "0")}`;
  };

  const progress = (currentIndex / (totalScreens - 1)) * 100;
  const timeProgress = (elapsedTime / duration) * 100;

  const handleKeyPress = (e: KeyboardEvent) => {
    // Only presenter can navigate
    if (!isPresenter) return;
    
    // Don't handle keyboard shortcuts if user is typing in an input/textarea
    const target = e.target as HTMLElement;
    const isTyping = target.tagName === 'INPUT' || 
                     target.tagName === 'TEXTAREA' || 
                     target.isContentEditable;
    const isSlider = target.closest('[role="slider"]') !== null;
    
    // Space always navigates (even on sliders), arrow keys only navigate when not on slider
    if (e.key === " ") {
      if (!isTyping) {
        e.preventDefault();
        if (currentIndex < totalScreens - 1) {
          onNavigate(currentIndex + 1);
        }
      }
    } else if (e.key === "ArrowRight") {
      if (!isTyping && !isSlider) {
        e.preventDefault();
        if (currentIndex < totalScreens - 1) {
          onNavigate(currentIndex + 1);
        }
      }
    } else if (e.key === "ArrowLeft") {
      if (!isTyping && !isSlider) {
        e.preventDefault();
        if (currentIndex > 0) {
          onNavigate(currentIndex - 1);
        }
      }
    } else if (e.key === "=" || e.key === "+") {
      e.preventDefault();
      setZoom((prev) => Math.min(prev + 10, 200));
    } else if (e.key === "-") {
      e.preventDefault();
      setZoom((prev) => Math.max(prev - 10, 50));
    } else if (e.key === "0") {
      e.preventDefault();
      setZoom(100);
    }
  };
  
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));
  const handleZoomReset = () => setZoom(100);
  
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentIndex]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      {/* Header - hidden in present mode */}
      {!isPresent && (
        <header className="border-b bg-card/80 backdrop-blur-sm px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-lg font-semibold text-foreground">{presentationTitle}</h1>
            <span className="text-sm text-muted-foreground">
              Screen {currentIndex + 1} of {totalScreens}
            </span>
            <ModeSelector currentMode={mode} />
            
            {/* Session controls - presenter only */}
            {isPresenter && !session && (
              <Button
                variant="outline"
                size="sm"
                onClick={createSession}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                Start Session
              </Button>
            )}
            {isPresenter && session && (
              <div className="flex items-center gap-2">
                <SessionQRCode />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRestart}
                  disabled={isRestarting}
                  className="gap-1 text-muted-foreground hover:text-secondary"
                  title="Restart session with new code"
                >
                  <RotateCcw className={`h-3 w-3 ${isRestarting ? 'animate-spin' : ''}`} />
                  {isRestarting ? 'Restarting...' : 'Restart'}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => endSession(false)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  title="End session"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 border rounded-md px-2 py-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-xs font-mono text-muted-foreground min-w-[3rem] text-center">
                {zoom}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleZoomIn}
                disabled={zoom >= 200}
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
            </div>


            {/* Progress */}
            <div className="w-32">
              <Progress value={progress} className="h-2" />
            </div>

            {/* Navigation - presenter only */}
            {isPresenter && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onNavigate(currentIndex - 1)}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onNavigate(currentIndex + 1)}
                  disabled={currentIndex === totalScreens - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}


            {/* Settings Sheet - presenter only */}
            {isPresenter && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" title="Presentation Settings">
                    <Settings className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Presentation Settings</SheetTitle>
                    <SheetDescription>
                      Configure presentation mode and appearance
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Presentation Mode</h4>
                      <PresentationModeToggle />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}

            {/* Notes Sheet - presenter only */}
            {notes && isPresenter && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Speaker Notes</SheetTitle>
                    <SheetDescription>
                      Notes for screen: {currentScreen}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-4 prose prose-sm max-w-none">
                    <p className="text-foreground">{notes}</p>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </header>
      )}

      {/* Time Progress Bar - presenter only */}
      {isPresenter && !isPresent && (
        <Progress value={timeProgress} className="h-1 rounded-none" />
      )}

      {/* Main Content with Zoom */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div 
          className="flex-1 flex flex-col max-w-7xl mx-auto p-8 md:p-12 transition-transform duration-300 origin-top w-full"
          style={{ 
            transform: zoom === 100 ? 'none' : `scale(${zoom / 100})`,
            backfaceVisibility: 'hidden',
            WebkitFontSmoothing: 'antialiased',
          }}
        >
          <div className="flex-1 flex flex-col w-full overflow-hidden">
            {children}
          </div>
        </div>
      </main>

      {/* Footer Navigation - presenter only */}
      {isPresenter && !isPresent && (
        <footer className="border-t bg-card/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between shadow-sm">
          <Button
            variant="outline"
            size="lg"
            onClick={() => onNavigate(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="font-semibold"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <span className="text-sm font-mono text-muted-foreground bg-muted px-4 py-2 rounded-full">
            {currentScreen}
          </span>

          <Button
            size="lg"
            onClick={() => onNavigate(currentIndex + 1)}
            disabled={currentIndex === totalScreens - 1}
            className="font-semibold"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </footer>
      )}
      
      {/* Minimal controls in present mode - floating bottom right */}
      {isPresent && (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-card/90 backdrop-blur-sm border rounded-lg px-3 py-2 shadow-lg">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs font-mono text-muted-foreground min-w-[3rem] text-center">
            {zoom}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
