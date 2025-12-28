import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreatorLogin from "./pages/CreatorLogin";
import CreatorRegister from "./pages/CreatorRegister";
import CreatorDashboard from "./pages/CreatorDashboard";
import CreatorSettings from "./pages/CreatorSettings";
import CreateStory from "./pages/CreateStory";
import CreatorStories from "./pages/CreatorStories";
import ManageGenres from "./pages/ManageGenres";
import ManageChapters from "./pages/ManageChapters";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/creator/login" element={<CreatorLogin />} />
                <Route path="/creator/register" element={<CreatorRegister />} />
                <Route path="/creator/dashboard" element={<CreatorDashboard />} />
                <Route path="/creator/settings" element={<CreatorSettings />} />
                <Route path="/creator/stories" element={<CreatorStories />} />
                <Route path="/creator/story/new" element={<CreateStory />} />
                <Route path="/creator/genres" element={<ManageGenres />} />
                <Route path="/creator/stories/:storyId/chapters" element={<ManageChapters />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
