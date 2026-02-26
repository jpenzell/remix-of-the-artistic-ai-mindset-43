import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ElephantQuestionProvider } from "@/contexts/ElephantQuestionContext";
import { SessionProvider } from "@/contexts/SessionContext";
import { PollProvider } from "@/contexts/PollContext";
import { PresentationModeProvider } from "@/contexts/PresentationModeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PresentationModeProvider>
        <SessionProvider>
          <PollProvider>
            <ElephantQuestionProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </ElephantQuestionProvider>
          </PollProvider>
        </SessionProvider>
      </PresentationModeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
