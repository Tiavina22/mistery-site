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
import CreatorDashboardNew from "./pages/CreatorDashboardNew";
import CreatorSettings from "./pages/CreatorSettings";
import CreateStory from "./pages/CreateStory";
import CreatorStories from "./pages/CreatorStories";
import CreatorStoriesNew from "./pages/CreatorStoriesNew";
import ManageChapters from "./pages/ManageChapters";
import CreatorAnalytics from "./pages/CreatorAnalytics";
import CreatorNotifications from "./pages/CreatorNotifications";

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
                <Route path="/creator/dashboard" element={<CreatorDashboardNew />} />
                <Route path="/creator/settings" element={<CreatorSettings />} />
                <Route path="/creator/stories" element={<CreatorStoriesNew />} />
                <Route path="/creator/story/new" element={<CreateStory />} />
                <Route path="/creator/analytics" element={<CreatorAnalytics />} />
                <Route path="/creator/notifications" element={<CreatorNotifications />} />
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
