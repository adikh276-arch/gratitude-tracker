import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LanguageSelector from "./components/LanguageSelector";
import AuthGuard from "./components/AuthGuard";
import MoodSelection from "./pages/MoodSelection";
import GratitudeEntry from "./pages/GratitudeEntry";
import ReviewEntry from "./pages/ReviewEntry";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import Token from "./pages/Token";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageSelector />
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/gratitude_tracker">
        <Routes>
          <Route path="/token" element={<Token />} />
          <Route path="/" element={<AuthGuard><GratitudeEntry /></AuthGuard>} />
          <Route path="/mood" element={<AuthGuard><MoodSelection /></AuthGuard>} />
          <Route path="/review" element={<AuthGuard><ReviewEntry /></AuthGuard>} />
          <Route path="/history" element={<AuthGuard><History /></AuthGuard>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
