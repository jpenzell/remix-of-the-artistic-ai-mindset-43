import { Wine, GraduationCap } from "lucide-react";
import { usePresentationMode, PresentationMode } from "@/contexts/PresentationModeContext";
import { cn } from "@/lib/utils";

interface PresentationModeToggleProps {
  className?: string;
}

export const PresentationModeToggle = ({ className }: PresentationModeToggleProps) => {
  const { mode, setMode } = usePresentationMode();

  const options: { value: PresentationMode; label: string; icon: React.ReactNode }[] = [
    { value: "wine", label: "Wine", icon: <Wine className="w-4 h-4" /> },
    { value: "educator", label: "Educator", icon: <GraduationCap className="w-4 h-4" /> },
  ];

  return (
    <div className={cn("flex items-center gap-1 p-1 rounded-full bg-muted/50 border border-border", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => setMode(option.value)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
            mode === option.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          {option.icon}
          <span className="hidden sm:inline">{option.label}</span>
        </button>
      ))}
    </div>
  );
};
